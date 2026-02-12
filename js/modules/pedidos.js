// ========== MÓDULO: PEDIDOS (SIMPLIFICADO PERO FUNCIONAL) ==========

// Variable temporal para productos seleccionados
let productosSeleccionadosPedido = [];

function initPedidos() {
    console.log('✅ Módulo Pedidos inicializado');
}

function renderPedidos() {
    const container = document.getElementById('view-pedidos');
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2 class="section-title" style="margin: 0;">📦 Pedidos</h2>
            <button class="btn btn-primary" onclick="abrirModalPedido()">➕ Nuevo Pedido</button>
        </div>
        
        <!-- Filtros -->
        <div style="background: white; padding: 1rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <select id="filtro-estado-pedidos" class="form-control" onchange="renderizarListaPedidos()" style="max-width: 200px;">
                    <option value="todos">Todos los Estados</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="en-proceso">En Proceso</option>
                    <option value="completado">Completados</option>
                    <option value="entregado">Entregados</option>
                    <option value="cancelado">Cancelados</option>
                </select>
            </div>
        </div>
        
        <!-- Lista de Pedidos -->
        <div id="pedidos-container"></div>
    `;
    
    renderizarListaPedidos();
}

function renderizarListaPedidos() {
    let pedidos = [...db.pedidos];
    
    const filtroEstado = document.getElementById('filtro-estado-pedidos')?.value || 'todos';
    if (filtroEstado !== 'todos') {
        pedidos = pedidos.filter(p => p.estado === filtroEstado);
    }
    
    pedidos.sort((a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido));
    
    const container = document.getElementById('pedidos-container');
    
    if (pedidos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <p>No hay pedidos para mostrar</p>
                <button class="btn btn-primary" onclick="abrirModalPedido()" style="margin-top: 1rem;">
                    ➕ Crear Primer Pedido
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = pedidos.map(p => {
        const cliente = db.clientes.find(c => c.id === p.clienteId);
        const estadoColor = {
            'pendiente': '#ffa726',
            'en-proceso': '#42a5f5',
            'completado': '#66bb6a',
            'entregado': '#26a69a',
            'cancelado': '#ef5350'
        }[p.estado] || '#757575';
        
        const diasFaltantes = diasHastaFecha(p.fechaEntrega);
        const urgencia = diasFaltantes <= 1 ? '🔴' : diasFaltantes <= 3 ? '🟡' : '🟢';
        
        return `
            <div style="background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; border-left: 4px solid ${estadoColor}; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.08);"
                 onclick="verPedidoDetalle(${p.id})">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h4 style="margin: 0 0 0.5rem 0;">Pedido #${p.id} ${urgencia}</h4>
                        <p style="margin: 0; color: var(--gray); font-size: 0.9rem;">
                            ${cliente ? '👤 ' + cliente.nombre : '⚠️ Cliente eliminado'}
                        </p>
                    </div>
                    <span class="badge" style="background: ${estadoColor}; color: white;">${p.estado}</span>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <div style="font-size: 0.75rem; color: var(--gray);">Fecha Pedido</div>
                        <div style="font-weight: 600;">${formatearFecha(p.fechaPedido)}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; color: var(--gray);">Fecha Entrega</div>
                        <div style="font-weight: 600;">${formatearFecha(p.fechaEntrega)}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; color: var(--gray);">Total</div>
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary);">${formatearMoneda(p.total || 0)}</div>
                    </div>
                </div>
                
                ${p.productos && p.productos.length > 0 ? `
                    <div style="padding-top: 1rem; border-top: 1px solid var(--border);">
                        <div style="font-size: 0.85rem; color: var(--gray); margin-bottom: 0.5rem;">Productos:</div>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            ${p.productos.slice(0, 3).map(prod => 
                                `<span style="background: var(--light); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem;">
                                    ${prod.nombre} (${prod.cantidad})
                                </span>`
                            ).join('')}
                            ${p.productos.length > 3 ? `<span style="color: var(--gray); font-size: 0.85rem;">+${p.productos.length - 3} más</span>` : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function verPedidoDetalle(id) {
    const p = db.pedidos.find(x => x.id === id);
    if (!p) return;
    
    const cliente = db.clientes.find(c => c.id === p.clienteId);
    const estadoColor = {
        'pendiente': '#ffa726',
        'en-proceso': '#42a5f5',
        'completado': '#66bb6a',
        'entregado': '#26a69a',
        'cancelado': '#ef5350'
    }[p.estado] || '#757575';
    
    abrirModal(`
        <div class="modal-header">
            <h3 class="modal-title">📦 Pedido #${p.id}</h3>
            <button class="modal-close" onclick="cerrarModal()">×</button>
        </div>
        <div class="modal-body">
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <span class="badge" style="background: ${estadoColor}; color: white; font-size: 1rem; padding: 0.5rem 1.5rem;">${p.estado}</span>
            </div>
            
            <div class="detalle-seccion">
                <div class="detalle-titulo">👤 Cliente</div>
                <p><strong>${cliente ? cliente.nombre : 'Cliente eliminado'}</strong></p>
                ${cliente && cliente.telefono ? `<p>📞 ${cliente.telefono}</p>` : ''}
            </div>
            
            <div class="detalle-seccion">
                <div class="detalle-titulo">📦 Productos</div>
                ${p.productos && p.productos.length > 0 ? p.productos.map(prod => `
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--light); border-radius: 8px; margin-bottom: 0.5rem;">
                        <span>${prod.nombre}</span>
                        <span><strong>${prod.cantidad}</strong> × ${formatearMoneda(prod.precio)} = ${formatearMoneda(prod.cantidad * prod.precio)}</span>
                    </div>
                `).join('') : '<p>Sin productos</p>'}
            </div>
            
            <div class="detalle-seccion">
                <div class="detalle-titulo">💰 Resumen Financiero</div>
                <div style="display: grid; gap: 0.5rem;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Subtotal:</span>
                        <strong>${formatearMoneda(p.subtotal || p.total || 0)}</strong>
                    </div>
                    ${p.descuento > 0 ? `
                        <div style="display: flex; justify-content: space-between; color: var(--success);">
                            <span>Descuento:</span>
                            <strong>-${formatearMoneda(p.descuento)}</strong>
                        </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; padding-top: 0.5rem; border-top: 2px solid var(--border); font-size: 1.2rem;">
                        <span style="font-weight: 700;">TOTAL:</span>
                        <strong style="color: var(--primary);">${formatearMoneda(p.total || 0)}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; color: var(--success);">
                        <span>Anticipo pagado:</span>
                        <strong>${formatearMoneda(p.anticipo || 0)}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; color: var(--warning);">
                        <span>Saldo pendiente:</span>
                        <strong>${formatearMoneda((p.total || 0) - (p.anticipo || 0))}</strong>
                    </div>
                </div>
            </div>
            
            <div class="detalle-seccion">
                <div class="detalle-titulo">📅 Fechas</div>
                <div style="display: grid; gap: 0.5rem;">
                    <div><strong>Fecha de pedido:</strong> ${formatearFecha(p.fechaPedido)}</div>
                    <div><strong>Fecha de entrega:</strong> ${formatearFecha(p.fechaEntrega)}</div>
                    ${p.horaEntrega ? `<div><strong>Hora:</strong> ${p.horaEntrega}</div>` : ''}
                </div>
            </div>
            
            ${p.notas ? `
                <div class="detalle-seccion">
                    <div class="detalle-titulo">📝 Notas</div>
                    <p>${p.notas}</p>
                </div>
            ` : ''}
            
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="cerrarModal()">Cerrar</button>
                <button class="btn btn-outline" onclick="eliminarPedido(${p.id})" 
                        style="color: #ef5350; border-color: #ef5350;">🗑️ Eliminar</button>
                <button class="btn btn-primary" onclick="editarPedido(${p.id})">✏️ Editar</button>
            </div>
        </div>
    `);
}

