// ========== MÓDULO: MÁS (Configuración y Utilidades) ==========

function initMas() {
    console.log('✅ Módulo Más inicializado');
}

function renderMas() {
    const container = document.getElementById('view-mas');
    
    container.innerHTML = `
        <h2 class="section-title">☰ Más Opciones</h2>
        
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
            <div style="margin-top: 1rem;">
                <p><strong>Total de clientes:</strong> ${db.clientes.length}</p>
                <p><strong>Total de productos:</strong> ${db.productos.length}</p>
                <p><strong>Total de pedidos:</strong> ${db.pedidos.length}</p>
                <p><strong>Total de materiales:</strong> ${db.materiales.length}</p>
                <p><strong>Versión:</strong> 2.0 (Modular)</p>
            </div>
        </div>
        
        <!-- Acceso Rápido a Otras Secciones -->
        <div class="content-card" style="margin-top: 1.5rem;">
            <h3>🔗 Accesos Rápidos</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-top: 1rem;">
                <button class="btn btn-outline" onclick="cambiarVista('view-inventario'); renderInventario();">🧵 Inventario</button>
                <button class="btn btn-outline" onclick="cambiarVista('view-finanzas'); renderFinanzas();">💰 Finanzas</button>
                <button class="btn btn-outline" onclick="cambiarVista('view-reportes'); renderReportes();">📊 Reportes</button>
            </div>
        </div>
        
        <!-- Ayuda -->
        <div class="content-card" style="margin-top: 1.5rem;">
            <h3>❓ Ayuda</h3>
            <p style="margin-top: 1rem; color: var(--gray);">
                Este sistema te permite gestionar clientes, productos, pedidos, inventario y finanzas de tu negocio.
                Los datos se guardan automáticamente en tu navegador.
            </p>
            <p style="margin-top: 1rem; color: var(--gray);">
                💡 <strong>Tip:</strong> Exporta tus datos regularmente como respaldo.
            </p>
        </div>
    `;
}
