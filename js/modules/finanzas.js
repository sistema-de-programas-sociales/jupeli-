// ========== MÓDULO: FINANZAS (COMPLETO Y FUNCIONAL) ==========

let seccionFinanzasActiva = 'ingresos'; // 'ingresos' o 'gastos'

function initFinanzas() {
    console.log('✅ Módulo Finanzas inicializado');
}

function renderFinanzas() {
    const container = document.getElementById('view-finanzas');
    
    container.innerHTML = `
        <h2 class="section-title">💰 Finanzas</h2>
        
        <!-- Resumen General -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div class="stat-card" style="background: linear-gradient(135deg, #43e97b20, #38f9d720);">
                <div class="stat-icon">💵</div>
                <div class="stat-value" style="color: #43e97b;" id="stat-total-ingresos">$0</div>
                <div class="stat-label">Total Ingresos</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #fa709a20, #fee14020);">
                <div class="stat-icon">💸</div>
                <div class="stat-value" style="color: #fa709a;" id="stat-total-gastos">$0</div>
                <div class="stat-label">Total Gastos</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #667eea20, #764ba220);">
                <div class="stat-icon">📊</div>
                <div class="stat-value" id="stat-balance">$0</div>
                <div class="stat-label">Balance</div>
            </div>
        </div>
        
        <!-- Tabs -->
        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; background: white; padding: 0.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <button class="btn ${seccionFinanzasActiva === 'ingresos' ? 'btn-primary' : 'btn-outline'}" 
                    onclick="cambiarSeccionFinanzas('ingresos')" style="flex: 1;">
                💵 Ingresos
            </button>
            <button class="btn ${seccionFinanzasActiva === 'gastos' ? 'btn-primary' : 'btn-outline'}" 
                    onclick="cambiarSeccionFinanzas('gastos')" style="flex: 1;">
                💸 Gastos
            </button>
        </div>
        
        <!-- Contenido de Ingresos -->
        <div id="finanzas-ingresos-content" style="display: ${seccionFinanzasActiva === 'ingresos' ? 'block' : 'none'};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="margin: 0;">💵 Registro de Ingresos</h3>
                <button class="btn btn-primary" onclick="abrirModalIngreso()">➕ Nuevo Ingreso</button>
            </div>
            <div id="lista-ingresos"></div>
        </div>
        
        <!-- Contenido de Gastos -->
        <div id="finanzas-gastos-content" style="display: ${seccionFinanzasActiva === 'gastos' ? 'block' : 'none'};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="margin: 0;">💸 Registro de Gastos</h3>
                <button class="btn btn-primary" onclick="abrirModalGasto()">➕ Nuevo Gasto</button>
            </div>
            <div id="lista-gastos"></div>
        </div>
    `;
    
    actualizarFinanzas();
}

function cambiarSeccionFinanzas(seccion) {
    seccionFinanzasActiva = seccion;
    renderFinanzas();
}

function actualizarFinanzas() {
    // Calcular totales
    const totalIngresos = db.ingresos.reduce((sum, i) => sum + i.monto, 0);
    const totalGastos = db.gastos.reduce((sum, g) => sum + g.monto, 0);
    const balance = totalIngresos - totalGastos;
    
    // Actualizar estadísticas
    document.getElementById('stat-total-ingresos').textContent = formatearMoneda(totalIngresos);
    document.getElementById('stat-total-gastos').textContent = formatearMoneda(totalGastos);
    const balanceElem = document.getElementById('stat-balance');
    balanceElem.textContent = formatearMoneda(balance);
    balanceElem.style.color = balance >= 0 ? '#43e97b' : '#ef5350';
    
    // Mostrar listas
    mostrarIngresos();
    mostrarGastos();
}

