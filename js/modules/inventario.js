// ========== MÓDULO: INVENTARIO CON 6 PESTAÑAS ==========

let pestanaInventarioActual = 'stock'; // Cambiar pestaña inicial a Stock

function initInventario() {
    console.log('✅ Módulo Inventario inicializado');
}

function renderInventario() {
    const container = document.getElementById('view-inventario');
    
    container.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <h2 class="section-title">📦 Sistema de Inventario</h2>
            
            <!-- Pestañas de navegación REORDENADAS -->
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem; overflow-x: auto; padding-bottom: 0.5rem;">
                <button class="tab-btn ${pestanaInventarioActual === 'stock' ? 'active' : ''}" 
                        onclick="cambiarPestanaInventario('stock')">
                    📊 Stock
                </button>
                <button class="tab-btn ${pestanaInventarioActual === 'insumos' ? 'active' : ''}" 
                        onclick="cambiarPestanaInventario('insumos')">
                    🧵 Insumos
                </button>
                <button class="tab-btn ${pestanaInventarioActual === 'entradas' ? 'active' : ''}" 
                        onclick="cambiarPestanaInventario('entradas')">
                    📥 Entradas
                </button>
                <button class="tab-btn ${pestanaInventarioActual === 'salidas' ? 'active' : ''}" 
                        onclick="cambiarPestanaInventario('salidas')">
                    📤 Salidas
                </button>
                <button class="tab-btn ${pestanaInventarioActual === 'productos' ? 'active' : ''}" 
                        onclick="cambiarPestanaInventario('productos')">
                    🎁 Productos
                </button>
                <button class="tab-btn ${pestanaInventarioActual === 'ventas' ? 'active' : ''}" 
                        onclick="cambiarPestanaInventario('ventas')">
                    💰 Ventas
                </button>
            </div>
        </div>
        
        <!-- Contenedor dinámico para cada pestaña -->
        <div id="contenido-pestana-inventario"></div>
    `;
    
    renderPestanaInventario();
}

function cambiarPestanaInventario(pestaña) {
    pestanaInventarioActual = pestaña;
    renderInventario();
}

function renderPestanaInventario() {
    const container = document.getElementById('contenido-pestana-inventario');
    
    switch(pestanaInventarioActual) {
        case 'stock':
            renderStock(container);
            break;
        case 'insumos':
            renderInsumos(container);
            break;
        case 'entradas':
            renderEntradas(container);
            break;
        case 'salidas':
            renderSalidas(container);
            break;
        case 'productos':
            renderProductosInventario(container);
            break;
        case 'ventas':
            renderVentas(container);
            break;
    }
}

// ========== PESTAÑA: INSUMOS ==========
function renderInsumos(container) {
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="margin: 0; color: var(--dark);">🧵 Catálogo de Insumos</h3>
            <button class="btn btn-primary" onclick="abrirModalInsumo()">➕ Nuevo Insumo</button>
        </div>
        
        <!-- Filtros y búsqueda -->
        <div style="background: white; padding: 1rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <input type="text" id="search-insumos" placeholder="🔍 Buscar insumo..." 
                       onkeyup="filtrarInsumos()" class="form-control" style="flex: 1; min-width: 250px;">
                
                <select id="filtro-categoria-insumo" class="form-control" onchange="filtrarInsumos()" style="max-width: 200px;">
                    <option value="todos">Todas las categorías</option>
                    ${obtenerCategoriasInsumos().map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
            </div>
        </div>
        
        <!-- Estadísticas -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div class="stat-card">
                <div class="stat-icon">📦</div>
                <div class="stat-value" id="stat-total-insumos">0</div>
                <div class="stat-label">Total Insumos</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⚠️</div>
                <div class="stat-value" id="stat-insumos-bajo">0</div>
                <div class="stat-label">Stock Bajo</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-value" id="stat-valor-insumos">$0</div>
                <div class="stat-label">Valor Total</div>
            </div>
        </div>
        
        <!-- Tabla de insumos -->
        <div id="insumos-container"></div>
    `;
    
    actualizarStatsInsumos();
    mostrarInsumos();
}

function obtenerCategoriasInsumos() {
    if (!db.insumos || db.insumos.length === 0) return [];
    const categorias = [...new Set(db.insumos.map(i => i.categoria))];
    return categorias.sort();
}

function actualizarStatsInsumos() {
    const total = db.insumos ? db.insumos.length : 0;
    document.getElementById('stat-total-insumos').textContent = total;
    
    const stockBajo = db.insumos ? db.insumos.filter(i => i.stock <= i.stockMinimo).length : 0;
    document.getElementById('stat-insumos-bajo').textContent = stockBajo;
    
    const valorTotal = db.insumos ? db.insumos.reduce((sum, i) => {
        const stock = parseFloat(i.stock) || 0;
        const costo = parseFloat(i.costoUnitario) || 0;
        return sum + (stock * costo);
    }, 0) : 0;
    document.getElementById('stat-valor-insumos').textContent = formatearMoneda(valorTotal);
}

function mostrarInsumos() {
    filtrarInsumos();
}

