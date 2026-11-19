import { test, expect } from '@playwright/test';

test.describe('Suite Avanzada - Toolshop (Español)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/auth/login');
    await page.locator('[data-test="email"]').fill('customer@practicesoftwaretesting.com');
    await page.locator('[data-test="password"]').fill('welcome01');
    await page.locator('[data-test="login-submit"]').click();

    // Esperar a que la barra de navegación muestre el menú del usuario logueado
    await expect(page.locator('[data-test="nav-menu"]')).toBeVisible({ timeout: 15000 });
  });

  test('CP-001 Control de acceso : Cliente no puede acceder al panel de Admin', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).not.toHaveURL(/admin\/dashboard/);
  });

  test('CP-002 Bloqueo de compra en producto agotado', async ({ page }) => {
    await page.goto('/');
    // Usa el atributo data-test en lugar del texto "Out of stock" / "Agotado"
    const productoAgotado = page.locator('a.card').filter({ has: page.locator('[data-test="out-of-stock"]') }).first();
    await productoAgotado.click();

    await expect(page.locator('[data-test="out-of-stock"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart"]')).toBeDisabled();
  });

  test('CP-003 Persistencia del carrito tras recargar la página (F5)', async ({ page }) => {
    await page.goto('/');
    await page.locator('a.card').first().click();
    await page.locator('[data-test="add-to-cart"]').click();
    await expect(page.locator('[data-test="cart-quantity"]')).toHaveText('1');

    await page.reload();
    await expect(page.locator('[data-test="cart-quantity"]')).toHaveText('1');
  });

  test('CP-004 Búsqueda insensible a mayúsculas y espacios laterales', async ({ page }) => {
    await page.goto('/');
    // Tomamos el nombre real de la primera tarjeta para buscarlo sucio
    const nombreReal = await page.locator('[data-test="product-name"]').first().innerText();
    const palabraClave = nombreReal.split(' ')[0];

    await page.locator('[data-test="search-query"]').fill(`   ${palabraClave.toUpperCase()}   `);
    await page.locator('[data-test="search-submit"]').click();

    await expect(page.locator('a.card').first()).toContainText(new RegExp(palabraClave, 'i'));
  });

  test('CP-005 Ordenamiento numérico real por precio (Descendente)', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-test="sort"]').selectOption('price,desc');

    await page.waitForTimeout(1000);
    const preciosText = await page.locator('[data-test="product-price"]').allInnerTexts();
    const preciosNumeros = preciosText.map(p => parseFloat(p.replace('$', '')));
    expect(preciosNumeros[0]).toBeGreaterThanOrEqual(preciosNumeros[1]);
  });

});