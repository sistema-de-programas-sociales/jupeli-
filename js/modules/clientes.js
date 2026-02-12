// ========== MÓDULO: CLIENTES ==========

function initClientes() {
    console.log('✅ Módulo Clientes inicializado');
}

function renderClientes() {
    const container = document.getElementById('view-clientes');
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2 class="section-title" style="margin: 0;">👥 Clientes</h2>
            <button class="btn btn-primary" onclick="abrirModalCliente()">➕ Nuevo Cliente</button>
        </div>

        <!-- Barra de búsqueda y controles -->
        <div style="background: white; padding: 1rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <input type="text" id="search-clientes" placeholder="🔍 Buscar cliente..."
                       onkeyup="buscarClientes()" class="form-control" style="flex: 1; min-width: 250px;">
                
                <select id="orden-clientes" class="form-control" onchange="renderClientes()" style="max-width: 200px;">
                    <option value="nombre">Ordenar por Nombre</option>
                    <option value="fecha">Más Recientes</option>
                    <option value="pedidos">Más Pedidos</option>
                </select>
                
                <div id="vista-clientes-toggle" style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline ${vistaClientes === 'grid' ? 'active' : ''}" 
                            onclick="cambiarVistaClientes('grid')">🔲 Grid</button>
                    <button class="btn btn-outline ${vistaClientes === 'lista' ? 'active' : ''}" 
                            onclick="cambiarVistaClientes('lista')">📋 Lista</button>
                </div>
            </div>
        </div>

        <!-- Estadísticas Rápidas -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-value" id="stat-total-clientes">0</div>
                <div class="stat-label">Total Clientes</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⭐</div>
                <div class="stat-value" id="stat-clientes-activos">0</div>
                <div class="stat-label">Activos</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🆕</div>
                <div class="stat-value" id="stat-clientes-nuevos">0</div>
                <div class="stat-label">Nuevos (Este Mes)</div>
            </div>
        </div>

        <!-- Lista de Clientes -->
        <div id="lista-clientes-container"></div>
    `;
    
    actualizarStatsClientes();
    mostrarClientes();
}

function actualizarStatsClientes() {
    document.getElementById('stat-total-clientes').textContent = db.clientes.length;
    
    // Clientes con al menos un pedido
    const clientesConPedidos = new Set(db.pedidos.map(p => p.clienteId));
    document.getElementById('stat-clientes-activos').textContent = clientesConPedidos.size;
    
    // Clientes nuevos este mes
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const añoActual = hoy.getFullYear();
    const clientesNuevos = db.clientes.filter(c => {
        if (!c.fechaRegistro) return false;
        const fecha = new Date(c.fechaRegistro);
        return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
    }).length;
    document.getElementById('stat-clientes-nuevos').textContent = clientesNuevos;
}

function mostrarClientes() {
    let clientes = [...db.clientes];
    
    // Ordenar
    const orden = document.getElementById('orden-clientes').value;
    switch(orden) {
        case 'nombre':
            clientes.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 'fecha':
            clientes.sort((a, b) => new Date(b.fechaRegistro || 0) - new Date(a.fechaRegistro || 0));
            break;
        case 'pedidos':
            clientes.sort((a, b) => {
                const pedidosA = db.pedidos.filter(p => p.clienteId === a.id).length;
                const pedidosB = db.pedidos.filter(p => p.clienteId === b.id).length;
                return pedidosB - pedidosA;
            });
            break;
    }
    
    const container = document.getElementById('lista-clientes-container');
    
    if (clientes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">👥</div>
                <p>No hay clientes registrados</p>
                <button class="btn btn-primary" onclick="abrirModalCliente()" style="margin-top: 1rem;">
                    ➕ Agregar Primer Cliente
                </button>
            </div>
        `;
        return;
    }
    
    if (vistaClientes === 'grid') {
        mostrarClientesGrid(clientes, container);
    } else {
        mostrarClientesLista(clientes, container);
    }
}

