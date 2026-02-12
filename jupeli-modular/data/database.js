// ========== BASE DE DATOS JUPELI ==========
// Este archivo contiene la estructura de datos y funciones de persistencia

const DB_KEY = 'jupeli_database';

let db = {
    clientes: [],
    productos: [],
    pedidos: [],
    materiales: [],
    ingresos: [],
    gastos: [],
    // Nuevas tablas de inventario
    insumos: [],
    entradas: [],
    salidas: [],
    productosInventario: [],
    ventas: [],
    stockControl: []
};

let nextId = { 
    clientes: 1, 
    productos: 1, 
    pedidos: 1, 
    materiales: 1, 
    ingresos: 1, 
    gastos: 1,
    // Nuevos IDs de inventario
    insumos: 1,
    entradas: 1,
    salidas: 1,
    productosInventario: 1,
    ventas: 1,
    stockControl: 1
};

// Variables globales de estado
let currentFilter = 'todos';
let currentCategoria = '';
let imagenTemporal = null;
let vistaClientes = 'grid';
let vistaProductos = 'grid';
let vistaPedidos = 'tarjetas';

// ========== SISTEMA DE PERSISTENCIA ==========
function guardarEnLocalStorage() {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
        console.log('💾 Datos guardados en localStorage');
    } catch (error) {
        console.error('❌ Error al guardar datos:', error);
        alert('⚠️ Error al guardar los datos. Verifica el espacio disponible.');
    }
}

function cargarDesdeLocalStorage() {
    try {
        const datosGuardados = localStorage.getItem(DB_KEY);
        if (datosGuardados) {
            const datosParsed = JSON.parse(datosGuardados);
            db = datosParsed;
            
            // Asegurar que existen las nuevas tablas
            if (!db.insumos) db.insumos = [];
            if (!db.entradas) db.entradas = [];
            if (!db.salidas) db.salidas = [];
            if (!db.productosInventario) db.productosInventario = [];
            if (!db.ventas) db.ventas = [];
            if (!db.stockControl) db.stockControl = [];
            
            // Actualizar nextId para que sea mayor que cualquier ID existente
            if (db.clientes.length > 0) {
                nextId.clientes = Math.max(...db.clientes.map(c => c.id)) + 1;
            }
            if (db.productos.length > 0) {
                nextId.productos = Math.max(...db.productos.map(p => p.id)) + 1;
            }
            if (db.pedidos.length > 0) {
                nextId.pedidos = Math.max(...db.pedidos.map(p => p.id)) + 1;
            }
            if (db.materiales.length > 0) {
                nextId.materiales = Math.max(...db.materiales.map(m => m.id)) + 1;
            }
            if (db.ingresos.length > 0) {
                nextId.ingresos = Math.max(...db.ingresos.map(i => i.id)) + 1;
            }
            if (db.gastos.length > 0) {
                nextId.gastos = Math.max(...db.gastos.map(g => g.id)) + 1;
            }
            
            // Nuevos nextIds
            if (db.insumos.length > 0) {
                nextId.insumos = Math.max(...db.insumos.map(i => i.id)) + 1;
            }
            if (db.entradas.length > 0) {
                nextId.entradas = Math.max(...db.entradas.map(e => e.id)) + 1;
            }
            if (db.salidas.length > 0) {
                nextId.salidas = Math.max(...db.salidas.map(s => s.id)) + 1;
            }
            if (db.productosInventario.length > 0) {
                nextId.productosInventario = Math.max(...db.productosInventario.map(p => p.id)) + 1;
            }
            if (db.ventas.length > 0) {
                nextId.ventas = Math.max(...db.ventas.map(v => v.id)) + 1;
            }
            if (db.stockControl.length > 0) {
                nextId.stockControl = Math.max(...db.stockControl.map(s => s.id)) + 1;
            }
            
            console.log('✅ Datos cargados desde localStorage');
            return true;
        }
    } catch (error) {
        console.error('❌ Error al cargar datos:', error);
    }
    return false;
}

function exportarDatos() {
    const dataStr = JSON.stringify(db, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jupeli_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert('✅ Copia de seguridad descargada');
}

function importarDatos(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (confirm('⚠️ ¿Estás seguro? Esto reemplazará todos los datos actuales.')) {
                db = importedData;
                guardarEnLocalStorage();
                location.reload();
            }
        } catch (error) {
            alert('❌ Error al importar. Archivo inválido.');
        }
    };
    reader.readAsText(file);
}

function limpiarDatos() {
    if (confirm('⚠️ ¿ESTÁS SEGURO? Esto borrará TODOS los datos. Esta acción NO se puede deshacer.')) {
        if (confirm('⚠️ ÚLTIMA CONFIRMACIÓN: ¿Realmente quieres borrar todo?')) {
            localStorage.removeItem(DB_KEY);
            location.reload();
        }
    }
}