function mostrarIngresos() {
    const container = document.getElementById('lista-ingresos');
    if (!container) return;
    
    const ingresos = [...db.ingresos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    if (ingresos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💵</div>
                <p>No hay ingresos registrados</p>
                <button class="btn btn-primary" onclick="abrirModalIngreso()" style="margin-top: 1rem;">
                    ➕ Registrar Primer Ingreso
                </button>
            </div>
        `;
        return;
    }
    
    // Agrupar por mes
    const ingresosPorMes = {};
    ingresos.forEach(i => {
        const mesAño = obtenerNombreMes(i.fecha) + ' ' + new Date(i.fecha).getFullYear();
        if (!ingresosPorMes[mesAño]) {
            ingresosPorMes[mesAño] = [];
        }
        ingresosPorMes[mesAño].push(i);
    });
    
    container.innerHTML = Object.entries(ingresosPorMes).map(([mesAño, ingresosDelMes]) => {
        const totalMes = ingresosDelMes.reduce((sum, i) => sum + i.monto, 0);
        
        return `
            <div class="content-card" style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 2px solid var(--border);">
                    <h4 style="margin: 0;">${mesAño}</h4>
                    <div style="font-size: 1.3rem; font-weight: 700; color: #43e97b;">${formatearMoneda(totalMes)}</div>
                </div>
                
                ${ingresosDelMes.map(i => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--light); border-radius: 8px; margin-bottom: 0.5rem;">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; margin-bottom: 0.25rem;">${i.concepto}</div>
                            <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--gray);">
                                <span>📅 ${formatearFecha(i.fecha)}</span>
                                <span>📁 ${i.categoria}</span>
                                <span>💳 ${i.metodoPago}</span>
                            </div>
                            ${i.notas ? `<div style="font-size: 0.85rem; color: var(--gray); margin-top: 0.25rem;">📝 ${i.notas}</div>` : ''}
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="font-size: 1.2rem; font-weight: 700; color: #43e97b;">${formatearMoneda(i.monto)}</div>
                            <button class="btn btn-outline" onclick="eliminarIngreso(${i.id})" 
                                style="padding: 0.5rem; font-size: 0.85rem; color: #ef5350; border-color: #ef5350;">
                                🗑️
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }).join('');
}

function mostrarGastos() {
    const container = document.getElementById('lista-gastos');
    if (!container) return;
    
    const gastos = [...db.gastos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    if (gastos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💸</div>
                <p>No hay gastos registrados</p>
                <button class="btn btn-primary" onclick="abrirModalGasto()" style="margin-top: 1rem;">
                    ➕ Registrar Primer Gasto
                </button>
            </div>
        `;
        return;
    }
    
    // Agrupar por mes
    const gastosPorMes = {};
    gastos.forEach(g => {
        const mesAño = obtenerNombreMes(g.fecha) + ' ' + new Date(g.fecha).getFullYear();
        if (!gastosPorMes[mesAño]) {
            gastosPorMes[mesAño] = [];
        }
        gastosPorMes[mesAño].push(g);
    });
    
    container.innerHTML = Object.entries(gastosPorMes).map(([mesAño, gastosDelMes]) => {
        const totalMes = gastosDelMes.reduce((sum, g) => sum + g.monto, 0);
        
        return `
            <div class="content-card" style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 2px solid var(--border);">
                    <h4 style="margin: 0;">${mesAño}</h4>
                    <div style="font-size: 1.3rem; font-weight: 700; color: #fa709a;">${formatearMoneda(totalMes)}</div>
                </div>
                
                ${gastosDelMes.map(g => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--light); border-radius: 8px; margin-bottom: 0.5rem;">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; margin-bottom: 0.25rem;">${g.concepto}</div>
                            <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--gray); flex-wrap: wrap;">
                                <span>📅 ${formatearFecha(g.fecha)}</span>
                                <span>📁 ${g.categoria}</span>
                                <span>💳 ${g.metodoPago}</span>
                                ${g.proveedor ? `<span>🏪 ${g.proveedor}</span>` : ''}
                            </div>
                            ${g.notas ? `<div style="font-size: 0.85rem; color: var(--gray); margin-top: 0.25rem;">📝 ${g.notas}</div>` : ''}
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="font-size: 1.2rem; font-weight: 700; color: #fa709a;">${formatearMoneda(g.monto)}</div>
                            <button class="btn btn-outline" onclick="eliminarGasto(${g.id})" 
                                style="padding: 0.5rem; font-size: 0.85rem; color: #ef5350; border-color: #ef5350;">
                                🗑️
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }).join('');
}

