// ========== HELPER PARA OPERACIONES CRUD CON FIRESTORE ==========
// Este archivo proporciona funciones auxiliares para agregar, actualizar y eliminar
// datos en Firestore, simplificando la migración desde localStorage

/**
 * Agrega un nuevo registro a una colección
 * NOTA: Esta función es síncrona, la operación de Firebase se ejecuta en background
 * @param {string} coleccion - Nombre de la colección (ej: 'clientes', 'productos')
 * @param {object} datos - Objeto con los datos del nuevo registro
 * @returns {number} - ID del nuevo registro
 */
function agregarRegistro(coleccion, datos) {
    try {
        // Asignar ID automático
        const nuevoId = nextId[coleccion];
        nextId[coleccion]++;
        
        const registro = {
            ...datos,
            id: nuevoId,
            fechaCreacion: new Date().toISOString()
        };
        
        // Agregar a memoria local primero (respuesta inmediata)
        db[coleccion].push(registro);
        
        // Guardar en Firestore en background
        if (firestoreReady) {
            guardarEnFirestore(coleccion, registro).then(firestoreId => {
                // Actualizar con firestoreId en memoria
                const index = db[coleccion].findIndex(r => r.id === nuevoId);
                if (index !== -1) {
                    db[coleccion][index].firestoreId = firestoreId;
                }
            }).catch(error => {
                console.error(`❌ Error al guardar ${coleccion} en Firestore:`, error);
            });
        }
        
        console.log(`✅ ${coleccion} agregado:`, nuevoId);
        return nuevoId;
        
    } catch (error) {
        console.error(`❌ Error al agregar ${coleccion}:`, error);
        throw error;
    }
}

/**
 * Actualiza un registro existente
 * NOTA: Esta función es síncrona, la operación de Firebase se ejecuta en background
 * @param {string} coleccion - Nombre de la colección
 * @param {number} id - ID del registro a actualizar
 * @param {object} datosActualizados - Datos a actualizar
 */
function actualizarRegistro(coleccion, id, datosActualizados) {
    try {
        const index = db[coleccion].findIndex(r => r.id === id);
        if (index === -1) {
            throw new Error(`Registro ${id} no encontrado en ${coleccion}`);
        }
        
        const registroActual = db[coleccion][index];
        const firestoreId = registroActual.firestoreId;
        
        // Actualizar en memoria primero (respuesta inmediata)
        db[coleccion][index] = {
            ...registroActual,
            ...datosActualizados,
            fechaModificacion: new Date().toISOString()
        };
        
        // Actualizar en Firestore en background
        if (firestoreReady && firestoreId) {
            const { firestoreId: _, ...datosParaFirestore } = db[coleccion][index];
            actualizarEnFirestore(coleccion, firestoreId, datosParaFirestore).catch(error => {
                console.error(`❌ Error al actualizar ${coleccion} en Firestore:`, error);
            });
        }
        
        console.log(`✅ ${coleccion} actualizado:`, id);
        
    } catch (error) {
        console.error(`❌ Error al actualizar ${coleccion}:`, error);
        throw error;
    }
}

/**
 * Elimina un registro
 * NOTA: Esta función es síncrona, la operación de Firebase se ejecuta en background
 * @param {string} coleccion - Nombre de la colección
 * @param {number} id - ID del registro a eliminar
 */
function eliminarRegistro(coleccion, id) {
    try {
        const index = db[coleccion].findIndex(r => r.id === id);
        if (index === -1) {
            throw new Error(`Registro ${id} no encontrado en ${coleccion}`);
        }
        
        const registro = db[coleccion][index];
        const firestoreId = registro.firestoreId;
        
        // Eliminar de memoria primero (respuesta inmediata)
        db[coleccion].splice(index, 1);
        
        // Eliminar de Firestore en background
        if (firestoreReady && firestoreId) {
            eliminarDeFirestore(coleccion, firestoreId).catch(error => {
                console.error(`❌ Error al eliminar ${coleccion} de Firestore:`, error);
            });
        }
        
        console.log(`✅ ${coleccion} eliminado:`, id);
        
    } catch (error) {
        console.error(`❌ Error al eliminar ${coleccion}:`, error);
        throw error;
    }
}

/**
 * Obtiene un registro por ID
 * @param {string} coleccion - Nombre de la colección
 * @param {number} id - ID del registro
 * @returns {object|null} - Registro encontrado o null
 */
function obtenerRegistro(coleccion, id) {
    return db[coleccion].find(r => r.id === id) || null;
}

/**
 * Obtiene todos los registros de una colección
 * @param {string} coleccion - Nombre de la colección
 * @returns {array} - Array de registros
 */
function obtenerTodosLosRegistros(coleccion) {
    return db[coleccion] || [];
}

/**
 * Busca registros que cumplan una condición
 * @param {string} coleccion - Nombre de la colección
 * @param {function} condicion - Función que retorna true/false
 * @returns {array} - Array de registros que cumplen la condición
 */
function buscarRegistros(coleccion, condicion) {
    return db[coleccion].filter(condicion);
}

// ========== FUNCIONES ESPECÍFICAS PARA COMPATIBILIDAD ==========

/**
 * Guarda y sincroniza - mantiene compatibilidad con código existente
 * Esta función ahora funciona con Firestore automáticamente
 * Ya no es necesario llamarla explícitamente, pero se mantiene por compatibilidad
 */
function guardarYSincronizar() {
    // Con Firebase, la sincronización es automática
    // Esta función se mantiene solo por compatibilidad con código existente
    console.log('ℹ️ Sincronización automática con Firebase activa');
    return Promise.resolve();
}

/**
 * Reemplaza guardarEnLocalStorage() en código existente
 * Ahora sincroniza con Firestore automáticamente
 */
function sincronizarConFirebase() {
    // La sincronización ya se hace automáticamente en agregarRegistro, 
    // actualizarRegistro y eliminarRegistro
    // Esta función es solo para compatibilidad
    console.log('ℹ️ Los datos se sincronizan automáticamente con Firebase');
}

console.log('✅ CRUD Helper cargado con soporte Firebase');