function eliminarPedido(id) {
    const pedido = db.pedidos.find(p => p.id === id);
    if (!pedido) return;
    
    const cliente = db.clientes.find(c => c.id === pedido.clienteId);
    const nombreCliente = cliente ? cliente.nombre : 'Cliente';
    
    const mensaje = `¿Estás seguro de eliminar el pedido #${id} de ${nombreCliente}?\n\nTotal: ${formatearMoneda(pedido.total || 0)}`;
    
    if (confirm(mensaje)) {
        const index = db.pedidos.findIndex(p => p.id === id);
        db.pedidos.splice(index, 1);
        // Sincronización automática con Firebase
        cerrarModal();
        renderPedidos();
        alert('✅ Pedido eliminado correctamente');
    }
}

function abrirModalPedido(data = null) {
    // Resetear productos seleccionados
    productosSeleccionadosPedido = data && data.productos ? [...data.productos] : [];
    
    const opcionesClientes = db.clientes.map(c => 
        `<option value="${c.id}"${data && data.clienteId === c.id ? ' selected' : ''}>${c.nombre}${c.empresa ? ` - ${c.empresa}` : ''}</option>`
    ).join('');
    
    abrirModal(`
        <div class="modal-header">
            <h3 class="modal-title">${data ? '✏️ Editar' : '➕ Nuevo'} Pedido</h3>
            <button class="modal-close" onclick="cerrarModal()">×</button>
        </div>
        <div class="modal-body">
            <form id="form-pedido" onsubmit="guardarPedido(event, ${data ? data.id : 'null'})">
                <!-- Cliente -->
                <div class="form-group">
                    <label class="form-label">Cliente *</label>
                    <select class="form-control" name="clienteId" required>
                        <option value="">Seleccionar cliente...</option>
                        ${opcionesClientes}
                    </select>
                </div>

                <!-- Productos -->
                <div class="form-group">
                    <label class="form-label">Productos *</label>
                    <div id="productos-seleccionados-pedido" style="margin-bottom: 1rem;">
                        ${renderProductosSeleccionados()}
                    </div>
                    <button type="button" class="btn btn-outline" onclick="abrirSelectorProductosPedido()">
                        ➕ Agregar Producto
                    </button>
                </div>

                <!-- Resumen -->
                <div style="background: var(--light); padding: 1rem; border-radius: 12px; margin: 1rem 0;">
                    <div style="display: flex; justify-content: space-between; font-size: 1.2rem;">
                        <strong>TOTAL:</strong>
                        <strong style="color: var(--primary);" id="pedido-total-display">${formatearMoneda(calcularTotalPedido())}</strong>
                    </div>
                </div>

                <!-- Pago -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Anticipo/Pago</label>
                        <input type="number" class="form-control" name="anticipo" value="${data ? data.anticipo : 0}" min="0" step="0.01">
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

                <!-- Fechas -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Fecha de Pedido *</label>
                        <input type="date" class="form-control" name="fechaPedido" value="${data ? data.fechaPedido : obtenerFechaHoy()}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Fecha de Entrega *</label>
                        <input type="date" class="form-control" name="fechaEntrega" value="${data ? data.fechaEntrega : obtenerFechaHoy()}" required>
                    </div>
                </div>

                <!-- Estado -->
                <div class="form-group">
                    <label class="form-label">Estado *</label>
                    <select class="form-control" name="estado" required>
                        <option value="pendiente" ${!data || data.estado === 'pendiente' ? 'selected' : ''}>⏳ Pendiente</option>
                        <option value="en-proceso" ${data && data.estado === 'en-proceso' ? 'selected' : ''}>🔄 En Proceso</option>
                        <option value="completado" ${data && data.estado === 'completado' ? 'selected' : ''}>✅ Completado</option>
                        <option value="entregado" ${data && data.estado === 'entregado' ? 'selected' : ''}>📦 Entregado</option>
                        <option value="cancelado" ${data && data.estado === 'cancelado' ? 'selected' : ''}>❌ Cancelado</option>
                    </select>
                </div>

                <!-- Notas -->
                <div class="form-group">
                    <label class="form-label">Notas</label>
                    <textarea class="form-control" name="notas" rows="3" placeholder="Notas adicionales...">${data && data.notas ? data.notas : ''}</textarea>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="cerrarModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="document.getElementById('form-pedido').requestSubmit()">💾 Guardar Pedido</button>
        </div>
    `);
}