function abrirModalIngreso() {
    const fechaHoy = obtenerFechaHoy();
    
    abrirModal(`
        <div class="modal-header">
            <h3 class="modal-title">➕ Nuevo Ingreso</h3>
            <button class="modal-close" onclick="cerrarModal()">×</button>
        </div>
        <form id="form-ingreso" onsubmit="guardarIngreso(event)">
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Concepto *</label>
                    <input type="text" class="form-control" name="concepto" 
                           placeholder="Ej: Venta de arcón romántico" required>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Monto *</label>
                        <input type="number" class="form-control" name="monto" min="0" step="0.01" 
                               placeholder="0.00" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Fecha *</label>
                        <input type="date" class="form-control" name="fecha" value="${fechaHoy}" required>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Categoría *</label>
                        <select class="form-control" name="categoria" required>
                            <option value="ventas">Ventas</option>
                            <option value="servicios">Servicios</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Método de Pago *</label>
                        <select class="form-control" name="metodoPago" required>
                            <option value="efectivo">💵 Efectivo</option>
                            <option value="transferencia">🏦 Transferencia</option>
                            <option value="tarjeta">💳 Tarjeta</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Notas</label>
                    <textarea class="form-control" name="notas" rows="3" 
                              placeholder="Detalles adicionales..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline" onclick="cerrarModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary">💾 Guardar Ingreso</button>
            </div>
        </form>
    `);
}

function abrirModalGasto() {
    const fechaHoy = obtenerFechaHoy();
    
    abrirModal(`
        <div class="modal-header">
            <h3 class="modal-title">➕ Nuevo Gasto</h3>
            <button class="modal-close" onclick="cerrarModal()">×</button>
        </div>
        <form id="form-gasto" onsubmit="guardarGasto(event)">
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Concepto *</label>
                    <input type="text" class="form-control" name="concepto" 
                           placeholder="Ej: Compra de listones" required>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Monto *</label>
                        <input type="number" class="form-control" name="monto" min="0" step="0.01" 
                               placeholder="0.00" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Fecha *</label>
                        <input type="date" class="form-control" name="fecha" value="${fechaHoy}" required>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Categoría *</label>
                        <select class="form-control" name="categoria" required>
                            <option value="materiales">Materiales</option>
                            <option value="servicios">Servicios</option>
                            <option value="renta">Renta</option>
                            <option value="transporte">Transporte</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Método de Pago *</label>
                        <select class="form-control" name="metodoPago" required>
                            <option value="efectivo">💵 Efectivo</option>
                            <option value="transferencia">🏦 Transferencia</option>
                            <option value="tarjeta">💳 Tarjeta</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Proveedor</label>
                    <input type="text" class="form-control" name="proveedor" 
                           placeholder="Nombre del proveedor">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Notas</label>
                    <textarea class="form-control" name="notas" rows="3" 
                              placeholder="Detalles adicionales..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline" onclick="cerrarModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary">💾 Guardar Gasto</button>
            </div>
        </form>
    `);
}

function guardarIngreso(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    
    const ingreso = {
        id: nextId.ingresos++,
        concepto: form.get('concepto'),
        monto: parseFloat(form.get('monto')),
        fecha: form.get('fecha'),
        categoria: form.get('categoria'),
        metodoPago: form.get('metodoPago'),
        notas: form.get('notas')
    };
    
    db.ingresos.push(ingreso);
    // Sincronización automática con Firebase
    cerrarModal();
    actualizarFinanzas();
    alert('✅ Ingreso registrado correctamente');
}

function guardarGasto(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    
    const gasto = {
        id: nextId.gastos++,
        concepto: form.get('concepto'),
        monto: parseFloat(form.get('monto')),
        fecha: form.get('fecha'),
        categoria: form.get('categoria'),
        metodoPago: form.get('metodoPago'),
        proveedor: form.get('proveedor'),
        notas: form.get('notas')
    };
    
    db.gastos.push(gasto);
    // Sincronización automática con Firebase
    cerrarModal();
    actualizarFinanzas();
    alert('✅ Gasto registrado correctamente');
}

function eliminarIngreso(id) {
    if (confirm('¿Estás seguro de eliminar este ingreso?')) {
        const index = db.ingresos.findIndex(i => i.id === id);
        db.ingresos.splice(index, 1);
        // Sincronización automática con Firebase
        actualizarFinanzas();
        alert('✅ Ingreso eliminado');
    }
}

function eliminarGasto(id) {
    if (confirm('¿Estás seguro de eliminar este gasto?')) {
        const index = db.gastos.findIndex(g => g.id === id);
        db.gastos.splice(index, 1);
        // Sincronización automática con Firebase
        actualizarFinanzas();
        alert('✅ Gasto eliminado');
    }
}
