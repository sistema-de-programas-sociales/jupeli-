// ========== BASE DE DATOS JUPELI CON FIREBASE FIRESTORE ==========
// Este archivo contiene la estructura de datos y funciones de persistencia en la nube

const DB_KEY = 'jupeli_database'; // Mantener para migración desde localStorage

// Estructura en memoria (se sincroniza con Firestore)
let db = {
    clientes: [],
    productos: [],
    pedidos: [],
    materiales: [],
    ingresos: [],
    gastos: [],
    insumos: [],
    entradas: [],
    salidas: [],
    productosInventario: [],
    ventas: [],
    stockControl: [],
    recetas: [] // Nueva colección para recetas de costeo
};

let nextId = { 
    clientes: 1, 
    productos: 1, 
    pedidos: 1, 
    materiales: 1, 
    ingresos: 1, 
    gastos: 1,
    insumos: 1,
    entradas: 1,
    salidas: 1,
    productosInventario: 1,
    ventas: 1,
    stockControl: 1,
    recetas: 1 // ID para recetas
};

// Variables globales de estado (solo en memoria)
let currentFilter = 'todos';
let currentCategoria = '';
let imagenTemporal = null;
let vistaClientes = 'grid';
let vistaProductos = 'grid';
let vistaPedidos = 'tarjetas';

// Estado de sincronización
let firestoreReady = false;
let listeners = {}; // Para almacenar listeners de Firestore

// ========== SISTEMA DE PERSISTENCIA CON FIRESTORE ==========

/**
 * Inicializa la conexión con Firestore y carga datos
 */
async function inicializarFirestore() {
    try {
        console.log('🔥 Inicializando Firestore...');
        
        // Cargar datos de todas las colecciones
        await cargarDesdeFirestore();
        
        // Configurar listeners para sincronización en tiempo real
        configurarListenersFirestore();
        
        // Intentar migrar datos de localStorage si existen
        await migrarDesdeLocalStorage();
        
        firestoreReady = true;
        console.log('✅ Firestore inicializado correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error al inicializar Firestore:', error);
        alert('⚠️ Error al conectar con Firebase. Verifica tu configuración.');
        return false;
    }
}

/**
 * Carga todos los datos desde Firestore
 */
async function cargarDesdeFirestore() {
    const colecciones = Object.keys(db);
    
    for (const coleccion of colecciones) {
        try {
            const snapshot = await jupeli_db.doc('main').collection(coleccion).get();
            db[coleccion] = [];
            
            snapshot.forEach(doc => {
                db[coleccion].push({ ...doc.data(), firestoreId: doc.id });
            });
            
            // Actualizar nextId
            if (db[coleccion].length > 0) {
                const maxId = Math.max(...db[coleccion].map(item => item.id || 0));
                nextId[coleccion] = maxId + 1;
            }
            
            console.log(`📥 ${coleccion}: ${db[coleccion].length} registros cargados`);
        } catch (error) {
            console.error(`❌ Error al cargar ${coleccion}:`, error);
        }
    }
}

/**
 * Configura listeners para sincronización en tiempo real
 */
function configurarListenersFirestore() {
    const colecciones = Object.keys(db);
    
    colecciones.forEach(coleccion => {
        listeners[coleccion] = jupeli_db.doc('main').collection(coleccion)
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    const data = { ...change.doc.data(), firestoreId: change.doc.id };
                    
                    if (change.type === 'added') {
                        // Verificar si ya existe (evitar duplicados en carga inicial)
                        const existe = db[coleccion].find(item => 
                            item.firestoreId === data.firestoreId
                        );
                        if (!existe) {
                            db[coleccion].push(data);
                            console.log(`➕ Nuevo ${coleccion}:`, data.id);
                        }
                    }
                    
                    if (change.type === 'modified') {
                        const index = db[coleccion].findIndex(item => 
                            item.firestoreId === data.firestoreId
                        );
                        if (index !== -1) {
                            db[coleccion][index] = data;
                            console.log(`🔄 Actualizado ${coleccion}:`, data.id);
                        }
                    }
                    
                    if (change.type === 'removed') {
                        db[coleccion] = db[coleccion].filter(item => 
                            item.firestoreId !== data.firestoreId
                        );
                        console.log(`➖ Eliminado ${coleccion}:`, data.id);
                    }
                });
                
                // Disparar evento personalizado para actualizar UI
                window.dispatchEvent(new CustomEvent('dbUpdated', { 
                    detail: { coleccion } 
                }));
            }, error => {
                console.error(`❌ Error en listener de ${coleccion}:`, error);
            });
    });
}

/**
 * Guarda un registro en Firestore
 */
async function guardarEnFirestore(coleccion, data) {
    try {
        if (!firestoreReady) {
            console.warn('⚠️ Firestore no está listo, guardando en memoria...');
            return;
        }
        
        const docRef = await jupeli_db.doc('main').collection(coleccion).add(data);
        console.log(`💾 ${coleccion} guardado en Firestore:`, docRef.id);
        return docRef.id;
    } catch (error) {
        console.error(`❌ Error al guardar ${coleccion}:`, error);
        throw error;
    }
}

/**
 * Actualiza un registro en Firestore
 */
