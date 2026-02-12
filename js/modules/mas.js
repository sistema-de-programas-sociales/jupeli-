// ========== MÓDULO: CONFIGURACIÓN ==========

function initMas() {
    console.log('✅ Módulo Configuración inicializado');
}

function renderMas() {
    const container = document.getElementById('view-mas');
    
    container.innerHTML = `
        <h2 class="section-title">⚙️ Configuración del Sistema</h2>
        
        <!-- Gestión de Datos -->
        <div class="content-card">
            <h3>💾 Gestión de Datos</h3>
            <div style="display: grid; gap: 1rem; margin-top: 1rem;">
                <button class="btn btn-primary" onclick="exportarDatos()">
                    📥 Exportar Datos (Backup)
                </button>
                <button class="btn btn-outline" onclick="document.getElementById('import-file').click()">
                    📤 Importar Datos
                </button>
                <input type="file" id="import-file" accept=".json" style="display: none;" onchange="importarDatos(event)">
                <button class="btn btn-danger" onclick="limpiarDatos()">
                    🗑️ Borrar Todos los Datos
                </button>
            </div>
        </div>
        
        <!-- Información del Sistema -->
        <div class="content-card" style="margin-top: 1.5rem;">
            <h3>ℹ️ Información del Sistema</h3>
            <div style="margin-top: 1rem; line-height: 2;">
                <p><strong>Total de clientes:</strong> ${db.clientes.length}</p>
                <p><strong>Total de productos:</strong> ${db.productos.length}</p>
                <p><strong>Total de pedidos:</strong> ${db.pedidos.length}</p>
                <p><strong>Total de materiales:</strong> ${db.materiales.length}</p>
                <hr style="margin: 1rem 0; border: 1px solid #eee;">
                <p><strong>Versión:</strong> 3.0 (Firebase Cloud)</p>
                <p><strong>Base de datos:</strong> Firebase Firestore</p>
                <p><strong>Proyecto:</strong> jupeli</p>
                <p><strong>Estado:</strong> <span style="color: #28a745;">🟢 Conectado</span></p>
            </div>
        </div>
        
        <!-- Ayuda Técnica -->
        <div class="content-card" style="margin-top: 1.5rem;">
            <h3>❓ Información Técnica</h3>
            <div style="margin-top: 1rem; color: var(--gray); line-height: 1.8;">
                <p>
                    <strong>🔥 Firebase Firestore:</strong> Los datos se sincronizan automáticamente 
                    en tiempo real entre todos los dispositivos conectados.
                </p>
                <p style="margin-top: 1rem;">
                    <strong>💾 Backup:</strong> Se recomienda exportar los datos periódicamente 
                    como medida de seguridad adicional.
                </p>
                <p style="margin-top: 1rem;">
                    <strong>👥 Colaboración:</strong> Múltiples usuarios pueden trabajar 
                    simultáneamente sin conflictos.
                </p>
                <p style="margin-top: 1rem;">
                    <strong>🌐 Acceso:</strong> Disponible desde cualquier dispositivo con 
                    conexión a internet.
                </p>
            </div>
        </div>
        
        <!-- Estado de Sincronización -->
        <div class="content-card" style="margin-top: 1.5rem;">
            <h3>🔄 Estado de Sincronización</h3>
            <div style="margin-top: 1rem; padding: 1rem; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                <p style="margin: 0; color: #0c4a6e;">
                    <strong>✅ Sincronización activa</strong><br>
                    <small>Los cambios se guardan automáticamente en Firebase</small>
                </p>
            </div>
            <div style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                <p>📊 Colecciones sincronizadas: ${Object.keys(db).length}</p>
                <p>🔐 Conexión segura: HTTPS</p>
                <p>⚡ Latencia: Tiempo real</p>
            </div>
        </div>
    `;
}