function renderProductosSeleccionados() {
    if (productosSeleccionadosPedido.length === 0) {
        return '<div style="color: var(--gray); padding: 1rem; text-align: center; background: var(--light); border-radius: 8px;">No hay productos seleccionados</div>';
    }
    
    return productosSeleccionadosPedido.map((p, idx) => `
        <div style="background: var(--light); padding: 0.75rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>${p.nombre}</strong>
                <div style="margin-top: 0.25rem;">
                    <input type="number" value="${p.cantidad}" min="1" 
                        onchange="actualizarCantidadProductoPedido(${idx}, this.value)"
                        style="width: 60px; padding: 0.25rem; border: 1px solid var(--border); border-radius: 4px;">
                    × ${formatearMoneda(p.precio)} = <strong>${formatearMoneda(p.cantidad * p.precio)}</strong>
                </div>
            </div>
            <button type="button" class="btn btn-outline" onclick="eliminarProductoPedido(${idx})" 
                style="color: #ef5350; border-color: #ef5350; padding: 0.25rem 0.75rem;">
                🗑️
            </button>
        </div>
    `).join('');
}

function abrirSelectorProductosPedido() {
    const productosHTML = db.productos
        .filter(p => p.estado === 'activo' && p.stock > 0)
        .map(p => `
            <div class="categoria-card" onclick="agregarProductoAPedido(${p.id})" style="cursor: pointer;">
                <div style="font-size: 3rem;">${p.imagen || '📦'}</div>
                <h4 style="margin: 0.5rem 0;">${p.nombre}</h4>
                <div style="font-size: 1.1rem; font-weight: 700; color: var(--primary);">${formatearMoneda(p.precio)}</div>
                <div style="font-size: 0.85rem; color: var(--gray);">Stock: ${p.stock}</div>
            </div>
        `).join('');
    
    abrirModal(`
        <div class="modal-header">
            <h3 class="modal-title">Seleccionar Producto</h3>
            <button class="modal-close" onclick="abrirModalPedido()">×</button>
        </div>
        <div class="modal-body">
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                ${productosHTML || '<p style="text-align: center; color: var(--gray);">No hay productos disponibles</p>'}
            </div>
        </div>
    `);
}

