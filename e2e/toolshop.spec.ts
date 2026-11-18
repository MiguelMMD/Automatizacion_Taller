import { test, expect } from '@playwright/test';

test.describe('Suite Avanzada - Toolshop (Casos Borde y Reglas de Negocio)', () => {

  // Login previo antes de cada prueba usando el cliente estándar
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.locator('[data-test="email"]').fill('customer@practicesoftwaretesting.com');
    await page.locator('[data-test="password"]').fill('welcome01');
    await page.locator('[data-test="login-submit"]').click();
    await expect(page).toHaveURL(/account/);
  });

  test('CP-001 Control de acceso RBAC: Cliente no puede acceder al panel de Admin', async ({ page }) => {
    // Intento de escalada de privilegios navegando directamente por URL
    await page.goto('/admin/dashboard');

    // El sistema debe redirigir al login o bloquear la vista de administración
    await expect(page).not.toHaveURL(/admin\/dashboard/);
  });

  test('CP-002 Bloqueo de compra en producto agotado (Out of Stock)', async ({ page }) => {
    await page.goto('/');
    // Buscar específicamente un producto marcado como agotado
    const productoAgotado = page.locator('a.card').filter({ hasText: 'Agotado' }).first();
    await productoAgotado.click();

    // El botón de agregar al carrito debe estar deshabilitado y mostrar aviso
    await expect(page.locator('[data-test="out-of-stock"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart"]')).toBeDisabled();
  });

  test('CP-003 Persistencia del carrito tras recargar la página (F5)', async ({ page }) => {
    await page.goto('/');
    await page.locator('a.card').filter({ hasText: 'Combination Pliers' }).click();
    await page.locator('[data-test="add-to-cart"]').click();
    await expect(page.locator('[data-test="cart-quantity"]')).toHaveText('1');

    // Recargar el navegador para validar persistencia en sesión/storage
    await page.reload();

    await expect(page.locator('[data-test="cart-quantity"]')).toHaveText('1');
  });


  test('CP-004 Intersección de filtros combinados (Categoría + Marca sin resultados)', async ({ page }) => {
    await page.goto('/');
    // Filtrar por una categoría y una marca que no tengan productos en común
    await page.getByLabel('Hammer').check();
    await page.getByLabel('MightyCraft Hardware').check();

    // Validar estado vacío controlado en lugar de errores o pantalla en blanco
    await expect(page.locator('[data-test="no-results"]')).toBeVisible();
    await expect(page.locator('a.card')).toHaveCount(0);
  });

  test('CP-005 Búsqueda insensible a mayúsculas y espacios laterales (Trim & Case)', async ({ page }) => {
    await page.goto('/');
    const barraBusqueda = page.locator('[data-test="search-query"]');
    
    // Ingresar texto sucio con espacios y mayúsculas mezcladas
    await barraBusqueda.fill('   pLiErS   ');
    await page.locator('[data-test="search-submit"]').click();

    // Debe encontrar resultados relevantes limpios
    const tarjetas = page.locator('a.card');
    await expect(tarjetas.first()).toContainText(/Pliers/i);
  });

  test('CP-006 Prevención de duplicados en la lista de Favoritos', async ({ page }) => {
    await page.goto('/');
    await page.locator('a.card').filter({ hasText: 'Bolt Cutters' }).click();
    
    // Primer clic: agrega a favoritos
    await page.locator('[data-test="add-to-favorites"]').click();
    await expect(page.locator('.toast-message')).toContainText(/added to your favorites/i);

    // Segundo clic sobre el mismo producto: debe alertar que ya existe
    await page.locator('[data-test="add-to-favorites"]').click();
    await expect(page.locator('.toast-message')).toContainText(/already in your favorites/i);
  });

  test('CP-007 Ordenamiento numérico real por precio (Descendente)', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-test="sort"]').selectOption('price,desc');

    // Esperar a que la petición de ordenamiento actualice el DOM
    await page.waitForTimeout(1000); 
    const preciosText = await page.locator('[data-test="product-price"]').allInnerTexts();
    const preciosNumeros = preciosText.map(p => parseFloat(p.replace('$', '')));

    // Validar matemáticamente que el primer producto sea más caro o igual que el segundo
    expect(preciosNumeros[0]).toBeGreaterThanOrEqual(preciosNumeros[1]);
  });

});