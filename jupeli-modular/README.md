# 🎁 JUPELI - Sistema Modular

## 📁 Estructura del Proyecto

```
jupeli-modular/
│
├── index.html                  # Archivo maestro (HTML principal)
│
├── css/
│   └── styles.css              # Estilos globales (extraídos del original)
│
├── data/
│   ├── database.js             # Base de datos y persistencia (localStorage)
│   └── utils.js                # Utilidades compartidas (validaciones, formateo, etc.)
│
└── js/
    ├── app.js                  # Inicializador principal de la aplicación
    │
    └── modules/                # Módulos independientes por pestaña
        ├── dashboard.js        # Módulo del Dashboard (Inicio)
        ├── clientes.js         # Módulo de Clientes
        ├── productos.js        # Módulo de Productos
        ├── pedidos.js          # Módulo de Pedidos
        ├── inventario.js       # Módulo de Inventario
        ├── finanzas.js         # Módulo de Finanzas
        ├── reportes.js         # Módulo de Reportes
        └── mas.js              # Módulo de "Más" (configuración, backups, etc.)
```

## 🔄 Flujo de Funcionamiento

### 1. Carga Inicial (index.html)
- Carga la estructura HTML base
- Importa estilos globales (styles.css)
- Carga librerías externas (SheetJS para Excel)
- Define contenedores vacíos para cada vista

### 2. Inicialización (app.js)
- Carga datos desde localStorage
- Inicializa todos los módulos
- Configura la navegación
- Renderiza la vista inicial (Dashboard)

### 3. Módulos Independientes
Cada módulo (dashboard.js, clientes.js, etc.) contiene:
- `init[Módulo]()`: Función de inicialización
- `render[Módulo]()`: Función para renderizar la vista
- Funciones específicas del módulo (agregar, editar, eliminar, etc.)

### 4. Datos Compartidos (database.js)
- Estructura de datos unificada
- Funciones de persistencia (guardar/cargar/exportar/importar)
- Variables globales de estado

### 5. Utilidades Compartidas (utils.js)
- Validaciones
- Formateo de moneda y fechas
- Funciones de navegación
- Sistema de modales
- Herramientas de búsqueda y estadísticas

## 🎯 Ventajas de esta Arquitectura

### ✅ Organización
- Cada pestaña es un archivo independiente
- Fácil de mantener y actualizar
- Código más legible y estructurado

### ✅ Escalabilidad
- Agregar nuevas pestañas es simple: crear un nuevo módulo
- Modificar una sección no afecta a las demás
- Puedes trabajar en un módulo sin tocar los otros

### ✅ Performance
- Carga más rápida (archivos más pequeños)
- Navegador puede cachear archivos individuales
- Fácil de debuggear (errores señalan archivo específico)

### ✅ Colaboración
- Múltiples personas pueden trabajar en diferentes módulos
- Control de versiones más limpio (Git)
- Menos conflictos de merge

## 🚀 Cómo Agregar una Nueva Pestaña

1. **Crear el módulo**: `js/modules/nueva-seccion.js`
```javascript
// Inicialización
function initNuevaSeccion() {
    console.log('✅ Módulo Nueva Sección inicializado');
}

// Renderizado
function renderNuevaSeccion() {
    const container = document.getElementById('view-nueva-seccion');
    container.innerHTML = `
        <h2>Mi Nueva Sección</h2>
        <p>Contenido aquí...</p>
    `;
}
```

2. **Agregar en index.html**:
```html
<!-- En <main> -->
<div id="view-nueva-seccion" class="view"></div>

<!-- En navegación -->
<div class="nav-item" data-view="view-nueva-seccion">
    <div class="nav-icon">🆕</div>
    <div class="nav-label">Nueva</div>
</div>

<!-- Antes de </body> -->
<script src="js/modules/nueva-seccion.js"></script>
```

3. **Agregar en app.js**:
```javascript
function inicializarApp() {
    // ...
    initNuevaSeccion(); // Agregar aquí
}

function renderizarVista(vistaId) {
    // ...
    case 'view-nueva-seccion':
        renderNuevaSeccion();
        break;
}
```

## 📝 Notas de Implementación

### Extracción del Código Original
El código de tu archivo `jupeli-todo-en-uno.html` (5600+ líneas) se ha distribuido así:

- **Líneas 7-1056**: → `css/styles.css`
- **Líneas 1765-1877**: → `data/database.js` (estructura de datos)
- **Líneas 1885-2000+**: → `data/utils.js` (utilidades)
- **Resto**: Distribuido en módulos según funcionalidad

### Personalización de Módulos
Los módulos creados son **plantillas funcionales**. Para completarlos:

1. Abre tu archivo original `jupeli-todo-en-uno.html`
2. Busca las funciones específicas de cada módulo
3. Copia y pega en el archivo modular correspondiente
4. Ajusta referencias a elementos DOM si es necesario

## 🔧 Siguiente Paso: Completar Módulos

Los archivos base ya están creados. Para cada módulo:

1. **Identifica funciones** en el archivo original
2. **Extrae el código** correspondiente a ese módulo
3. **Pégalo** en el archivo del módulo
4. **Prueba** que funcione correctamente

Ejemplo para Clientes:
```bash
# En el original busca:
- function actualizarStatsClientes()
- function mostrarClientes()
- function abrirModalCliente()
- function guardarCliente()
# Y cópialas a js/modules/clientes.js
```

## 📦 Archivos Ya Creados

✅ index.html - Estructura base
✅ css/styles.css - Estilos completos
✅ data/database.js - Sistema de datos
✅ data/utils.js - Utilidades completas
✅ js/app.js - Inicializador
✅ js/modules/*.js - Plantillas de módulos

## 🎨 Personalización

### Cambiar Colores
Edita las variables CSS en `css/styles.css`:
```css
:root {
    --primary: #e91e63;
    --primary-dark: #c2185b;
    /* ... más colores */
}
```

### Agregar Funcionalidades
Cada módulo es independiente, modifica según necesites.

## 💾 Backup y Migración

Los datos se mantienen en localStorage con la misma estructura:
- Importar/Exportar funciona igual
- Compatible con tu versión anterior
- Solo copia el JSON y usa "Importar Datos"

---

**Creado para**: Sistema de gestión JUPELI
**Versión**: 2.0 (Modular)
**Fecha**: 2025
