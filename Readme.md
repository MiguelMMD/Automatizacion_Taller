# Automatización de Pruebas E2E - Practice Software Testing (Toolshop)

Suite de pruebas automatizadas End-to-End (E2E) desarrollada con **Playwright** y **TypeScript** sobre la aplicación web de comercio electrónico [Practice Software Testing](https://practicesoftwaretesting.com).

---

## Requisitos Previos

- **Node.js** (versión 18 o superior)
- **npm** (incluido con Node.js)
- **Visual Studio Code** (recomendado con la extensión oficial _Playwright Test for VSCode_)

---

## Instalación y Configuración

1. **Instalar las dependencias del proyecto:**

   ```bash
   npm install
   ```

2. **Descargar los navegadores requeridos por Playwright:**

   ```bash
   npx playwright install
   ```

3. **Verificar la configuración de `baseURL`:**
   Asegúrate de que el archivo `playwright.config.ts` contenga la URL base del entorno bajo prueba:
   ```typescript
   use: {
     baseURL: 'https://practicesoftwaretesting.com',
     trace: 'on-first-retry',
     screenshot: 'only-on-failure',
   },
   ```

---

## Comandos de Ejecución

### 1. Ejecución General

- **Ejecutar todas las pruebas en modo headless (segundo plano):**
  ```bash
  npx playwright test
  ```
- **Ejecutar viendo el navegador en tiempo real (`--headed`):**
  ```bash
  npx playwright test --headed
  ```
- **Ejecutar en modo visual interactivo (UI Mode - ideal para depuración y demostraciones):**
  ```bash
  npx playwright test --ui
  ```

### 2. Ejecución Específica

- **Ejecutar un archivo de pruebas puntual:**
  ```bash
  npx playwright test tests/toolshop.spec.ts
  ```
- **Ejecutar un único caso de prueba por su código o nombre:**
  ```bash
  npx playwright test -g "CP-001"
  ```
- **Ejecutar en un navegador específico (Chromium, Firefox o WebKit):**
  ```bash
  npx playwright test --project=chromium
  ```
- **Ejecutar la prueba viendo el navegador**
  ```
  npx playwright test --headed
  ```
- **Ver la prueba despacio**
  ```
  npx playwright test --debug
  ```

### 3. Reportes y Depuración

- **Abrir el reporte HTML generado tras la ejecución:**
  ```bash
  npx playwright show-report
  ```
- **Generar código de pruebas automáticamente grabando acciones (Codegen):**
  ```bash
  npx playwright codegen https://practicesoftwaretesting.com
  ```

---

## Estructura del Proyecto

```text
Automatizacion-TallerFinal/
├── tests/
│   └── toolshop.spec.ts      # Suite principal con los 10 casos de prueba E2E
├── playwright-report/        # Reporte HTML generado automáticamente tras ejecutar tests
├── test-results/             # Capturas de pantalla, videos y trazas de fallos
├── package.json              # Dependencias y scripts de Node.js
├── playwright.config.ts      # Configuración global de navegadores, timeouts y baseURL
└── README.md                 # Documentación del proyecto
```

---

## Resumen de Casos de Prueba Automatizados

| ID         | Nombre del Caso de Prueba                                             | Tipo de Validación       |
| :--------- | :-------------------------------------------------------------------- | :----------------------- |
| **CP-001** | Control de acceso RBAC (Cliente intenta entrar a `/admin/dashboard`)  | Seguridad / Redirección  |
| **CP-002** | Bloqueo de compra en producto agotado (_Out of Stock_)                | Regla de negocio / UI    |
| **CP-003** | Persistencia del carrito tras recargar la página (`F5`)               | Estado de sesión         |
| **CP-004** | Cálculo dinámico de subtotal al modificar cantidad en carrito         | Lógica matemática        |
| **CP-005** | Intersección de filtros combinados sin resultados                     | Manejo de estado vacío   |
| **CP-006** | Búsqueda insensible a mayúsculas y espacios laterales (_Trim & Case_) | Saneamiento de entradas  |
| **CP-007** | Prevención de duplicados en la lista de Favoritos                     | Integridad de datos      |
| **CP-008** | Ordenamiento numérico real por precio (Descendente)                   | Ordenamiento de catálogo |
| **CP-009** | Validación de cantidad cero o negativa en el carrito                  | Validación negativa      |
| **CP-010** | Flujo E2E completo de _Checkout_ con pago contra entrega              | Flujo transaccional      |

---

## Credenciales de Prueba Utilizadas

- **Rol Cliente:** `customer@practicesoftwaretesting.com`
- **Contraseña:** `welcome01`