function filtrarInsumos() {
    let insumos = db.insumos ? [...db.insumos] : [];
    
    const busqueda = document.getElementById('search-insumos')?.value.toLowerCase() || '';
    if (busqueda) {
        insumos = insumos.filter(i => 
            i.nombre.toLowerCase().includes(busqueda) ||
            i.codigo.toLowerCase().includes(busqueda) ||
            i.categoria.toLowerCase().includes(busqueda) ||
            (i.proveedor && i.proveedor.toLowerCase().includes(busqueda))
        );
    }
    
    const categoriaFiltro = document.getElementById('filtro-categoria-insumo')?.value || 'todos';
    if (categoriaFiltro !== 'todos') {
        insumos = insumos.filter(i => i.categoria === categoriaFiltro);
    }
    
    const container = document.getElementById('insumos-container');
    if (!container) return;
    
    if (insumos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🧵</div>
                <p>No hay insumos registrados</p>
                <button class="btn btn-primary" onclick="abrirModalInsumo()" style="margin-top: 1rem;">
                    ➕ Agregar Primer Insumo
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div style="background: white; border-radius: 12px; overflow-x: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <table style="width: 100%; border-collapse: collapse; min-width: 1200px;">
                <thead>
                    <tr style="background: var(--light); border-bottom: 2px solid var(--border);">
                        <th style="padding: 1rem; text-align: left;">Código</th>
                        <th style="padding: 1rem; text-align: left;">Nombre</th>
                        <th style="padding: 1rem; text-align: left;">Descripción</th>
                        <th style="padding: 1rem; text-align: center;">Unidad</th>
                        <th style="padding: 1rem; text-align: left;">Categoría</th>
                        <th style="padding: 1rem; text-align: left;">Proveedor</th>
                        <th style="padding: 1rem; text-align: left;">Ubicación</th>
                        <th style="padding: 1rem; text-align: left;">Contacto</th>
                        <th style="padding: 1rem; text-align: center;">Foto</th>
                        <th style="padding: 1rem; text-align: center;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${insumos.map(i => {
                        const stockBajo = i.stock <= i.stockMinimo;
                        return `
                            <tr style="border-bottom: 1px solid var(--border); transition: background 0.2s;" 
                                onmouseover="this.style.background='var(--light)'" 
                                onmouseout="this.style.background='white'">
                                <td style="padding: 1rem;">
                                    <span style="font-weight: 600; font-family: monospace; background: var(--light); padding: 0.25rem 0.5rem; border-radius: 6px;">
                                        ${i.codigo}
                                    </span>
                                    ${stockBajo ? '<div style="font-size: 0.75rem; color: #ef5350; margin-top: 0.25rem;">⚠️ Stock bajo</div>' : ''}
                                </td>
                                <td style="padding: 1rem;">
                                    <div style="font-weight: 600;">${i.nombre}</div>
                                </td>
                                <td style="padding: 1rem;">
                                    <div style="font-size: 0.9rem; color: var(--gray); max-width: 200px; overflow: hidden; text-overflow: ellipsis;">
                                        ${i.descripcion || '-'}
                                    </div>
                                </td>
                                <td style="padding: 1rem; text-align: center; font-weight: 500;">
                                    ${i.unidad}
                                </td>
                                <td style="padding: 1rem;">
                                    <span style="background: var(--primary)20; color: var(--primary); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; font-weight: 500;">
                                        ${i.categoria}
                                    </span>
                                </td>
                                <td style="padding: 1rem;">
                                    <div style="font-size: 0.9rem;">${i.proveedor || '-'}</div>
                                    ${i.linkCompra ? `<a href="${i.linkCompra}" target="_blank" style="font-size: 0.75rem; color: var(--primary);">🔗 Ver tienda</a>` : ''}
                                </td>
                                <td style="padding: 1rem; font-size: 0.9rem;">
                                    ${i.ubicacion || '-'}
                                </td>
                                <td style="padding: 1rem; font-size: 0.9rem;">
                                    ${i.contactoProveedor || '-'}
                                </td>
                                <td style="padding: 1rem; text-align: center;">
                                    ${i.foto ? `<img src="${i.foto}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px; cursor: pointer;" onclick="verImagenGrande('${i.foto}', '${i.nombre}')">` : '<span style="color: var(--gray);">-</span>'}
                                </td>
                                <td style="padding: 1rem; text-align: center; white-space: nowrap;">
                                    <button class="btn btn-outline" onclick="editarInsumo(${i.id})" 
                                        style="padding: 0.5rem 0.75rem; font-size: 0.85rem; margin-right: 0.5rem;">✏️</button>
                                    <button class="btn btn-outline" onclick="eliminarInsumo(${i.id})" 
                                        style="padding: 0.5rem 0.75rem; font-size: 0.85rem; color: #ef5350; border-color: #ef5350;">🗑️</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function abrirModalInsumo(data = null) {
    abrirModal(`
        <div class="modal-header">
            <h3 class="modal-title">${data ? '✏️ Editar' : '➕ Nuevo'} Insumo</h3>
            <button class="modal-close" onclick="cerrarModal()">×</button>
        </div>
        <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
            <form id="form-insumo" onsubmit="guardarInsumo(event, ${data ? data.id : 'null'})">
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Código *</label>
                        <input type="text" class="form-control" name="codigo" value="${data ? data.codigo : ''}" 
                               placeholder="Ej: INS-001" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Nombre *</label>
                        <input type="text" class="form-control" name="nombre" value="${data ? data.nombre : ''}" 
                               placeholder="Nombre del insumo" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-control" name="descripcion" rows="2" 
                              placeholder="Descripción detallada del insumo...">${data && data.descripcion ? data.descripcion : ''}</textarea>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Unidad de Medida *</label>
                        <input type="text" class="form-control" name="unidad" value="${data ? data.unidad : ''}" 
                               placeholder="Ej: metros, kg, piezas" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Categoría *</label>
                        <input type="text" class="form-control" name="categoria" value="${data ? data.categoria : ''}" 
                               placeholder="Ej: listones, papel, dulces" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Proveedor</label>
                    <input type="text" class="form-control" name="proveedor" value="${data && data.proveedor ? data.proveedor : ''}" 
                           placeholder="Nombre del proveedor">
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Ubicación</label>
                        <input type="text" class="form-control" name="ubicacion" value="${data && data.ubicacion ? data.ubicacion : ''}" 
                               placeholder="Ej: Estante A3, Bodega 2">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Contacto Proveedor</label>
                        <input type="text" class="form-control" name="contactoProveedor" value="${data && data.contactoProveedor ? data.contactoProveedor : ''}" 
                               placeholder="Teléfono o email">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Link de Compra</label>
                    <input type="url" class="form-control" name="linkCompra" value="${data && data.linkCompra ? data.linkCompra : ''}" 
                           placeholder="https://...">
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Stock Inicial *</label>
                        <input type="number" class="form-control" name="stock" value="${data ? data.stock : 0}" 
                               min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Stock Mínimo *</label>
                        <input type="number" class="form-control" name="stockMinimo" value="${data ? data.stockMinimo : 0}" 
                               min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Costo Unitario *</label>
                        <input type="number" class="form-control" name="costoUnitario" value="${data ? data.costoUnitario : 0}" 
                               min="0" step="0.01" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Fotografía del Producto</label>
                    <input type="text" class="form-control" name="foto" value="${data && data.foto ? data.foto : ''}" 
                           placeholder="URL de la imagen">
                    <small style="color: var(--gray); font-size: 0.85rem;">Ingresa una URL de imagen</small>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="cerrarModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="document.getElementById('form-insumo').requestSubmit()">
                💾 ${data ? 'Actualizar' : 'Crear'}
            </button>
        </div>
    `);
}

function guardarInsumo(event, id) {
    event.preventDefault();
    const form = new FormData(event.target);
    
    const insumo = {
        codigo: form.get('codigo'),
        nombre: form.get('nombre'),
        descripcion: form.get('descripcion'),
        unidad: form.get('unidad'),
        categoria: form.get('categoria'),
        proveedor: form.get('proveedor'),
        ubicacion: form.get('ubicacion'),
        contactoProveedor: form.get('contactoProveedor'),
        linkCompra: form.get('linkCompra'),
        foto: form.get('foto'),
        stock: parseFloat(form.get('stock')) || 0,
        stockMinimo: parseFloat(form.get('stockMinimo')) || 0,
        costoUnitario: parseFloat(form.get('costoUnitario')) || 0,
        fechaRegistro: obtenerFechaHoy()
    };
    
    if (!db.insumos) db.insumos = [];
    
    if (id) {
        const index = db.insumos.findIndex(i => i.id === id);
        db.insumos[index] = { ...db.insumos[index], ...insumo };
        alert('✅ Insumo actualizado correctamente');
    } else {
        insumo.id = nextId.insumos++;
        db.insumos.push(insumo);
        alert('✅ Insumo creado correctamente');
    }
    
    // Sincronización automática con Firebase
    cerrarModal();
    renderPestanaInventario();
}

function editarInsumo(id) {
    const insumo = db.insumos.find(i => i.id === id);
    if (insumo) abrirModalInsumo(insumo);
}

function eliminarInsumo(id) {
    if (confirm('¿Estás seguro de eliminar este insumo?')) {
        const index = db.insumos.findIndex(i => i.id === id);
        db.insumos.splice(index, 1);
        // Sincronización automática con Firebase
        renderPestanaInventario();
        alert('✅ Insumo eliminado');
    }
}

function verImagenGrande(url, nombre) {
    abrirModal(`
        <div class="modal-header">
            <h3 class="modal-title">${nombre}</h3>
            <button class="modal-close" onclick="cerrarModal()">×</button>
        </div>
        <div class="modal-body" style="text-align: center;">
            <img src="${url}" style="max-width: 100%; max-height: 70vh; border-radius: 12px;">
        </div>
    `);
}

// ========== PESTAÑA: ENTRADAS ==========
function renderEntradas(container) {
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="margin: 0; color: var(--dark);">📥 Registro de Entradas</h3>
            <button class="btn btn-primary" onclick="abrirModalEntrada()">➕ Nueva Entrada</button>
        </div>
        
        <!-- Filtros -->
        <div style="background: white; padding: 1rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <input type="text" id="search-entradas" placeholder="🔍 Buscar por factura o proveedor..." 
                       onkeyup="filtrarEntradas()" class="form-control" style="flex: 1; min-width: 250px;">
                
                <select id="filtro-proveedor-entrada" class="form-control" onchange="filtrarEntradas()" style="max-width: 200px;">
                    <option value="todos">Todos los proveedores</option>
                    ${obtenerProveedoresEntradas().map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
            </div>
        </div>
        
        <!-- Estadísticas -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div class="stat-card">
                <div class="stat-icon">📥</div>
                <div class="stat-value" id="stat-total-entradas">0</div>
                <div class="stat-label">Total Entradas</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-value" id="stat-valor-entradas">$0</div>
                <div class="stat-label">Valor Total</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📦</div>
                <div class="stat-value" id="stat-items-entradas">0</div>
                <div class="stat-label">Items Registrados</div>
            </div>
        </div>
        
        <!-- Tabla de entradas -->
        <div id="entradas-container"></div>
    `;
    
    actualizarStatsEntradas();
    mostrarEntradas();
}

function obtenerProveedoresEntradas() {
    if (!db.entradas || db.entradas.length === 0) return [];
    const proveedores = [...new Set(db.entradas.map(e => e.proveedor))];
    return proveedores.sort();
}

function actualizarStatsEntradas() {
    const total = db.entradas ? db.entradas.length : 0;
    document.getElementById('stat-total-entradas').textContent = total;
    
    const valorTotal = db.entradas ? db.entradas.reduce((sum, e) => sum + e.importe, 0) : 0;
    document.getElementById('stat-valor-entradas').textContent = formatearMoneda(valorTotal);
    
    const items = db.entradas ? db.entradas.reduce((sum, e) => sum + e.cantidad, 0) : 0;
    document.getElementById('stat-items-entradas').textContent = items;
}

function mostrarEntradas() {
    filtrarEntradas();
}

function filtrarEntradas() {
    let entradas = db.entradas ? [...db.entradas] : [];
    
    const busqueda = document.getElementById('search-entradas')?.value.toLowerCase() || '';
    if (busqueda) {
        entradas = entradas.filter(e => 
            e.factura.toLowerCase().includes(busqueda) ||
            e.proveedor.toLowerCase().includes(busqueda) ||
            e.codigoInsumo.toLowerCase().includes(busqueda)
        );
    }
    
    const proveedorFiltro = document.getElementById('filtro-proveedor-entrada')?.value || 'todos';
    if (proveedorFiltro !== 'todos') {
        entradas = entradas.filter(e => e.proveedor === proveedorFiltro);
    }
    
    const container = document.getElementById('entradas-container');
    if (!container) return;
    
    if (entradas.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📥</div>
                <p>No hay entradas registradas</p>
                <button class="btn btn-primary" onclick="abrirModalEntrada()" style="margin-top: 1rem;">
                    ➕ Registrar Primera Entrada
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div style="background: white; border-radius: 12px; overflow-x: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <table style="width: 100%; border-collapse: collapse; min-width: 1200px;">
                <thead>
                    <tr style="background: var(--light); border-bottom: 2px solid var(--border);">
                        <th style="padding: 1rem; text-align: left;"># Factura</th>
                        <th style="padding: 1rem; text-align: left;">Fecha</th>
                        <th style="padding: 1rem; text-align: left;">Colaborador</th>
                        <th style="padding: 1rem; text-align: left;">Proveedor</th>
                        <th style="padding: 1rem; text-align: left;">Código Insumo</th>
                        <th style="padding: 1rem; text-align: left;">Descripción</th>
                        <th style="padding: 1rem; text-align: right;">Cantidad</th>
                        <th style="padding: 1rem; text-align: right;">Costo Unit.</th>
                        <th style="padding: 1rem; text-align: right;">Importe</th>
                        <th style="padding: 1rem; text-align: center;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${entradas.map(e => `
                        <tr style="border-bottom: 1px solid var(--border); transition: background 0.2s;" 
                            onmouseover="this.style.background='var(--light)'" 
                            onmouseout="this.style.background='white'">
                            <td style="padding: 1rem;">
                                <span style="font-weight: 600; font-family: monospace;">${e.factura}</span>
                            </td>
                            <td style="padding: 1rem;">${e.fecha}</td>
                            <td style="padding: 1rem;">${e.colaborador}</td>
                            <td style="padding: 1rem;">
                                <span style="background: var(--info)20; color: var(--info); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem;">
                                    ${e.proveedor}
                                </span>
                            </td>
                            <td style="padding: 1rem;">
                                <span style="font-family: monospace; font-weight: 600;">${e.codigoInsumo}</span>
                            </td>
                            <td style="padding: 1rem; font-size: 0.9rem;">${e.descripcion}</td>
                            <td style="padding: 1rem; text-align: right; font-weight: 600;">${e.cantidad}</td>
                            <td style="padding: 1rem; text-align: right;">${formatearMoneda(e.costoUnitario)}</td>
                            <td style="padding: 1rem; text-align: right; font-weight: 700; color: var(--success);">
                                ${formatearMoneda(e.importe)}
                            </td>
                            <td style="padding: 1rem; text-align: center; white-space: nowrap;">
                                <button class="btn btn-outline" onclick="editarEntrada(${e.id})" 
                                    style="padding: 0.5rem 0.75rem; font-size: 0.85rem; margin-right: 0.5rem;">✏️</button>
                                <button class="btn btn-outline" onclick="eliminarEntrada(${e.id})" 
                                    style="padding: 0.5rem 0.75rem; font-size: 0.85rem; color: #ef5350; border-color: #ef5350;">🗑️</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function abrirModalEntrada(data = null) {
    // Obtener lista de insumos para sugerencias
    const insumosExistentes = db.insumos ? db.insumos.map(i => ({
        codigo: i.codigo,
        nombre: i.nombre,
        unidad: i.unidad,
        costoUnitario: i.costoUnitario
    })) : [];
    
    abrirModal(`
        <div class="modal-header">
            <h3 class="modal-title">${data ? '✏️ Editar' : '➕ Nueva'} Entrada</h3>
            <button class="modal-close" onclick="cerrarModal()">×</button>
        </div>
        <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
            <form id="form-entrada" onsubmit="guardarEntrada(event, ${data ? data.id : 'null'})">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label"># Factura *</label>
                        <input type="text" class="form-control" name="factura" value="${data ? data.factura : ''}" 
                               placeholder="Ej: FAC-001" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Fecha *</label>
                        <input type="date" class="form-control" name="fecha" value="${data ? data.fecha : obtenerFechaHoy()}" required>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Colaborador *</label>
                        <input type="text" class="form-control" name="colaborador" value="${data ? data.colaborador : ''}" 
                               placeholder="Nombre del colaborador" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Proveedor *</label>
                        <input type="text" class="form-control" name="proveedor" value="${data ? data.proveedor : ''}" 
                               placeholder="Nombre del proveedor" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Código de Insumo *</label>
                    ${insumosExistentes.length > 0 ? `
                        <select class="form-control" id="selector-insumo-entrada" onchange="autocompletarInsumoEntrada()" style="margin-bottom: 0.5rem;">
                            <option value="">-- Seleccionar insumo existente --</option>
                            ${insumosExistentes.map(i => `<option value="${i.codigo}" data-nombre="${i.nombre}" data-costo="${i.costoUnitario}">${i.codigo} - ${i.nombre}</option>`).join('')}
                        </select>
                        <small style="color: var(--gray); font-size: 0.85rem;">O escribe un código nuevo para crear un insumo</small>
                    ` : ''}
                    <input type="text" class="form-control" name="codigoInsumo" id="input-codigo-insumo-entrada" value="${data ? data.codigoInsumo : ''}" 
                           placeholder="Código del insumo" required style="margin-top: 0.5rem;">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Descripción *</label>
                    <textarea class="form-control" name="descripcion" id="input-descripcion-entrada" rows="2" 
                              placeholder="Descripción del insumo..." required>${data && data.descripcion ? data.descripcion : ''}</textarea>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Cantidad *</label>
                        <input type="number" class="form-control" name="cantidad" value="${data ? data.cantidad : 0}" 
                               min="0" step="0.01" required onchange="calcularImporteEntrada()">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Costo Unitario *</label>
                        <input type="number" class="form-control" name="costoUnitario" id="input-costo-entrada" value="${data ? data.costoUnitario : 0}" 
                               min="0" step="0.01" required onchange="calcularImporteEntrada()">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Importe Total</label>
                    <input type="number" class="form-control" name="importe" value="${data ? data.importe : 0}" 
                           min="0" step="0.01" readonly style="background: var(--light); font-weight: 600;">
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="cerrarModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="document.getElementById('form-entrada').requestSubmit()">
                💾 ${data ? 'Actualizar' : 'Registrar'}
            </button>
        </div>
    `);
}

function autocompletarInsumoEntrada() {
    const selector = document.getElementById('selector-insumo-entrada');
    const codigo = selector.value;
    
    if (!codigo) return;
    
    const opcionSeleccionada = selector.options[selector.selectedIndex];
    const nombre = opcionSeleccionada.getAttribute('data-nombre');
    const costo = opcionSeleccionada.getAttribute('data-costo');
    
    // Autocompletar campos
    document.getElementById('input-codigo-insumo-entrada').value = codigo;
    document.getElementById('input-descripcion-entrada').value = nombre;
    document.getElementById('input-costo-entrada').value = costo;
    
    calcularImporteEntrada();
}

function calcularImporteEntrada() {
    const form = document.getElementById('form-entrada');
    if (!form) return;
    const cantidad = parseFloat(form.cantidad.value) || 0;
    const costoUnitario = parseFloat(form.costoUnitario.value) || 0;
    form.importe.value = (cantidad * costoUnitario).toFixed(2);
}

function guardarEntrada(event, id) {
    event.preventDefault();
    const form = new FormData(event.target);
    
    const entrada = {
        factura: form.get('factura'),
        fecha: form.get('fecha'),
        colaborador: form.get('colaborador'),
        proveedor: form.get('proveedor'),
        codigoInsumo: form.get('codigoInsumo'),
        descripcion: form.get('descripcion'),
        cantidad: parseFloat(form.get('cantidad')) || 0,
        costoUnitario: parseFloat(form.get('costoUnitario')) || 0,
        importe: parseFloat(form.get('importe')) || 0
    };
    
    if (!db.entradas) db.entradas = [];
    if (!db.insumos) db.insumos = [];
    
    if (id) {
        // EDITAR ENTRADA EXISTENTE
        const index = db.entradas.findIndex(e => e.id === id);
        const entradaAnterior = {...db.entradas[index]};
        
        // 1. Revertir el stock anterior
        const insumoAnterior = db.insumos.find(i => i.codigo === entradaAnterior.codigoInsumo);
        if (insumoAnterior) {
            insumoAnterior.stock = (parseFloat(insumoAnterior.stock) || 0) - (parseFloat(entradaAnterior.cantidad) || 0);
        }
        
        // 2. Actualizar la entrada
        db.entradas[index] = { ...db.entradas[index], ...entrada };
        
        // 3. Aplicar el nuevo stock
        const insumoNuevo = db.insumos.find(i => i.codigo === entrada.codigoInsumo);
        if (insumoNuevo) {
            insumoNuevo.stock = (parseFloat(insumoNuevo.stock) || 0) + entrada.cantidad;
            insumoNuevo.costoUnitario = entrada.costoUnitario;
        } else {
            // Si cambió el código y el insumo no existe, crearlo
            crearInsumoAutomaticoDesdeEntrada(entrada);
        }
        
        alert('✅ Entrada actualizada y stock ajustado correctamente');
    } else {
        // NUEVA ENTRADA
        entrada.id = nextId.entradas++;
        db.entradas.push(entrada);
        
        // Buscar el insumo
        let insumo = db.insumos.find(i => i.codigo === entrada.codigoInsumo);
        
        if (insumo) {
            // Si existe, aumentar stock y actualizar costo
            insumo.stock = (parseFloat(insumo.stock) || 0) + entrada.cantidad;
            insumo.costoUnitario = entrada.costoUnitario;
            console.log(`📥 Stock aumentado: ${insumo.nombre} → ${insumo.stock} ${insumo.unidad}`);
        } else {
            // Si no existe, crear el insumo automáticamente
            crearInsumoAutomaticoDesdeEntrada(entrada);
        }
        
        alert(`✅ Entrada registrada\n📦 Stock actualizado: ${entrada.descripcion}`);
    }
    
    // Sincronización automática con Firebase
    cerrarModal();
    renderPestanaInventario();
}

function crearInsumoAutomaticoDesdeEntrada(entrada) {
    const nuevoInsumo = {
        id: nextId.insumos++,
        codigo: entrada.codigoInsumo,
        nombre: entrada.descripcion,
        descripcion: `Creado automáticamente desde entrada ${entrada.factura}`,
        unidad: 'unidades', // Valor por defecto
        categoria: 'sin categoría',
        proveedor: entrada.proveedor,
        ubicacion: '',
        contactoProveedor: '',
        linkCompra: '',
        foto: '',
        stock: entrada.cantidad,
        stockMinimo: 5, // Valor por defecto
        costoUnitario: entrada.costoUnitario,
        fechaRegistro: obtenerFechaHoy()
    };
    
    db.insumos.push(nuevoInsumo);
    console.log(`✨ Insumo creado automáticamente: ${nuevoInsumo.nombre} con stock inicial: ${nuevoInsumo.stock}`);
}

function editarEntrada(id) {
    const entrada = db.entradas.find(e => e.id === id);
    if (entrada) abrirModalEntrada(entrada);
}

function eliminarEntrada(id) {
    const entrada = db.entradas.find(e => e.id === id);
    if (!entrada) return;
    
    if (confirm('¿Estás seguro de eliminar esta entrada?\n\n⚠️ El stock del insumo se ajustará automáticamente.')) {
        // Revertir el stock
        const insumo = db.insumos.find(i => i.codigo === entrada.codigoInsumo);
        if (insumo) {
            insumo.stock = (parseFloat(insumo.stock) || 0) - entrada.cantidad;
            console.log(`📉 Stock reducido al eliminar entrada: ${insumo.nombre} → ${insumo.stock}`);
        }
        
        const index = db.entradas.findIndex(e => e.id === id);
        db.entradas.splice(index, 1);
        // Sincronización automática con Firebase
        renderPestanaInventario();
        alert('✅ Entrada eliminada y stock ajustado');
    }
}

// ========== PESTAÑA: SALIDAS ==========
function renderSalidas(container) {
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="margin: 0; color: var(--dark);">📤 Registro de Salidas</h3>
            <button class="btn btn-primary" onclick="abrirModalSalida()">➕ Nueva Salida</button>
        </div>
        
        <!-- Filtros -->
        <div style="background: white; padding: 1rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <input type="text" id="search-salidas" placeholder="🔍 Buscar por folio o colaborador..." 
                       onkeyup="filtrarSalidas()" class="form-control" style="flex: 1; min-width: 250px;">
                
                <select id="filtro-colaborador-salida" class="form-control" onchange="filtrarSalidas()" style="max-width: 200px;">
                    <option value="todos">Todos los colaboradores</option>
                    ${obtenerColaboradoresSalidas().map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
            </div>
        </div>
        
        <!-- Estadísticas -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div class="stat-card">
                <div class="stat-icon">📤</div>
                <div class="stat-value" id="stat-total-salidas">0</div>
                <div class="stat-label">Total Salidas</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-value" id="stat-costo-salidas">$0</div>
                <div class="stat-label">Costo Total</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📦</div>
                <div class="stat-value" id="stat-items-salidas">0</div>
                <div class="stat-label">Items Utilizados</div>
            </div>
        </div>
        
        <!-- Tabla de salidas -->
        <div id="salidas-container"></div>
    `;
    
    actualizarStatsSalidas();
    mostrarSalidas();
}

function obtenerColaboradoresSalidas() {
    if (!db.salidas || db.salidas.length === 0) return [];
    const colaboradores = [...new Set(db.salidas.map(s => s.colaborador))];
    return colaboradores.sort();
}

function actualizarStatsSalidas() {
    const total = db.salidas ? db.salidas.length : 0;
    document.getElementById('stat-total-salidas').textContent = total;
    
    const costoTotal = db.salidas ? db.salidas.reduce((sum, s) => sum + s.costoTotal, 0) : 0;
    document.getElementById('stat-costo-salidas').textContent = formatearMoneda(costoTotal);
    
    const items = db.salidas ? db.salidas.reduce((sum, s) => sum + s.cantidadUtilizada, 0) : 0;
    document.getElementById('stat-items-salidas').textContent = items;
}

function mostrarSalidas() {
    filtrarSalidas();
}

function filtrarSalidas() {
    let salidas = db.salidas ? [...db.salidas] : [];
    
    const busqueda = document.getElementById('search-salidas')?.value.toLowerCase() || '';
    if (busqueda) {
        salidas = salidas.filter(s => 
            s.folioRemision.toLowerCase().includes(busqueda) ||
            s.colaborador.toLowerCase().includes(busqueda) ||
            s.codigoProducto.toLowerCase().includes(busqueda)
        );
    }
    
    const colaboradorFiltro = document.getElementById('filtro-colaborador-salida')?.value || 'todos';
    if (colaboradorFiltro !== 'todos') {
        salidas = salidas.filter(s => s.colaborador === colaboradorFiltro);
    }
    
    const container = document.getElementById('salidas-container');
    if (!container) return;
    
    if (salidas.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📤</div>
                <p>No hay salidas registradas</p>
                <button class="btn btn-primary" onclick="abrirModalSalida()" style="margin-top: 1rem;">
                    ➕ Registrar Primera Salida
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div style="background: white; border-radius: 12px; overflow-x: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <table style="width: 100%; border-collapse: collapse; min-width: 1400px;">
                <thead>
                    <tr style="background: var(--light); border-bottom: 2px solid var(--border);">
                        <th style="padding: 1rem; text-align: left;">Folio Remisión</th>
                        <th style="padding: 1rem; text-align: left;">Fecha</th>
                        <th style="padding: 1rem; text-align: left;">Código Producto</th>
                        <th style="padding: 1rem; text-align: left;">Colaborador</th>
                        <th style="padding: 1rem; text-align: left;">Descripción</th>
                        <th style="padding: 1rem; text-align: left;">Código Insumo</th>
                        <th style="padding: 1rem; text-align: right;">Cantidad</th>
                        <th style="padding: 1rem; text-align: right;">Costo Unit.</th>
                        <th style="padding: 1rem; text-align: right;">Costo Total</th>
                        <th style="padding: 1rem; text-align: center;">Estado</th>
                        <th style="padding: 1rem; text-align: center;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${salidas.map(s => {
                        // Determinar estado de la salida
                        const estado = s.estado || 'definitivo'; // definitivo, pendiente, retornado, parcial
                        const cantidadRetornada = s.cantidadRetornada || 0;
                        const cantidadPendiente = s.cantidadUtilizada - cantidadRetornada;
                        
                        // Colores y etiquetas por estado
                        const estadoConfig = {
                            'definitivo': { color: '#757575', texto: 'Definitivo', icon: '✓' },
                            'pendiente': { color: '#ff9800', texto: 'Pendiente', icon: '⏳' },
                            'retornado': { color: '#4caf50', texto: 'Retornado', icon: '↩️' },
                            'parcial': { color: '#2196f3', texto: 'Parcial', icon: '⚡' }
                        };
                        
                        const config = estadoConfig[estado];
                        
                        return `
                        <tr style="border-bottom: 1px solid var(--border); transition: background 0.2s;" 
                            onmouseover="this.style.background='var(--light)'" 
                            onmouseout="this.style.background='white'">
                            <td style="padding: 1rem;">
                                <span style="font-weight: 600; font-family: monospace;">${s.folioRemision}</span>
                            </td>
                            <td style="padding: 1rem;">${s.fecha}</td>
                            <td style="padding: 1rem;">
                                <span style="font-family: monospace; font-weight: 600;">${s.codigoProducto}</span>
                            </td>
                            <td style="padding: 1rem;">
                                <span style="background: var(--primary)20; color: var(--primary); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem;">
                                    ${s.colaborador}
                                </span>
                            </td>
                            <td style="padding: 1rem; font-size: 0.9rem;">${s.descripcion}</td>
                            <td style="padding: 1rem;">
                                <span style="font-family: monospace; font-weight: 600;">${s.codigoInsumo}</span>
                            </td>
                            <td style="padding: 1rem; text-align: right; font-weight: 600;">
                                ${s.cantidadUtilizada}
                                ${cantidadRetornada > 0 ? `<div style="font-size: 0.75rem; color: var(--success);">↩️ ${cantidadRetornada} retornados</div>` : ''}
                            </td>
                            <td style="padding: 1rem; text-align: right;">${formatearMoneda(s.costoUnitario)}</td>
                            <td style="padding: 1rem; text-align: right; font-weight: 700; color: #ef5350;">
                                ${formatearMoneda(s.costoTotal)}
                            </td>
                            <td style="padding: 1rem; text-align: center;">
                                <span style="background: ${config.color}20; color: ${config.color}; padding: 0.35rem 0.75rem; border-radius: 12px; font-size: 0.85rem; font-weight: 600; display: inline-block;">
                                    ${config.icon} ${config.texto}
                                </span>
                                ${estado === 'parcial' ? `<div style="font-size: 0.7rem; color: var(--gray); margin-top: 0.25rem;">Pendiente: ${cantidadPendiente}</div>` : ''}
                            </td>
                            <td style="padding: 1rem; text-align: center;">
                                <div style="display: flex; gap: 0.25rem; justify-content: center; flex-wrap: wrap;">
                                    ${estado !== 'retornado' ? `
                                        <button class="btn btn-outline" onclick="marcarComoPendiente(${s.id})" 
                                            title="Marcar como pendiente de retorno"
                                            style="padding: 0.4rem 0.6rem; font-size: 0.8rem; background: #ff980020; color: #ff9800; border-color: #ff9800;">
                                            ⏳
                                        </button>
                                        <button class="btn btn-outline" onclick="registrarRetorno(${s.id})" 
                                            title="Registrar retorno"
                                            style="padding: 0.4rem 0.6rem; font-size: 0.8rem; background: #4caf5020; color: #4caf50; border-color: #4caf50;">
                                            ↩️
                                        </button>
                                    ` : ''}
                                    <button class="btn btn-outline" onclick="editarSalida(${s.id})" 
                                        style="padding: 0.4rem 0.6rem; font-size: 0.8rem;">✏️</button>
                                    <button class="btn btn-outline" onclick="eliminarSalida(${s.id})" 
                                        style="padding: 0.4rem 0.6rem; font-size: 0.8rem; color: #ef5350; border-color: #ef5350;">🗑️</button>
                                </div>
                            </td>
                        </tr>
                    `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function abrirModalSalida(data = null) {
    // Obtener lista de insumos con stock disponible
    const insumosDisponibles = db.insumos ? db.insumos.filter(i => i.stock > 0).map(i => ({
        codigo: i.codigo,
        nombre: i.nombre,
        stock: i.stock,
        unidad: i.unidad,
        costoUnitario: i.costoUnitario
    })) : [];
    
    abrirModal(`
        <div class="modal-header">
            <h3 class="modal-title">${data ? '✏️ Editar' : '➕ Nueva'} Salida</h3>
            <button class="modal-close" onclick="cerrarModal()">×</button>
        </div>
        <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
            <form id="form-salida" onsubmit="guardarSalida(event, ${data ? data.id : 'null'})">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Folio Remisión *</label>
                        <input type="text" class="form-control" name="folioRemision" value="${data ? data.folioRemision : ''}" 
                               placeholder="Ej: REM-001" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Fecha *</label>
                        <input type="date" class="form-control" name="fecha" value="${data ? data.fecha : obtenerFechaHoy()}" required>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Código Producto *</label>
                        <input type="text" class="form-control" name="codigoProducto" value="${data ? data.codigoProducto : ''}" 
                               placeholder="Código del producto" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Colaborador *</label>
                        <input type="text" class="form-control" name="colaborador" value="${data ? data.colaborador : ''}" 
                               placeholder="Nombre del colaborador" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Descripción *</label>
                    <textarea class="form-control" name="descripcion" id="input-descripcion-salida" rows="2" 
                              placeholder="Descripción de la salida..." required>${data && data.descripcion ? data.descripcion : ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Código de Insumo * <span id="stock-disponible-salida" style="color: var(--success); font-weight: 600;"></span></label>
                    ${insumosDisponibles.length > 0 ? `
                        <select class="form-control" id="selector-insumo-salida" onchange="autocompletarInsumoSalida()" style="margin-bottom: 0.5rem;">
                            <option value="">-- Seleccionar insumo a utilizar --</option>
                            ${insumosDisponibles.map(i => `<option value="${i.codigo}" data-nombre="${i.nombre}" data-costo="${i.costoUnitario}" data-stock="${i.stock}" data-unidad="${i.unidad}">${i.codigo} - ${i.nombre} (Stock: ${i.stock} ${i.unidad})</option>`).join('')}
                        </select>
                        <small style="color: var(--gray); font-size: 0.85rem;">Selecciona el insumo que vas a utilizar</small>
                    ` : '<p style="color: #ef5350; font-size: 0.9rem;">⚠️ No hay insumos con stock disponible. Primero registra una ENTRADA.</p>'}
                    <input type="text" class="form-control" name="codigoInsumo" id="input-codigo-insumo-salida" value="${data ? data.codigoInsumo : ''}" 
                           placeholder="Código del insumo utilizado" required style="margin-top: 0.5rem;">
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Cantidad Utilizada *</label>
                        <input type="number" class="form-control" name="cantidadUtilizada" id="input-cantidad-salida" value="${data ? data.cantidadUtilizada : 0}" 
                               min="0" step="0.01" required onchange="calcularCostoTotalSalida()">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Costo Unitario *</label>
                        <input type="number" class="form-control" name="costoUnitario" id="input-costo-salida" value="${data ? data.costoUnitario : 0}" 
                               min="0" step="0.01" required onchange="calcularCostoTotalSalida()">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Costo Total</label>
                    <input type="number" class="form-control" name="costoTotal" value="${data ? data.costoTotal : 0}" 
                           min="0" step="0.01" readonly style="background: var(--light); font-weight: 600;">
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="cerrarModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="document.getElementById('form-salida').requestSubmit()">
                💾 ${data ? 'Actualizar' : 'Registrar'}
            </button>
        </div>
    `);
}

function autocompletarInsumoSalida() {
    const selector = document.getElementById('selector-insumo-salida');
    const codigo = selector.value;
    
    if (!codigo) {
        document.getElementById('stock-disponible-salida').textContent = '';
        return;
    }
    
    const opcionSeleccionada = selector.options[selector.selectedIndex];
    const nombre = opcionSeleccionada.getAttribute('data-nombre');
    const costo = opcionSeleccionada.getAttribute('data-costo');
    const stock = opcionSeleccionada.getAttribute('data-stock');
    const unidad = opcionSeleccionada.getAttribute('data-unidad');
    
    // Autocompletar campos
    document.getElementById('input-codigo-insumo-salida').value = codigo;
    document.getElementById('input-descripcion-salida').value = nombre;
    document.getElementById('input-costo-salida').value = costo;
    
    // Mostrar stock disponible
    document.getElementById('stock-disponible-salida').textContent = `(Stock disponible: ${stock} ${unidad})`;
    
    // Establecer máximo en cantidad
    document.getElementById('input-cantidad-salida').setAttribute('max', stock);
    
    calcularCostoTotalSalida();
}

function calcularCostoTotalSalida() {
    const form = document.getElementById('form-salida');
    if (!form) return;
    const cantidad = parseFloat(form.cantidadUtilizada.value) || 0;
    const costoUnitario = parseFloat(form.costoUnitario.value) || 0;
    form.costoTotal.value = (cantidad * costoUnitario).toFixed(2);
}

function guardarSalida(event, id) {
    event.preventDefault();
    const form = new FormData(event.target);
    
    const salida = {
        folioRemision: form.get('folioRemision'),
        fecha: form.get('fecha'),
        codigoProducto: form.get('codigoProducto'),
        colaborador: form.get('colaborador'),
        descripcion: form.get('descripcion'),
        codigoInsumo: form.get('codigoInsumo'),
        cantidadUtilizada: parseFloat(form.get('cantidadUtilizada')) || 0,
        costoUnitario: parseFloat(form.get('costoUnitario')) || 0,
        costoTotal: parseFloat(form.get('costoTotal')) || 0
    };
    
    if (!db.salidas) db.salidas = [];
    if (!db.insumos) db.insumos = [];
    
    if (id) {
        const index = db.salidas.findIndex(s => s.id === id);
        const salidaAnterior = db.salidas[index];
        
        // Revertir el stock anterior
        const insumoAnterior = db.insumos.find(i => i.codigo === salidaAnterior.codigoInsumo);
        if (insumoAnterior) {
            insumoAnterior.stock += salidaAnterior.cantidadUtilizada;
        }
        
        db.salidas[index] = { ...db.salidas[index], ...salida };
        
        // Aplicar nueva salida
        const insumoNuevo = db.insumos.find(i => i.codigo === salida.codigoInsumo);
        if (insumoNuevo) {
            insumoNuevo.stock -= salida.cantidadUtilizada;
            
            // Advertencia si el stock queda negativo
            if (insumoNuevo.stock < 0) {
                alert(`⚠️ ADVERTENCIA: El stock de "${insumoNuevo.nombre}" quedó NEGATIVO: ${insumoNuevo.stock}\n\nVerifica que la cantidad sea correcta.`);
            }
        }
        
        alert('✅ Salida actualizada correctamente');
    } else {
        // Buscar el insumo
        const insumo = db.insumos.find(i => i.codigo === salida.codigoInsumo);
        
        if (!insumo) {
            const continuar = confirm(`⚠️ ADVERTENCIA: No existe un insumo con el código "${salida.codigoInsumo}"\n\n¿Deseas registrar la salida de todas formas?\n\nRecomendación: Primero registra una ENTRADA para crear el insumo.`);
            
            if (!continuar) {
                return; // Cancelar la operación
            }
        } else {
            // Validar que hay suficiente stock
            const stockResultante = (parseFloat(insumo.stock) || 0) - salida.cantidadUtilizada;
            
            if (stockResultante < 0) {
                const continuar = confirm(`⚠️ ADVERTENCIA: Stock insuficiente\n\nInsumo: ${insumo.nombre}\nStock actual: ${insumo.stock}\nCantidad a sacar: ${salida.cantidadUtilizada}\nStock resultante: ${stockResultante}\n\n¿Deseas continuar de todas formas?`);
                
                if (!continuar) {
                    return; // Cancelar la operación
                }
            }
            
            // Descontar del stock
            insumo.stock = stockResultante;
            
            console.log(`📤 Stock descontado: ${insumo.nombre} ahora tiene ${insumo.stock} ${insumo.unidad}`);
        }
        
        salida.id = nextId.salidas++;
        db.salidas.push(salida);
        
        alert(`✅ Salida registrada correctamente\n📦 ${insumo ? `Stock actualizado: ${insumo.nombre} (${insumo.stock} ${insumo.unidad})` : 'Insumo no encontrado'}`);
    }
    
    // Sincronización automática con Firebase
    cerrarModal();
    renderPestanaInventario();
}

function editarSalida(id) {
    const salida = db.salidas.find(s => s.id === id);
    if (salida) abrirModalSalida(salida);
}

function eliminarSalida(id) {
    const salida = db.salidas.find(s => s.id === id);
    if (!salida) return;
    
    if (confirm('¿Estás seguro de eliminar esta salida?\n\n⚠️ El stock del insumo se ajustará automáticamente.')) {
        // Revertir el stock (devolver la cantidad al insumo)
        const insumo = db.insumos.find(i => i.codigo === salida.codigoInsumo);
        if (insumo) {
            insumo.stock = (parseFloat(insumo.stock) || 0) + salida.cantidadUtilizada;
            console.log(`📈 Stock devuelto al eliminar salida: ${insumo.nombre} → ${insumo.stock}`);
        }
        
        const index = db.salidas.findIndex(s => s.id === id);
        db.salidas.splice(index, 1);
        // Sincronización automática con Firebase
        renderPestanaInventario();
        alert('✅ Salida eliminada y stock ajustado');
    }
}

// ========== FUNCIONES DE RETORNOS Y PENDIENTES ==========

function marcarComoPendiente(idSalida) {
    const salida = db.salidas.find(s => s.id === idSalida);
    if (!salida) return;
    
    const insumo = db.insumos.find(i => i.codigo === salida.codigoInsumo);
    
    if (confirm(`⏳ Marcar como PENDIENTE de retorno\n\nInsumo: ${salida.descripcion}\nCantidad: ${salida.cantidadUtilizada}\n\n¿Confirmar?`)) {
        salida.estado = 'pendiente';
        // Sincronización automática con Firebase
        renderPestanaInventario();
        alert('✅ Marcado como pendiente de retorno');
    }
}

function registrarRetorno(idSalida) {
    const salida = db.salidas.find(s => s.id === idSalida);
    if (!salida) return;
    
    const cantidadYaRetornada = salida.cantidadRetornada || 0;
    const cantidadDisponibleRetorno = salida.cantidadUtilizada - cantidadYaRetornada;
    
    if (cantidadDisponibleRetorno <= 0) {
        alert('⚠️ Esta salida ya fue retornada completamente');
        return;
    }
    
    // Preguntar cuánto va a retornar
    const cantidadStr = prompt(
        `↩️ REGISTRAR RETORNO\n\n` +
        `Insumo: ${salida.descripcion}\n` +
        `Cantidad original: ${salida.cantidadUtilizada}\n` +
        `Ya retornado: ${cantidadYaRetornada}\n` +
        `Disponible para retornar: ${cantidadDisponibleRetorno}\n\n` +
        `¿Cuánto vas a retornar?`,
        cantidadDisponibleRetorno
    );
    
    if (cantidadStr === null) return; // Cancelado
    
    const cantidadRetorno = parseFloat(cantidadStr);
    
    // Validaciones
    if (isNaN(cantidadRetorno) || cantidadRetorno <= 0) {
        alert('❌ Cantidad inválida');
        return;
    }
    
    if (cantidadRetorno > cantidadDisponibleRetorno) {
        alert(`❌ No puedes retornar más de ${cantidadDisponibleRetorno} unidades`);
        return;
    }
    
    // Actualizar la salida
    salida.cantidadRetornada = cantidadYaRetornada + cantidadRetorno;
    
    // Determinar nuevo estado
    if (salida.cantidadRetornada >= salida.cantidadUtilizada) {
        salida.estado = 'retornado';
    } else if (salida.cantidadRetornada > 0) {
        salida.estado = 'parcial';
    }
    
    // Devolver al stock del insumo
    const insumo = db.insumos.find(i => i.codigo === salida.codigoInsumo);
    if (insumo) {
        insumo.stock = (parseFloat(insumo.stock) || 0) + cantidadRetorno;
        console.log(`↩️ Retorno registrado: ${insumo.nombre} → Stock: ${insumo.stock}`);
    }
    
    // Sincronización automática con Firebase
    renderPestanaInventario();
    
    alert(
        `✅ Retorno registrado\n\n` +
        `Cantidad retornada: ${cantidadRetorno}\n` +
        `Total retornado: ${salida.cantidadRetornada} de ${salida.cantidadUtilizada}\n` +
        `${insumo ? `Stock actual: ${insumo.stock} ${insumo.unidad}` : ''}`
    );
}

// ========== PESTAÑA: PRODUCTOS ==========
function renderProductosInventario(container) {
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="margin: 0; color: var(--dark);">🎁 Catálogo de Productos</h3>
            <button class="btn btn-primary" onclick="abrirModalProductoInventario()">➕ Nuevo Producto</button>
        </div>
        
        <!-- Filtros -->
        <div style="background: white; padding: 1rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <input type="text" id="search-productos-inv" placeholder="🔍 Buscar producto..." 
                       onkeyup="filtrarProductosInventario()" class="form-control" style="flex: 1; min-width: 250px;">
                
                <select id="filtro-categoria-producto-inv" class="form-control" onchange="filtrarProductosInventario()" style="max-width: 200px;">
                    <option value="todos">Todas las categorías</option>
                    ${obtenerCategoriasProductosInventario().map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
            </div>
        </div>
        
        <!-- Estadísticas -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div class="stat-card">
                <div class="stat-icon">🎁</div>
                <div class="stat-value" id="stat-total-productos-inv">0</div>
                <div class="stat-label">Total Productos</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📋</div>
                <div class="stat-value" id="stat-categorias-productos">0</div>
                <div class="stat-label">Categorías</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🏭</div>
                <div class="stat-value" id="stat-proveedores-productos">0</div>
                <div class="stat-label">Proveedores</div>
            </div>
        </div>
        
        <!-- Tabla de productos -->
        <div id="productos-inventario-container"></div>
    `;
    
    actualizarStatsProductosInventario();
    mostrarProductosInventario();
}

function obtenerCategoriasProductosInventario() {
    if (!db.productosInventario || db.productosInventario.length === 0) return [];
    const categorias = [...new Set(db.productosInventario.map(p => p.categoria))];
    return categorias.sort();
}

function actualizarStatsProductosInventario() {
    const total = db.productosInventario ? db.productosInventario.length : 0;
    document.getElementById('stat-total-productos-inv').textContent = total;
    
    const categorias = obtenerCategoriasProductosInventario().length;
    document.getElementById('stat-categorias-productos').textContent = categorias;
    
    const proveedores = db.productosInventario ? [...new Set(db.productosInventario.map(p => p.proveedor).filter(Boolean))].length : 0;
    document.getElementById('stat-proveedores-productos').textContent = proveedores;
}

function mostrarProductosInventario() {
    filtrarProductosInventario();
}

function filtrarProductosInventario() {
    let productos = db.productosInventario ? [...db.productosInventario] : [];
    
    const busqueda = document.getElementById('search-productos-inv')?.value.toLowerCase() || '';
    if (busqueda) {
        productos = productos.filter(p => 
            p.nombre.toLowerCase().includes(busqueda) ||
            p.codigo.toLowerCase().includes(busqueda) ||
            p.categoria.toLowerCase().includes(busqueda)
        );
    }
    
    const categoriaFiltro = document.getElementById('filtro-categoria-producto-inv')?.value || 'todos';
    if (categoriaFiltro !== 'todos') {
        productos = productos.filter(p => p.categoria === categoriaFiltro);
    }
    
    const container = document.getElementById('productos-inventario-container');
    if (!container) return;
    
    if (productos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎁</div>
                <p>No hay productos registrados</p>
                <button class="btn btn-primary" onclick="abrirModalProductoInventario()" style="margin-top: 1rem;">
                    ➕ Agregar Primer Producto
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div style="background: white; border-radius: 12px; overflow-x: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <table style="width: 100%; border-collapse: collapse; min-width: 1200px;">
                <thead>
                    <tr style="background: var(--light); border-bottom: 2px solid var(--border);">
                        <th style="padding: 1rem; text-align: left;">Código</th>
                        <th style="padding: 1rem; text-align: left;">Nombre</th>
                        <th style="padding: 1rem; text-align: left;">Descripción</th>
                        <th style="padding: 1rem; text-align: center;">Unidad</th>
                        <th style="padding: 1rem; text-align: left;">Categoría</th>
                        <th style="padding: 1rem; text-align: left;">Proveedor</th>
                        <th style="padding: 1rem; text-align: left;">Ubicación</th>
                        <th style="padding: 1rem; text-align: center;">Foto</th>
                        <th style="padding: 1rem; text-align: center;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${productos.map(p => `
                        <tr style="border-bottom: 1px solid var(--border); transition: background 0.2s;" 
                            onmouseover="this.style.background='var(--light)'" 
                            onmouseout="this.style.background='white'">
                            <td style="padding: 1rem;">
                                <span style="font-weight: 600; font-family: monospace; background: var(--light); padding: 0.25rem 0.5rem; border-radius: 6px;">
                                    ${p.codigo}
                                </span>
                            </td>
                            <td style="padding: 1rem;">
                                <div style="font-weight: 600;">${p.nombre}</div>
                            </td>
                            <td style="padding: 1rem;">
                                <div style="font-size: 0.9rem; color: var(--gray); max-width: 200px; overflow: hidden; text-overflow: ellipsis;">
                                    ${p.descripcion || '-'}
                                </div>
                            </td>
                            <td style="padding: 1rem; text-align: center; font-weight: 500;">
                                ${p.unidad}
                            </td>
                            <td style="padding: 1rem;">
                                <span style="background: var(--success)20; color: var(--success); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; font-weight: 500;">
                                    ${p.categoria}
                                </span>
                            </td>
                            <td style="padding: 1rem; font-size: 0.9rem;">
                                ${p.proveedor || '-'}
                            </td>
                            <td style="padding: 1rem; font-size: 0.9rem;">
                                ${p.ubicacion || '-'}
                            </td>
                            <td style="padding: 1rem; text-align: center;">
                                ${p.foto ? `<img src="${p.foto}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px; cursor: pointer;" onclick="verImagenGrande('${p.foto}', '${p.nombre}')">` : '<span style="color: var(--gray);">-</span>'}
                            </td>
                            <td style="padding: 1rem; text-align: center; white-space: nowrap;">
                                <button class="btn btn-outline" onclick="editarProductoInventario(${p.id})" 
                                    style="padding: 0.5rem 0.75rem; font-size: 0.85rem; margin-right: 0.5rem;">✏️</button>
                                <button class="btn btn-outline" onclick="eliminarProductoInventario(${p.id})" 
                                    style="padding: 0.5rem 0.75rem; font-size: 0.85rem; color: #ef5350; border-color: #ef5350;">🗑️</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function abrirModalProductoInventario(data = null) {
    abrirModal(`
        <div class="modal-header">
            <h3 class="modal-title">${data ? '✏️ Editar' : '➕ Nuevo'} Producto</h3>
            <button class="modal-close" onclick="cerrarModal()">×</button>
        </div>
        <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
            <form id="form-producto-inv" onsubmit="guardarProductoInventario(event, ${data ? data.id : 'null'})">
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Código *</label>
                        <input type="text" class="form-control" name="codigo" value="${data ? data.codigo : ''}" 
                               placeholder="Ej: PROD-001" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Nombre *</label>
                        <input type="text" class="form-control" name="nombre" value="${data ? data.nombre : ''}" 
                               placeholder="Nombre del producto" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-control" name="descripcion" rows="2" 
                              placeholder="Descripción del producto...">${data && data.descripcion ? data.descripcion : ''}</textarea>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Unidad de Medida *</label>
                        <input type="text" class="form-control" name="unidad" value="${data ? data.unidad : ''}" 
                               placeholder="Ej: pieza, kit, caja" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Categoría *</label>
                        <input type="text" class="form-control" name="categoria" value="${data ? data.categoria : ''}" 
                               placeholder="Categoría del producto" required>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Proveedor</label>
                        <input type="text" class="form-control" name="proveedor" value="${data && data.proveedor ? data.proveedor : ''}" 
                               placeholder="Nombre del proveedor">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Ubicación</label>
                        <input type="text" class="form-control" name="ubicacion" value="${data && data.ubicacion ? data.ubicacion : ''}" 
                               placeholder="Ubicación física">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Fotografía del Producto</label>
                    <input type="text" class="form-control" name="foto" value="${data && data.foto ? data.foto : ''}" 
                           placeholder="URL de la imagen">
                    <small style="color: var(--gray); font-size: 0.85rem;">Ingresa una URL de imagen</small>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="cerrarModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="document.getElementById('form-producto-inv').requestSubmit()">
                💾 ${data ? 'Actualizar' : 'Crear'}
            </button>
        </div>
    `);
}

function guardarProductoInventario(event, id) {
    event.preventDefault();
    const form = new FormData(event.target);
    
    const producto = {
        codigo: form.get('codigo'),
        nombre: form.get('nombre'),
        descripcion: form.get('descripcion'),
        unidad: form.get('unidad'),
        categoria: form.get('categoria'),
        proveedor: form.get('proveedor'),
        ubicacion: form.get('ubicacion'),
        foto: form.get('foto'),
        fechaRegistro: obtenerFechaHoy()
    };
    
    if (!db.productosInventario) db.productosInventario = [];
    
    if (id) {
        const index = db.productosInventario.findIndex(p => p.id === id);
        db.productosInventario[index] = { ...db.productosInventario[index], ...producto };
        alert('✅ Producto actualizado correctamente');
    } else {
        producto.id = nextId.productosInventario++;
        db.productosInventario.push(producto);
        alert('✅ Producto creado correctamente');
    }
    
    // Sincronización automática con Firebase
    cerrarModal();
    renderPestanaInventario();
}

function editarProductoInventario(id) {
    const producto = db.productosInventario.find(p => p.id === id);
    if (producto) abrirModalProductoInventario(producto);
}

function eliminarProductoInventario(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        const index = db.productosInventario.findIndex(p => p.id === id);
        db.productosInventario.splice(index, 1);
        // Sincronización automática con Firebase
        renderPestanaInventario();
        alert('✅ Producto eliminado');
    }
}

// ========== PESTAÑA: VENTAS ==========
function renderVentas(container) {
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="margin: 0; color: var(--dark);">💰 Registro de Ventas</h3>
            <button class="btn btn-primary" onclick="abrirModalVenta()">➕ Nueva Venta</button>
        </div>
        
        <!-- Filtros -->
        <div style="background: white; padding: 1rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <input type="text" id="search-ventas" placeholder="🔍 Buscar por folio o cliente..." 
                       onkeyup="filtrarVentas()" class="form-control" style="flex: 1; min-width: 250px;">
                
                <select id="filtro-vendedor" class="form-control" onchange="filtrarVentas()" style="max-width: 200px;">
                    <option value="todos">Todos los vendedores</option>
                    ${obtenerVendedores().map(v => `<option value="${v}">${v}</option>`).join('')}
                </select>
            </div>
        </div>
        
        <!-- Estadísticas -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-value" id="stat-total-ventas">0</div>
                <div class="stat-label">Total Ventas</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📈</div>
                <div class="stat-value" id="stat-ingresos-ventas">$0</div>
                <div class="stat-label">Ingresos</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">💵</div>
                <div class="stat-value" id="stat-utilidad-ventas">$0</div>
                <div class="stat-label">Utilidad Bruta</div>
            </div>
        </div>
        
        <!-- Tabla de ventas -->
        <div id="ventas-container"></div>
    `;
    
    actualizarStatsVentas();
    mostrarVentas();
}

function obtenerVendedores() {
    if (!db.ventas || db.ventas.length === 0) return [];
    const vendedores = [...new Set(db.ventas.map(v => v.vendedor))];
    return vendedores.sort();
}

function actualizarStatsVentas() {
    const total = db.ventas ? db.ventas.length : 0;
    document.getElementById('stat-total-ventas').textContent = total;
    
    const ingresos = db.ventas ? db.ventas.reduce((sum, v) => sum + v.precioVenta, 0) : 0;
    document.getElementById('stat-ingresos-ventas').textContent = formatearMoneda(ingresos);
    
    const utilidad = db.ventas ? db.ventas.reduce((sum, v) => sum + v.utilidadBruta, 0) : 0;
    document.getElementById('stat-utilidad-ventas').textContent = formatearMoneda(utilidad);
}

function mostrarVentas() {
    filtrarVentas();
}

function filtrarVentas() {
    let ventas = db.ventas ? [...db.ventas] : [];
    
    const busqueda = document.getElementById('search-ventas')?.value.toLowerCase() || '';
    if (busqueda) {
        ventas = ventas.filter(v => 
            v.folioRemision.toLowerCase().includes(busqueda) ||
            v.cliente.toLowerCase().includes(busqueda) ||
            v.codigoProducto.toLowerCase().includes(busqueda)
        );
    }
    
    const vendedorFiltro = document.getElementById('filtro-vendedor')?.value || 'todos';
    if (vendedorFiltro !== 'todos') {
        ventas = ventas.filter(v => v.vendedor === vendedorFiltro);
    }
    
    const container = document.getElementById('ventas-container');
    if (!container) return;
    
    if (ventas.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💰</div>
                <p>No hay ventas registradas</p>
                <button class="btn btn-primary" onclick="abrirModalVenta()" style="margin-top: 1rem;">
                    ➕ Registrar Primera Venta
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div style="background: white; border-radius: 12px; overflow-x: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <table style="width: 100%; border-collapse: collapse; min-width: 1600px;">
                <thead>
                    <tr style="background: var(--light); border-bottom: 2px solid var(--border);">
                        <th style="padding: 1rem; text-align: left;">Folio</th>
                        <th style="padding: 1rem; text-align: left;">F. Pedido</th>
                        <th style="padding: 1rem; text-align: left;">F. Entrega</th>
                        <th style="padding: 1rem; text-align: left;">Vendedor</th>
                        <th style="padding: 1rem; text-align: left;">Medio</th>
                        <th style="padding: 1rem; text-align: left;">Cliente</th>
                        <th style="padding: 1rem; text-align: left;">Código</th>
                        <th style="padding: 1rem; text-align: left;">Descripción</th>
                        <th style="padding: 1rem; text-align: right;">Cant.</th>
                        <th style="padding: 1rem; text-align: right;">Costo</th>
                        <th style="padding: 1rem; text-align: right;">Precio</th>
                        <th style="padding: 1rem; text-align: right;">Utilidad</th>
                        <th style="padding: 1rem; text-align: center;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${ventas.map(v => {
                        const margen = v.precioVenta > 0 ? ((v.utilidadBruta / v.precioVenta) * 100).toFixed(1) : 0;
                        return `
                            <tr style="border-bottom: 1px solid var(--border); transition: background 0.2s;" 
                                onmouseover="this.style.background='var(--light)'" 
                                onmouseout="this.style.background='white'">
                                <td style="padding: 1rem;">
                                    <span style="font-weight: 600; font-family: monospace;">${v.folioRemision}</span>
                                </td>
                                <td style="padding: 1rem; font-size: 0.9rem;">${v.fechaPedido}</td>
                                <td style="padding: 1rem; font-size: 0.9rem;">${v.fechaEntrega}</td>
                                <td style="padding: 1rem;">
                                    <span style="background: var(--primary)20; color: var(--primary); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem;">
                                        ${v.vendedor}
                                    </span>
                                </td>
                                <td style="padding: 1rem; font-size: 0.85rem;">${v.medioContacto}</td>
                                <td style="padding: 1rem; font-weight: 500;">${v.cliente}</td>
                                <td style="padding: 1rem;">
                                    <span style="font-family: monospace; font-weight: 600;">${v.codigoProducto}</span>
                                </td>
                                <td style="padding: 1rem; font-size: 0.9rem;">${v.descripcion}</td>
                                <td style="padding: 1rem; text-align: right; font-weight: 600;">${v.cantidad}</td>
                                <td style="padding: 1rem; text-align: right;">${formatearMoneda(v.costoProduccion)}</td>
                                <td style="padding: 1rem; text-align: right; font-weight: 600; color: var(--success);">
                                    ${formatearMoneda(v.precioVenta)}
                                </td>
                                <td style="padding: 1rem; text-align: right;">
                                    <div style="font-weight: 700; color: var(--primary);">${formatearMoneda(v.utilidadBruta)}</div>
                                    <div style="font-size: 0.75rem; color: var(--gray);">${margen}%</div>
                                </td>
                                <td style="padding: 1rem; text-align: center; white-space: nowrap;">
                                    <button class="btn btn-outline" onclick="editarVenta(${v.id})" 
                                        style="padding: 0.5rem 0.75rem; font-size: 0.85rem; margin-right: 0.5rem;">✏️</button>
                                    <button class="btn btn-outline" onclick="eliminarVenta(${v.id})" 
                                        style="padding: 0.5rem 0.75rem; font-size: 0.85rem; color: #ef5350; border-color: #ef5350;">🗑️</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function abrirModalVenta(data = null) {
    abrirModal(`
        <div class="modal-header">
            <h3 class="modal-title">${data ? '✏️ Editar' : '➕ Nueva'} Venta</h3>
            <button class="modal-close" onclick="cerrarModal()">×</button>
        </div>
        <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
            <form id="form-venta" onsubmit="guardarVenta(event, ${data ? data.id : 'null'})">
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Folio Remisión *</label>
                        <input type="text" class="form-control" name="folioRemision" value="${data ? data.folioRemision : ''}" 
                               placeholder="Ej: VEN-001" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Fecha Pedido *</label>
                        <input type="date" class="form-control" name="fechaPedido" value="${data ? data.fechaPedido : obtenerFechaHoy()}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Fecha Entrega *</label>
                        <input type="date" class="form-control" name="fechaEntrega" value="${data ? data.fechaEntrega : obtenerFechaHoy()}" required>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Vendedor *</label>
                        <input type="text" class="form-control" name="vendedor" value="${data ? data.vendedor : ''}" 
                               placeholder="Nombre del vendedor" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Medio de Contacto *</label>
                        <input type="text" class="form-control" name="medioContacto" value="${data ? data.medioContacto : ''}" 
                               placeholder="Ej: WhatsApp, Teléfono, Email" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Cliente *</label>
                    <input type="text" class="form-control" name="cliente" value="${data ? data.cliente : ''}" 
                           placeholder="Nombre del cliente" required>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Código Producto *</label>
                        <input type="text" class="form-control" name="codigoProducto" value="${data ? data.codigoProducto : ''}" 
                               placeholder="Código" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Descripción *</label>
                        <input type="text" class="form-control" name="descripcion" value="${data ? data.descripcion : ''}" 
                               placeholder="Descripción del producto" required>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Cantidad *</label>
                        <input type="number" class="form-control" name="cantidad" value="${data ? data.cantidad : 0}" 
                               min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Costo Producción *</label>
                        <input type="number" class="form-control" name="costoProduccion" value="${data ? data.costoProduccion : 0}" 
                               min="0" step="0.01" required onchange="calcularUtilidadVenta()">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Precio Venta *</label>
                        <input type="number" class="form-control" name="precioVenta" value="${data ? data.precioVenta : 0}" 
                               min="0" step="0.01" required onchange="calcularUtilidadVenta()">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Utilidad Bruta</label>
                    <input type="number" class="form-control" name="utilidadBruta" value="${data ? data.utilidadBruta : 0}" 
                           min="0" step="0.01" readonly style="background: var(--light); font-weight: 600; color: var(--success);">
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="cerrarModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="document.getElementById('form-venta').requestSubmit()">
                💾 ${data ? 'Actualizar' : 'Registrar'}
            </button>
        </div>
    `);
}

function calcularUtilidadVenta() {
    const form = document.getElementById('form-venta');
    if (!form) return;
    const costo = parseFloat(form.costoProduccion.value) || 0;
    const precio = parseFloat(form.precioVenta.value) || 0;
    form.utilidadBruta.value = (precio - costo).toFixed(2);
}

function guardarVenta(event, id) {
    event.preventDefault();
    const form = new FormData(event.target);
    
    const venta = {
        folioRemision: form.get('folioRemision'),
        fechaPedido: form.get('fechaPedido'),
        fechaEntrega: form.get('fechaEntrega'),
        vendedor: form.get('vendedor'),
        medioContacto: form.get('medioContacto'),
        cliente: form.get('cliente'),
        codigoProducto: form.get('codigoProducto'),
        descripcion: form.get('descripcion'),
        cantidad: parseFloat(form.get('cantidad')),
        costoProduccion: parseFloat(form.get('costoProduccion')),
        precioVenta: parseFloat(form.get('precioVenta')),
        utilidadBruta: parseFloat(form.get('utilidadBruta'))
    };
    
    if (!db.ventas) db.ventas = [];
    
    if (id) {
        const index = db.ventas.findIndex(v => v.id === id);
        db.ventas[index] = { ...db.ventas[index], ...venta };
        alert('✅ Venta actualizada correctamente');
    } else {
        venta.id = nextId.ventas++;
        db.ventas.push(venta);
        alert('✅ Venta registrada correctamente');
    }
    
    // Sincronización automática con Firebase
    cerrarModal();
    renderPestanaInventario();
}

function editarVenta(id) {
    const venta = db.ventas.find(v => v.id === id);
    if (venta) abrirModalVenta(venta);
}

function eliminarVenta(id) {
    if (confirm('¿Estás seguro de eliminar esta venta?')) {
        const index = db.ventas.findIndex(v => v.id === id);
        db.ventas.splice(index, 1);
        // Sincronización automática con Firebase
        renderPestanaInventario();
        alert('✅ Venta eliminada');
    }
}

// ========== PESTAÑA: STOCK ==========
function renderStock(container) {
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="margin: 0; color: var(--dark);">📊 Control de Stock</h3>
            <button class="btn btn-primary" onclick="generarReporteStock()">📋 Generar Reporte</button>
        </div>
        
        <!-- Filtros -->
        <div style="background: white; padding: 1rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <input type="text" id="search-stock" placeholder="🔍 Buscar producto..." 
                       onkeyup="filtrarStock()" class="form-control" style="flex: 1; min-width: 250px;">
                
                <select id="filtro-categoria-stock" class="form-control" onchange="filtrarStock()" style="max-width: 200px;">
                    <option value="todos">Todas las categorías</option>
                    ${obtenerCategoriasStock().map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
                
                <select id="filtro-estado-stock" class="form-control" onchange="filtrarStock()" style="max-width: 200px;">
                    <option value="todos">Todos los estados</option>
                    <option value="normal">Stock Normal</option>
                    <option value="bajo">Stock Bajo</option>
                    <option value="critico">Stock Crítico</option>
                </select>
            </div>
        </div>
        
        <!-- Estadísticas -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div class="stat-card">
                <div class="stat-icon">📦</div>
                <div class="stat-value" id="stat-items-stock">0</div>
                <div class="stat-label">Items en Stock</div>
            </div>
            <div class="stat-card" style="border-left: 4px solid #ef5350;">
                <div class="stat-icon">⚠️</div>
                <div class="stat-value" id="stat-stock-critico" style="color: #ef5350;">0</div>
                <div class="stat-label">Stock Crítico</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-value" id="stat-valor-stock">$0</div>
                <div class="stat-label">Valor Total Stock</div>
            </div>
        </div>
        
        <!-- Tabla de stock -->
        <div id="stock-container"></div>
    `;
    
    actualizarStatsStock();
    mostrarStock();
}

function obtenerCategoriasStock() {
    if (!db.productosInventario || db.productosInventario.length === 0) return [];
    const categorias = [...new Set(db.productosInventario.map(p => p.categoria))];
    return categorias.sort();
}

function calcularStockProducto(codigo) {
    // Stock inicial del producto (si existe en productosInventario)
    const producto = db.productosInventario ? db.productosInventario.find(p => p.codigo === codigo) : null;
    
    // Calcular entradas
    const entradas = db.entradas ? db.entradas.filter(e => e.codigoInsumo === codigo).reduce((sum, e) => sum + e.cantidad, 0) : 0;
    
    // Calcular salidas
    const salidas = db.salidas ? db.salidas.filter(s => s.codigoInsumo === codigo).reduce((sum, s) => sum + s.cantidadUtilizada, 0) : 0;
    
    return {
        producto,
        entradas,
        salidas,
        stockActual: entradas - salidas
    };
}

function actualizarStatsStock() {
    // Combinar todos los códigos únicos de productos e insumos
    const todosLosCodigos = new Set();
    
    if (db.productosInventario) {
        db.productosInventario.forEach(p => todosLosCodigos.add(p.codigo));
    }
    if (db.insumos) {
        db.insumos.forEach(i => todosLosCodigos.add(i.codigo));
    }
    
    document.getElementById('stat-items-stock').textContent = todosLosCodigos.size;
    
    // Contar items con stock crítico
    let stockCritico = 0;
    let valorTotal = 0;
    
    todosLosCodigos.forEach(codigo => {
        const insumo = db.insumos ? db.insumos.find(i => i.codigo === codigo) : null;
        if (insumo && insumo.stock <= insumo.stockMinimo) {
            stockCritico++;
        }
        if (insumo) {
            valorTotal += insumo.stock * insumo.costoUnitario;
        }
    });
    
    document.getElementById('stat-stock-critico').textContent = stockCritico;
    document.getElementById('stat-valor-stock').textContent = formatearMoneda(valorTotal);
}

function mostrarStock() {
    filtrarStock();
}

function filtrarStock() {
    // Crear array combinado de todos los insumos con cálculos reales
    let items = [];
    
    if (db.insumos) {
        items = db.insumos.map(i => {
            // Calcular ENTRADAS totales para este insumo (Stock Inicial)
            const totalEntradas = db.entradas 
                ? db.entradas.filter(e => e.codigoInsumo === i.codigo)
                    .reduce((sum, e) => sum + (parseFloat(e.cantidad) || 0), 0)
                : 0;
            
            // Calcular SALIDAS totales para este insumo
            const totalSalidas = db.salidas 
                ? db.salidas.filter(s => s.codigoInsumo === i.codigo)
                    .reduce((sum, s) => sum + (parseFloat(s.cantidadUtilizada) || 0), 0)
                : 0;
            
            // Calcular RETORNOS (cantidades devueltas de salidas)
            const totalRetornos = db.salidas 
                ? db.salidas.filter(s => s.codigoInsumo === i.codigo && s.cantidadRetornada > 0)
                    .reduce((sum, s) => sum + (parseFloat(s.cantidadRetornada) || 0), 0)
                : 0;
            
            // Calcular PENDIENTES DE RETORNO (salidas marcadas como pendientes)
            const totalPendientes = db.salidas 
                ? db.salidas.filter(s => s.codigoInsumo === i.codigo && (s.estado === 'pendiente' || s.estado === 'parcial'))
                    .reduce((sum, s) => {
                        const cantidadRetornada = parseFloat(s.cantidadRetornada) || 0;
                        const pendiente = (parseFloat(s.cantidadUtilizada) || 0) - cantidadRetornada;
                        return sum + pendiente;
                    }, 0)
                : 0;
            
            // Stock actual del insumo (ya actualizado por entradas/salidas/retornos)
            const stockActual = parseFloat(i.stock) || 0;
            
            return {
                codigo: i.codigo,
                nombre: i.nombre,
                descripcion: i.descripcion || '-',
                unidad: i.unidad,
                categoria: i.categoria,
                proveedor: i.proveedor || '-',
                ubicacion: i.ubicacion || '-',
                stockInicial: totalEntradas, // ← Total de entradas
                salidas: totalSalidas,
                retornos: totalRetornos, // ← Total de retornos
                pendienteRetorno: totalPendientes, // ← Total pendiente
                stockActual: stockActual, // ← Stock real del insumo
                costoUnitario: parseFloat(i.costoUnitario) || 0,
                valorStock: stockActual * (parseFloat(i.costoUnitario) || 0),
                stockMinimo: i.stockMinimo || 0
            };
        });
    }
    
    // Aplicar filtros
    const busqueda = document.getElementById('search-stock')?.value.toLowerCase() || '';
    if (busqueda) {
        items = items.filter(i => 
            i.nombre.toLowerCase().includes(busqueda) ||
            i.codigo.toLowerCase().includes(busqueda) ||
            i.categoria.toLowerCase().includes(busqueda)
        );
    }
    
    const categoriaFiltro = document.getElementById('filtro-categoria-stock')?.value || 'todos';
    if (categoriaFiltro !== 'todos') {
        items = items.filter(i => i.categoria === categoriaFiltro);
    }
    
    const estadoFiltro = document.getElementById('filtro-estado-stock')?.value || 'todos';
    if (estadoFiltro !== 'todos') {
        items = items.filter(i => {
            const stockActual = i.stockActual; // Usar el stock actual del objeto
            if (estadoFiltro === 'critico') return stockActual <= 0;
            if (estadoFiltro === 'bajo') return stockActual > 0 && stockActual <= i.stockMinimo;
            if (estadoFiltro === 'normal') return stockActual > i.stockMinimo;
            return true;
        });
    }
    
    const container = document.getElementById('stock-container');
    if (!container) return;
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📊</div>
                <p>No hay items en stock</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div style="background: white; border-radius: 12px; overflow-x: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <table style="width: 100%; border-collapse: collapse; min-width: 1600px;">
                <thead>
                    <tr style="background: var(--light); border-bottom: 2px solid var(--border);">
                        <th style="padding: 1rem; text-align: left;">Código</th>
                        <th style="padding: 1rem; text-align: left;">Nombre</th>
                        <th style="padding: 1rem; text-align: left;">Descripción</th>
                        <th style="padding: 1rem; text-align: center;">Unidad</th>
                        <th style="padding: 1rem; text-align: left;">Categoría</th>
                        <th style="padding: 1rem; text-align: left;">Proveedor</th>
                        <th style="padding: 1rem; text-align: left;">Ubicación</th>
                        <th style="padding: 1rem; text-align: right;">Stock Inicial</th>
                        <th style="padding: 1rem; text-align: right;">Salidas</th>
                        <th style="padding: 1rem; text-align: right;">Retornos</th>
                        <th style="padding: 1rem; text-align: right;">Pendiente</th>
                        <th style="padding: 1rem; text-align: right;">Stock Actual</th>
                        <th style="padding: 1rem; text-align: right;">Costo Unit.</th>
                        <th style="padding: 1rem; text-align: right;">Valor Stock</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(i => {
                        // Usar el stock actual del objeto (ya calculado correctamente)
                        const stockActual = i.stockActual;
                        const estadoStock = stockActual <= 0 ? 'critico' : (stockActual <= i.stockMinimo ? 'bajo' : 'normal');
                        const colorStock = estadoStock === 'critico' ? '#ef5350' : (estadoStock === 'bajo' ? '#ff9800' : '#4caf50');
                        
                        return `
                            <tr style="border-bottom: 1px solid var(--border); transition: background 0.2s;" 
                                onmouseover="this.style.background='var(--light)'" 
                                onmouseout="this.style.background='white'">
                                <td style="padding: 1rem;">
                                    <span style="font-weight: 600; font-family: monospace; background: var(--light); padding: 0.25rem 0.5rem; border-radius: 6px;">
                                        ${i.codigo}
                                    </span>
                                </td>
                                <td style="padding: 1rem; font-weight: 600;">${i.nombre}</td>
                                <td style="padding: 1rem; font-size: 0.9rem; color: var(--gray); max-width: 150px; overflow: hidden; text-overflow: ellipsis;">
                                    ${i.descripcion}
                                </td>
                                <td style="padding: 1rem; text-align: center; font-weight: 500;">${i.unidad}</td>
                                <td style="padding: 1rem;">
                                    <span style="background: var(--info)20; color: var(--info); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem;">
                                        ${i.categoria}
                                    </span>
                                </td>
                                <td style="padding: 1rem; font-size: 0.9rem;">${i.proveedor}</td>
                                <td style="padding: 1rem; font-size: 0.9rem;">${i.ubicacion}</td>
                                <td style="padding: 1rem; text-align: right; font-weight: 600;">${i.stockInicial}</td>
                                <td style="padding: 1rem; text-align: right; color: #ef5350;">${i.salidas}</td>
                                <td style="padding: 1rem; text-align: right; color: var(--success);">${i.retornos}</td>
                                <td style="padding: 1rem; text-align: right; color: var(--gray);">${i.pendienteRetorno}</td>
                                <td style="padding: 1rem; text-align: right;">
                                    <span style="background: ${colorStock}20; color: ${colorStock}; padding: 0.5rem 1rem; border-radius: 12px; font-weight: 700; display: inline-block;">
                                        ${stockActual}
                                    </span>
                                    ${estadoStock === 'critico' ? '<div style="font-size: 0.75rem; color: #ef5350; margin-top: 0.25rem;">⚠️ Crítico</div>' : ''}
                                    ${estadoStock === 'bajo' ? '<div style="font-size: 0.75rem; color: #ff9800; margin-top: 0.25rem;">⚠️ Bajo</div>' : ''}
                                </td>
                                <td style="padding: 1rem; text-align: right;">${formatearMoneda(i.costoUnitario)}</td>
                                <td style="padding: 1rem; text-align: right; font-weight: 700; color: var(--primary);">
                                    ${formatearMoneda(stockActual * i.costoUnitario)}
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function generarReporteStock() {
    alert('📋 Funcionalidad de reporte en desarrollo. Próximamente podrás exportar el reporte de stock a Excel o PDF.');
}
