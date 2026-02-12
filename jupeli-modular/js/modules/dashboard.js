// ========== MÓDULO: DASHBOARD ==========

function initDashboard() {
    console.log('✅ Módulo Dashboard inicializado');
}

function renderDashboard() {
    const container = document.getElementById('view-dashboard');
    
    container.innerHTML = `
        <!-- Selector de Periodo -->
        <div style="background: white; padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                <span style="font-weight: 600; color: var(--dark);">📅 Periodo:</span>
                <select id="filtro-periodo-dashboard" class="form-control" onchange="actualizarStats()" style="max-width: 200px;">
                    <option value="este-mes">Este Mes</option>
                    <option value="este-año">Este Año</option>
                    <option value="global">Global (Todos)</option>
                </select>
                <span id="periodo-dashboard-texto" style="color: var(--primary); font-weight: 600; margin-left: auto;"></span>
            </div>
        </div>

        <!-- Métricas Principales -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 1.5rem; color: white; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div style="font-size: 3rem; opacity: 0.3;">📦</div>
                    <div style="background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem;">Total</div>
                </div>
                <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;" id="stat-pedidos">0</div>
                <div style="opacity: 0.9; font-size: 1.1rem;">Pedidos</div>
            </div>

            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 16px; padding: 1.5rem; color: white; box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div style="font-size: 3rem; opacity: 0.3;">👥</div>
                    <div style="background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem;">Total</div>
                </div>
                <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;" id="stat-clientes">0</div>
                <div style="opacity: 0.9; font-size: 1.1rem;">Clientes</div>
            </div>

            <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 16px; padding: 1.5rem; color: white; box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div style="font-size: 3rem; opacity: 0.3;">🎁</div>
                    <div style="background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem;">Catálogo</div>
                </div>
                <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;" id="stat-productos">0</div>
                <div style="opacity: 0.9; font-size: 1.1rem;">Productos</div>
            </div>

            <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); border-radius: 16px; padding: 1.5rem; color: white; box-shadow: 0 4px 15px rgba(67, 233, 123, 0.4);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div style="font-size: 3rem; opacity: 0.3;">💰</div>
                    <div style="background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem;" id="stat-ventas-label">Este Mes</div>
                </div>
                <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;" id="stat-ventas">$0</div>
                <div style="opacity: 0.9; font-size: 1.1rem;">Ventas</div>
            </div>
        </div>

        <!-- Accesos Rápidos -->
        <div class="content-card">
            <h3 style="margin: 0 0 1.5rem 0; font-size: 1.3rem;">⚡ Accesos Rápidos</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <div onclick="cambiarVista('view-pedidos'); renderizarVista('view-pedidos');" class="quick-action-card">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">➕</div>
                    <div style="font-weight: 600; color: var(--primary);">Nuevo Pedido</div>
                    <div style="font-size: 0.85rem; color: var(--gray); margin-top: 0.25rem;">Crear pedido rápido</div>
                </div>

                <div onclick="cambiarVista('view-clientes'); renderizarVista('view-clientes');" class="quick-action-card">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">👥</div>
                    <div style="font-weight: 600; color: #f5576c;">Ver Clientes</div>
                    <div style="font-size: 0.85rem; color: var(--gray); margin-top: 0.25rem;">Gestionar clientes</div>
                </div>

                <div onclick="cambiarVista('view-productos'); renderizarVista('view-productos');" class="quick-action-card">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎁</div>
                    <div style="font-weight: 600; color: #00a0d2;">Catálogo</div>
                    <div style="font-size: 0.85rem; color: var(--gray); margin-top: 0.25rem;">Ver productos</div>
                </div>

                <div onclick="cambiarVista('view-reportes'); renderizarVista('view-reportes');" class="quick-action-card">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📊</div>
                    <div style="font-weight: 600; color: #38d39f;">Reportes</div>
                    <div style="font-size: 0.85rem; color: var(--gray); margin-top: 0.25rem;">Ver estadísticas</div>
                </div>

                <div onclick="cambiarVista('view-inventario'); renderizarVista('view-inventario');" class="quick-action-card">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🧵</div>
                    <div style="font-weight: 600; color: #fa709a;">Inventario</div>
                    <div style="font-size: 0.85rem; color: var(--gray); margin-top: 0.25rem;">Control materiales</div>
                </div>

                <div onclick="cambiarVista('view-finanzas'); renderizarVista('view-finanzas');" class="quick-action-card">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">💰</div>
                    <div style="font-weight: 600; color: #d57eeb;">Finanzas</div>
                    <div style="font-size: 0.85rem; color: var(--gray); margin-top: 0.25rem;">Ingresos y gastos</div>
                </div>
            </div>
        </div>

        <!-- Estado de Pedidos -->
        <div class="content-card">
            <h3 style="margin: 0 0 1rem 0; font-size: 1.3rem;">📦 Estado de Pedidos</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;" id="dashboard-pedidos-estado">
                <!-- Se llena dinámicamente -->
            </div>
        </div>
    `;
    
    // Actualizar estadísticas
    actualizarStats();
}