function mostrarClientesGrid(clientes, container) {
    container.innerHTML = `
        <div class="clientes-grid">
            ${clientes.map(c => {
                const pedidos = db.pedidos.filter(p => p.clienteId === c.id);
                const totalGastado = pedidos.reduce((sum, p) => sum + (p.anticipo || 0), 0);
                const iniciales = c.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                
                return `
                    <div class="cliente-card-grid" onclick="verCliente(${c.id})">
                        <div class="cliente-header">
                            <div class="cliente-avatar">${iniciales}</div>
                            <div class="cliente-info-header">
                                <div class="cliente-nombre-grande">${c.nombre}</div>
                                ${c.empresa ? `<div class="cliente-empresa">${c.empresa}</div>` : ''}
                            </div>
                        </div>
                        
                        <div class="cliente-detalles">
                            <div class="cliente-detalle-item">
                                <span>📞</span> ${c.telefono}
                            </div>
                            ${c.email ? `<div class="cliente-detalle-item"><span>📧</span> ${c.email}</div>` : ''}
                        </div>
                        
                        <div class="cliente-footer">
                            <div class="cliente-stats">
                                <div class="cliente-stat">
                                    <div class="cliente-stat-valor">${pedidos.length}</div>
                                    <div class="cliente-stat-label">Pedidos</div>
                                </div>
                                <div class="cliente-stat">
                                    <div class="cliente-stat-valor">${formatearMoneda(totalGastado)}</div>
                                    <div class="cliente-stat-label">Total</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function mostrarClientesLista(clientes, container) {
    container.innerHTML = `
        <div class="clientes-lista">
            ${clientes.map(c => {
                const pedidos = db.pedidos.filter(p => p.clienteId === c.id);
                const iniciales = c.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                
                return `
                    <div class="cliente-card-lista" onclick="verCliente(${c.id})">
                        <div class="cliente-avatar-small">${iniciales}</div>
                        <div class="cliente-info-lista">
                            <div class="cliente-nombre-lista">${c.nombre}</div>
                            <div style="font-size: 0.85rem; color: var(--gray);">
                                📞 ${c.telefono} ${c.email ? '• 📧 ' + c.email : ''}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 600; color: var(--primary);">${pedidos.length} pedidos</div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function cambiarVistaClientes(vista) {
    vistaClientes = vista;
    renderClientes();
}

function buscarClientes() {
    const termino = document.getElementById('search-clientes').value.toLowerCase();
    let clientes = db.clientes;
    
    if (termino) {
        clientes = buscarEnArray(clientes, termino, ['nombre', 'telefono', 'email', 'empresa']);
    }
    
    const container = document.getElementById('lista-clientes-container');
    
    if (clientes.length === 0) {
        container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><p>No se encontraron clientes</p></div>`;
        return;
    }
    
    if (vistaClientes === 'grid') {
        mostrarClientesGrid(clientes, container);
    } else {
        mostrarClientesLista(clientes, container);
    }
}

function abrirModalCliente(id = null) {
    const cliente = id ? db.clientes.find(c => c.id === id) : null;
    const titulo = cliente ? '✏️ Editar Cliente' : '➕ Nuevo Cliente';
    
    abrirModal(`
        <div class="modal-header">
            <h3 class="modal-title">${titulo}</h3>
            <button class="modal-close" onclick="cerrarModal()">×</button>
        </div>
        <div class="modal-body">
            <form id="form-cliente" onsubmit="guardarCliente(event, ${id})">
                <div class="form-group">
                    <label>Nombre Completo *</label>
                    <input type="text" name="nombre" class="form-control" required 
                           value="${cliente ? cliente.nombre : ''}" placeholder="Ej: María García">
                </div>
                
                <div class="form-group">
                    <label>Teléfono * (10 dígitos)</label>
                    <input type="tel" name="telefono" class="form-control" required 
                           value="${cliente ? cliente.telefono : ''}" placeholder="6141234567">
                </div>
                
                <div class="form-group">
                    <label>Email (opcional)</label>
                    <input type="email" name="email" class="form-control" 
                           value="${cliente ? cliente.email || '' : ''}" placeholder="correo@ejemplo.com">
                </div>
                
                <div class="form-group">
                    <label>Empresa (opcional)</label>
                    <input type="text" name="empresa" class="form-control" 
                           value="${cliente ? cliente.empresa || '' : ''}" placeholder="Nombre de la empresa">
                </div>
                
                <div class="form-group">
                    <label>Dirección (opcional)</label>
                    <textarea name="direccion" class="form-control" rows="2" 
                              placeholder="Calle, colonia, ciudad...">${cliente ? cliente.direccion || '' : ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Notas (opcional)</label>
                    <textarea name="notas" class="form-control" rows="3" 
                              placeholder="Preferencias, observaciones...">${cliente ? cliente.notas || '' : ''}</textarea>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" onclick="cerrarModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">💾 Guardar</button>
                </div>
            </form>
        </div>
    `);
}

function guardarCliente(event, id = null) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const errores = validarFormularioCliente(formData);
    
    if (!mostrarErrores(errores)) return;
    
    const clienteData = {
        nombre: formData.get('nombre'),
        telefono: formData.get('telefono'),
        email: formData.get('email') || '',
        empresa: formData.get('empresa') || '',
        direccion: formData.get('direccion') || '',
        notas: formData.get('notas') || '',
        fechaRegistro: id ? db.clientes.find(c => c.id === id).fechaRegistro : obtenerFechaHoy()
    };
    
    if (id) {
        const index = db.clientes.findIndex(c => c.id === id);
        db.clientes[index] = { ...db.clientes[index], ...clienteData };
    } else {
        db.clientes.push({
            id: nextId.clientes++,
            ...clienteData
        });
    }
    
    // Sincronización automática con Firebase
    cerrarModal();
    renderClientes();
}

function verCliente(id) {
    const c = db.clientes.find(x => x.id === id);
    if (!c) return;
    
    const pedidos = db.pedidos.filter(p => p.clienteId === id);
    const totalGastado = pedidos.reduce((sum, p) => sum + (p.anticipo || 0), 0);
    
    abrirModal(`
        <div class="modal-header">
            <h3 class="modal-title">👤 ${c.nombre}</h3>
            <button class="modal-close" onclick="cerrarModal()">×</button>
        </div>
        <div class="modal-body">
            <!-- Información del Cliente -->
            <div class="detalle-seccion">
                <div class="detalle-titulo">📋 Información</div>
                <div style="display: grid; gap: 0.5rem;">
                    <div><strong>Teléfono:</strong> ${c.telefono}</div>
                    ${c.email ? `<div><strong>Email:</strong> ${c.email}</div>` : ''}
                    ${c.empresa ? `<div><strong>Empresa:</strong> ${c.empresa}</div>` : ''}
                    ${c.direccion ? `<div><strong>Dirección:</strong> ${c.direccion}</div>` : ''}
                    <div><strong>Fecha de registro:</strong> ${formatearFecha(c.fechaRegistro)}</div>
                </div>
            </div>
            
            ${c.notas ? `
                <div class="detalle-seccion">
                    <div class="detalle-titulo">📝 Notas</div>
                    <p>${c.notas}</p>
                </div>
            ` : ''}
            
            <!-- Estadísticas -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">
                <div class="stat-card">
                    <div class="stat-icon">📦</div>
                    <div class="stat-value">${pedidos.length}</div>
                    <div class="stat-label">Total Pedidos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-value">${formatearMoneda(totalGastado)}</div>
                    <div class="stat-label">Total Gastado</div>
                </div>
            </div>
            
            <!-- Acciones -->
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="cerrarModal()">Cerrar</button>
                <button class="btn btn-outline" onclick="eliminarCliente(${id})" 
                        style="color: #ef5350; border-color: #ef5350;">🗑️ Eliminar</button>
                <button class="btn btn-primary" onclick="abrirModalCliente(${id})">✏️ Editar</button>
            </div>
        </div>
    `);
}

function eliminarCliente(id) {
    const cliente = db.clientes.find(c => c.id === id);
    if (!cliente) return;
    
    const pedidosAsociados = db.pedidos.filter(p => p.clienteId === id).length;
    
    let mensaje = `¿Estás seguro de eliminar al cliente "${cliente.nombre}"?`;
    if (pedidosAsociados > 0) {
        mensaje += `\n\n⚠️ Este cliente tiene ${pedidosAsociados} pedido(s) asociado(s). Los pedidos NO se eliminarán.`;
    }
    
    if (confirm(mensaje)) {
        const index = db.clientes.findIndex(c => c.id === id);
        db.clientes.splice(index, 1);
        // Sincronización automática con Firebase
        cerrarModal();
        renderClientes();
        alert('✅ Cliente eliminado correctamente');
    }
}