async function actualizarEnFirestore(coleccion, firestoreId, data) {
    try {
        if (!firestoreReady) {
            console.warn('⚠️ Firestore no está listo');
            return;
        }
        
        await jupeli_db.doc('main').collection(coleccion).doc(firestoreId).update(data);
        console.log(`🔄 ${coleccion} actualizado en Firestore:`, firestoreId);
    } catch (error) {
        console.error(`❌ Error al actualizar ${coleccion}:`, error);
        throw error;
    }
}

/**
 * Elimina un registro de Firestore
 */
async function eliminarDeFirestore(coleccion, firestoreId) {
    try {
        if (!firestoreReady) {
            console.warn('⚠️ Firestore no está listo');
            return;
        }
        
        await jupeli_db.doc('main').collection(coleccion).doc(firestoreId).delete();
        console.log(`🗑️ ${coleccion} eliminado de Firestore:`, firestoreId);
    } catch (error) {
        console.error(`❌ Error al eliminar ${coleccion}:`, error);
        throw error;
    }
}

/**
 * Migra datos desde localStorage a Firestore (solo la primera vez)
 */
async function migrarDesdeLocalStorage() {
    try {
        const datosLocales = localStorage.getItem(DB_KEY);
        if (!datosLocales) {
            console.log('ℹ️ No hay datos en localStorage para migrar');
            return;
        }
        
        const confirmMigrar = confirm(
            '🔄 Se encontraron datos en localStorage.\n\n' +
            '¿Deseas migrarlos a Firebase?\n' +
            'Esto solo debe hacerse UNA VEZ.\n\n' +
            'Si otro usuario ya migró los datos, selecciona CANCELAR.'
        );
        
        if (!confirmMigrar) return;
        
        const dbLocal = JSON.parse(datosLocales);
        console.log('🔄 Iniciando migración desde localStorage...');
        
        for (const [coleccion, datos] of Object.entries(dbLocal)) {
            if (Array.isArray(datos) && datos.length > 0) {
                console.log(`📤 Migrando ${datos.length} registros de ${coleccion}...`);
                
                for (const item of datos) {
                    // Eliminar firestoreId si existe
                    const { firestoreId, ...itemLimpio } = item;
                    await guardarEnFirestore(coleccion, itemLimpio);
                }
            }
        }
        
        console.log('✅ Migración completada');
        alert('✅ Datos migrados exitosamente a Firebase!\n\nAhora puedes eliminar localStorage de forma segura.');
        
        // Opcional: Limpiar localStorage después de migración exitosa
        if (confirm('¿Deseas limpiar localStorage ahora?')) {
            localStorage.removeItem(DB_KEY);
            console.log('🗑️ localStorage limpiado');
        }
        
    } catch (error) {
        console.error('❌ Error en migración:', error);
        alert('⚠️ Error al migrar datos. Revisa la consola para más detalles.');
    }
}

/**
 * Exporta todos los datos como JSON (backup)
 */
async function exportarDatos() {
    try {
        const dataStr = JSON.stringify(db, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `jupeli_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        alert('✅ Copia de seguridad descargada');
    } catch (error) {
        console.error('❌ Error al exportar:', error);
        alert('⚠️ Error al exportar datos');
    }
}

/**
 * Importa datos desde JSON (restaurar backup)
 */
async function importarDatos(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            if (!confirm('⚠️ ¿Estás seguro? Esto AGREGARÁ estos datos a Firebase.')) {
                return;
            }
            
            console.log('📥 Importando datos...');
            
            for (const [coleccion, datos] of Object.entries(importedData)) {
                if (Array.isArray(datos) && datos.length > 0) {
                    for (const item of datos) {
                        const { firestoreId, ...itemLimpio } = item;
                        await guardarEnFirestore(coleccion, itemLimpio);
                    }
                }
            }
            
            alert('✅ Datos importados exitosamente');
            location.reload();
        } catch (error) {
            console.error('❌ Error al importar:', error);
            alert('⚠️ Error al importar. Archivo inválido.');
        }
    };
    reader.readAsText(file);
}

/**
 * Limpia TODOS los datos de Firestore (PELIGROSO)
 */
async function limpiarDatos() {
    if (!confirm('⚠️ ¿ESTÁS SEGURO? Esto borrará TODOS los datos de Firebase.')) {
        return;
    }
    
    if (!confirm('⚠️ ÚLTIMA CONFIRMACIÓN: ¿Realmente quieres borrar todo?')) {
        return;
    }
    
    try {
        console.log('🗑️ Eliminando todos los datos...');
        
        for (const coleccion of Object.keys(db)) {
            const snapshot = await jupeli_db.doc('main').collection(coleccion).get();
            const batch = firestore.batch();
            
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            
            await batch.commit();
            console.log(`🗑️ ${coleccion} eliminada`);
        }
        
        alert('✅ Todos los datos eliminados');
        location.reload();
    } catch (error) {
        console.error('❌ Error al limpiar datos:', error);
        alert('⚠️ Error al eliminar datos');
    }
}

// ========== FUNCIONES DE COMPATIBILIDAD (DEPRECATED) ==========
// Estas funciones se mantienen por compatibilidad pero no hacen nada
// El sistema ahora usa Firestore automáticamente

function guardarEnLocalStorage() {
    console.warn('⚠️ guardarEnLocalStorage() está deprecated. Usa Firestore.');
}

function cargarDesdeLocalStorage() {
    console.warn('⚠️ cargarDesdeLocalStorage() está deprecated. Usa Firestore.');
    return false;
}
