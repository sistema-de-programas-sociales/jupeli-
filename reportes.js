// ========== MÓDULO: REPORTES ==========

function initReportes() {
    console.log('✅ Módulo Reportes inicializado');
}

function renderReportes() {
    const container = document.getElementById('view-reportes');
    
    container.innerHTML = `
        <h2 class="section-title">📊 Reportes y Estadísticas</h2>
        
        <!-- Resumen General -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div class="stat-card">
                <div class="stat-icon">📦</div>
                <div class="stat-value">${db.pedidos.length}</div>
                <div class="stat-label">Total Pedidos</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-value">${formatearMoneda(db.pedidos.reduce((sum, p) => sum + (p.anticipo || 0), 0))}</div>
                <div class="stat-label">Ingresos Totales</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🎁</div>
                <div class="stat-value">${db.productos.reduce((sum, p) => sum + (p.vendidos || 0), 0)}</div>
                <div class="stat-label">Productos Vendidos</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-value">${db.clientes.length}</div>
                <div class="stat-label">Clientes Registrados</div>
            </div>
        </div>
        
        <!-- Top Productos -->
        <div class="content-card">
            <h3>🏆 Top Productos Más Vendidos</h3>
            <div id="reporte-top-productos"></div>
        </div>
        
        <!-- Top Clientes -->
        <div class="content-card" style="margin-top: 1.5rem;">
            <h3>⭐ Top Clientes</h3>
            <div id="reporte-top-clientes"></div>
        </div>
        
        <!-- NOTA: Completa este módulo copiando del archivo original (líneas ~5100-5400) -->
    `;
    
    renderTopProductos();
    renderTopClientes();
}

function renderTopProductos() {
    const productosOrdenados = [...db.productos]
        .filter(p => (p.vendidos || 0) > 0)
        .sort((a, b) => (b.vendidos || 0) - (a.vendidos || 0))
        .slice(0, 5);
    
    const container = document.getElementById('reporte-top-productos');
    
    if (productosOrdenados.length === 0) {
        container.innerHTML = '<p style="color: var(--gray);">No hay datos de ventas</p>';
        return;
    }
    
    container.innerHTML = productosOrdenados.map((p, i) => `
        <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--light); border-radius: 8px; margin-bottom: 0.5rem;">
            <div>
                <span style="font-weight: 700; color: var(--primary); margin-right: 0.5rem;">#${i + 1}</span>
                <span>${p.nombre}</span>
            </div>
            <span style="font-weight: 600;">${p.vendidos} vendidos</span>
        </div>
    `).join('');
}

function renderTopClientes() {
    const clientesConStats = db.clientes.map(c => {
        const pedidos = db.pedidos.filter(p => p.clienteId === c.id);
        const total = pedidos.reduce((sum, p) => sum + (p.anticipo || 0), 0);
        return { ...c, totalPedidos: pedidos.length, totalGastado: total };
    }).filter(c => c.totalPedidos > 0)
      .sort((a, b) => b.totalGastado - a.totalGastado)
      .slice(0, 5);
    
    const container = document.getElementById('reporte-top-clientes');
    
    if (clientesConStats.length === 0) {
        container.innerHTML = '<p style="color: var(--gray);">No hay datos de clientes</p>';
        return;
    }
    
    container.innerHTML = clientesConStats.map((c, i) => `
        <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--light); border-radius: 8px; margin-bottom: 0.5rem;">
            <div>
                <span style="font-weight: 700; color: var(--primary); margin-right: 0.5rem;">#${i + 1}</span>
                <span>${c.nombre}</span>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: 600;">${formatearMoneda(c.totalGastado)}</div>
                <div style="font-size: 0.85rem; color: var(--gray);">${c.totalPedidos} pedidos</div>
            </div>
        </div>
    `).join('');
}