function agregarProductoAPedido(productoId) {
    const producto = db.productos.find(p => p.id === productoId);
    if (!producto) return;
    
    // Verificar si ya está agregado
    const yaExiste = productosSeleccionadosPedido.find(p => p.id === productoId);
    if (yaExiste) {
        yaExiste.cantidad++;
    } else {
        productosSeleccionadosPedido.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }
    
    // Volver al modal de pedido
    abrirModalPedido();
}

function actualizarCantidadProductoPedido(index, cantidad) {
    productosSeleccionadosPedido[index].cantidad = parseInt(cantidad) || 1;
    document.getElementById('productos-seleccionados-pedido').innerHTML = renderProductosSeleccionados();
    document.getElementById('pedido-total-display').textContent = formatearMoneda(calcularTotalPedido());
}

function eliminarProductoPedido(index) {
    productosSeleccionadosPedido.splice(index, 1);
    document.getElementById('productos-seleccionados-pedido').innerHTML = renderProductosSeleccionados();
    document.getElementById('pedido-total-display').textContent = formatearMoneda(calcularTotalPedido());
}

function calcularTotalPedido() {
    return productosSeleccionadosPedido.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
}

function guardarPedido(event, id) {
    event.preventDefault();
    
    if (productosSeleccionadosPedido.length === 0) {
        alert('⚠️ Debes agregar al menos un producto al pedido');
        return;
    }
    
    const form = new FormData(event.target);
    const total = calcularTotalPedido();
    
    const pedido = {
        clienteId: parseInt(form.get('clienteId')),
        productos: [...productosSeleccionadosPedido],
        subtotal: total,
        descuento: 0,
        total: total,
        anticipo: parseFloat(form.get('anticipo')) || 0,
        metodoPago: form.get('metodoPago'),
        fechaPedido: form.get('fechaPedido'),
        fechaEntrega: form.get('fechaEntrega'),
        estado: form.get('estado'),
        notas: form.get('notas') || ''
    };
    
    if (id) {
        const index = db.pedidos.findIndex(p => p.id === id);
        db.pedidos[index] = { ...db.pedidos[index], ...pedido };
        alert('✅ Pedido actualizado correctamente');
    } else {
        pedido.id = nextId.pedidos++;
        db.pedidos.push(pedido);
        alert('✅ Pedido creado correctamente');
    }
    
    // Actualizar stock de productos
    pedido.productos.forEach(p => {
        const producto = db.productos.find(prod => prod.id === p.id);
        if (producto && !id) { // Solo restar stock en pedidos nuevos
            producto.stock -= p.cantidad;
            producto.vendidos = (producto.vendidos || 0) + p.cantidad;
        }
    });
    
    // Sincronización automática con Firebase
    cerrarModal();
    renderPedidos();
}

function editarPedido(id) {
    const p = db.pedidos.find(x => x.id === id);
    cerrarModal();
    setTimeout(() => abrirModalPedido(p), 100);
}