function actualizarStats() {
    document.getElementById('stat-clientes').textContent = db.clientes.length;
    document.getElementById('stat-productos').textContent = db.productos.length;
    document.getElementById('stat-pedidos').textContent = db.pedidos.length;
    
    // Obtener periodo seleccionado
    const periodoSeleccionado = document.getElementById('filtro-periodo-dashboard')?.value || 'este-mes';
    
    let pedidosFiltrados = [];
    let labelVentas = 'Ventas';
    let textoperiodo = '';
    
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const añoActual = hoy.getFullYear();
    
    switch(periodoSeleccionado) {
        case 'este-mes':
            pedidosFiltrados = db.pedidos.filter(p => {
                const fecha = new Date(p.fechaPedido);
                return fecha.getMonth() === mesActual && 
                       fecha.getFullYear() === añoActual && 
                       p.estado !== 'cancelado';
            });
            labelVentas = 'Este Mes';
            const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            textoperiodo = meses[mesActual] + ' ' + añoActual;
            break;
            
        case 'este-año':
            pedidosFiltrados = db.pedidos.filter(p => {
                const fecha = new Date(p.fechaPedido);
                return fecha.getFullYear() === añoActual && 
                       p.estado !== 'cancelado';
            });
            labelVentas = 'Este Año';
            textoperiodo = 'Año ' + añoActual;
            break;
            
        case 'global':
            pedidosFiltrados = db.pedidos.filter(p => p.estado !== 'cancelado');
            labelVentas = 'Global';
            textoperiodo = 'Todos los tiempos';
            break;
    }
    
    // Calcular ventas
    const ventasPeriodo = pedidosFiltrados.reduce((sum, p) => sum + (p.anticipo || 0), 0);
    
    document.getElementById('stat-ventas').textContent = formatearMoneda(ventasPeriodo);
    document.getElementById('stat-ventas-label').textContent = labelVentas;
    document.getElementById('periodo-dashboard-texto').textContent = textoperiodo;
    
    // Actualizar estado de pedidos
    actualizarEstadoPedidos();
}

function actualizarEstadoPedidos() {
    const estados = {
        'pendiente': { count: 0, color: '#ffa726', icon: '⏳', label: 'Pendientes' },
        'en-proceso': { count: 0, color: '#42a5f5', icon: '🔄', label: 'En Proceso' },
        'completado': { count: 0, color: '#66bb6a', icon: '✅', label: 'Completados' },
        'entregado': { count: 0, color: '#26a69a', icon: '📦', label: 'Entregados' },
        'cancelado': { count: 0, color: '#ef5350', icon: '❌', label: 'Cancelados' }
    };
    
    db.pedidos.forEach(p => {
        if (estados[p.estado]) {
            estados[p.estado].count++;
        }
    });
    
    const container = document.getElementById('dashboard-pedidos-estado');
    container.innerHTML = Object.entries(estados).map(([key, data]) => `
        <div style="background: white; padding: 1rem; border-radius: 8px; border-left: 4px solid ${data.color}; cursor: pointer;"
             onclick="cambiarVista('view-pedidos'); renderizarVista('view-pedidos');">
            <div style="font-size: 1.5rem;">${data.icon}</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: ${data.color}; margin: 0.5rem 0;">${data.count}</div>
            <div style="font-size: 0.85rem; color: var(--gray);">${data.label}</div>
        </div>
    `).join('');
}
