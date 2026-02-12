# 📋 GUÍA RÁPIDA: Cómo Completar los Módulos

## 🎯 Estado Actual

### ✅ Módulos Completados y Funcionales
- **Dashboard** (dashboard.js) - 100% funcional
- **Clientes** (clientes.js) - 100% funcional
- **Reportes** (reportes.js) - 90% funcional
- **Más** (mas.js) - 100% funcional

### ⚠️ Módulos Plantilla (Necesitan Completarse)
- **Productos** (productos.js) - 30% funcional
- **Pedidos** (pedidos.js) - 40% funcional
- **Inventario** (inventario.js) - 20% funcional
- **Finanzas** (finanzas.js) - 30% funcional

---

## 🔧 Cómo Completar Cada Módulo

### 1️⃣ PRODUCTOS (js/modules/productos.js)

**Funciones que necesitas copiar del archivo original:**

```javascript
// Buscar en el archivo original (jupeli-todo-en-uno.html) estas funciones:

// Líneas aproximadas: 2530-2750
function mostrarCategoria(categoria) { ... }
function mostrarProductosCategoria() { ... }
function mostrarProductosGrid(productos, grid) { ... }
function mostrarProductosTabla(productos, grid) { ... }

// Líneas aproximadas: 2740-2850
function verProductoDetalle(id) { ... }

// Líneas aproximadas: 2850-3050
function abrirModalProducto(id = null) { ... }
function guardarProducto(event, id = null) { ... }

// Líneas aproximadas: 3050-3100
function cambiarVistaProductos(vista) { ... }
function buscarEnSubcategoria() { ... }
```

**Pasos:**
1. Abre `jupeli-todo-en-uno.html` en un editor
2. Busca la función `function mostrarCategoria(`
3. Copia desde ahí hasta `function cambiarVistaProductos(vista)`
4. Pega en `js/modules/productos.js` reemplazando el comentario de NOTA
5. Prueba que funcione haciendo clic en "Productos"

### 2️⃣ PEDIDOS (js/modules/pedidos.js)

**Funciones principales:**

```javascript
// Líneas aproximadas: 3100-3500
function abrirModalPedido(id = null) { ... }
function guardarPedido(event, id = null) { ... }
function verPedidoDetalle(id) { ... }
function cambiarEstadoPedido(id, nuevoEstado) { ... }

// Líneas aproximadas: 3500-3800
function agregarProductoAPedido() { ... }
function calcularTotalPedido() { ... }
function eliminarProductoPedido(index) { ... }

// Líneas aproximadas: 3200-3250
function cambiarVistaPedidos(vista) { ... }
function mostrarPedidosTarjetas(pedidos) { ... }
function mostrarPedidosLista(pedidos) { ... }
```

**Pasos:**
1. Busca `function abrirModalPedido(` en el original
2. Copia todas las funciones relacionadas con pedidos
3. Pega en el módulo
4. Ajusta las referencias de DOM si es necesario

### 3️⃣ INVENTARIO (js/modules/inventario.js)

**Funciones principales:**

```javascript
// Líneas aproximadas: 4400-4600
function mostrarMateriales() { ... }
function abrirModalMaterial(id = null) { ... }
function guardarMaterial(event, id = null) { ... }

// Líneas aproximadas: 4600-4700
function ajustarStockMaterial(id, cantidad, tipo) { ... }
function verHistorialMaterial(id) { ... }
```

**Pasos:**
1. Busca `function mostrarMateriales(` en el original
2. Copia las funciones del módulo de inventario
3. Pega en `js/modules/inventario.js`

### 4️⃣ FINANZAS (js/modules/finanzas.js)

**Funciones principales:**

```javascript
// Líneas aproximadas: 4800-5100
function mostrarIngresos() { ... }
function mostrarGastos() { ... }
function abrirModalIngreso(id = null) { ... }
function abrirModalGasto(id = null) { ... }
function guardarIngreso(event, id = null) { ... }
function guardarGasto(event, id = null) { ... }
```

---

## 🚀 Método Rápido: Extracción Automatizada

Si prefieres un enfoque más rápido, puedes usar este script:

```bash
# En tu terminal, ejecuta:
cd /ruta/a/jupeli-modular

# Extraer funciones de Productos (ejemplo)
grep -A 100 "function mostrarCategoria" /ruta/al/archivo-original.html > temp_productos.js

# Luego copia manualmente las funciones que necesites
```

---

## ⚡ Atajos de Búsqueda

### En el archivo original, busca estos patrones:

**Para Productos:**
- `function mostrarCategoria`
- `function verProductoDetalle`
- `function abrirModalProducto`

**Para Pedidos:**
- `function abrirModalPedido`
- `function verPedidoDetalle`
- `function agregarProductoAPedido`

**Para Inventario:**
- `function mostrarMateriales`
- `function ajustarStockMaterial`

**Para Finanzas:**
- `function mostrarIngresos`
- `function abrirModalIngreso`

---

## 🎨 Personalización de Vistas

### Cambiar estructura de una vista:

1. Abre el archivo del módulo (ej: `productos.js`)
2. Busca la función `renderProductos()`
3. Modifica el `innerHTML` con tu nuevo diseño
4. Guarda y recarga la página

### Ejemplo:
```javascript
function renderProductos() {
    const container = document.getElementById('view-productos');
    
    container.innerHTML = `
        <h2>🎁 Mi Nueva Vista de Productos</h2>
        <!-- Tu diseño personalizado aquí -->
    `;
}
```

---

## 🔍 Debugging Tips

### Si algo no funciona:

1. **Abre la Consola del Navegador** (F12)
2. Busca errores en rojo
3. Verifica que las funciones estén definidas:
   ```javascript
   console.log(typeof renderProductos); // Debe ser "function"
   ```

### Errores comunes:

- **"X is not defined"**: Olvidaste copiar una función
- **"Cannot read property of null"**: El elemento HTML no existe
- **"X is not a function"**: La función está mal escrita o no se cargó

---

## 📦 Testeo de Módulos

### Prueba cada módulo:

1. **Dashboard**: ✅ Ya funciona - verifica que las estadísticas se actualicen
2. **Clientes**: ✅ Ya funciona - prueba agregar, editar, ver
3. **Productos**: ⚠️ Completa y prueba categorías
4. **Pedidos**: ⚠️ Completa y prueba crear pedido
5. **Inventario**: ⚠️ Completa y prueba agregar material
6. **Finanzas**: ⚠️ Completa y prueba ingresos/gastos
7. **Reportes**: ✅ Ya funciona - verifica gráficas
8. **Más**: ✅ Ya funciona - prueba exportar datos

---

## 💡 Consejos Finales

1. **Trabaja un módulo a la vez**: No intentes completar todo de golpe
2. **Prueba frecuentemente**: Después de cada función copiada, prueba que funcione
3. **Usa git**: Haz commits después de cada módulo completado
4. **Documenta cambios**: Agrega comentarios en el código
5. **Backup**: Guarda el archivo original siempre

---

## 🆘 ¿Necesitas Ayuda?

Si encuentras problemas:

1. Revisa que el módulo esté importado en `index.html`
2. Verifica que `database.js` y `utils.js` se carguen primero
3. Checa que no haya errores de sintaxis (paréntesis, llaves)
4. Compara con el módulo de Dashboard o Clientes que ya funcionan

---

**¡Éxito completando tu sistema modular JUPELI!** 🎁✨
