// ========== MÓDULO: PRODUCTOS (COMPLETO Y FUNCIONAL) ==========

function initProductos() {
    console.log('✅ Módulo Productos inicializado');
}

function renderProductos() {
    const container = document.getElementById('view-productos');
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2 class="section-title" style="margin: 0;">🎁 Productos</h2>
            <button class="btn btn-primary" onclick="abrirModalProducto()">➕ Nuevo Producto</button>
        </div>
        
        <!-- Vista de Categorías -->
        <div id="productos-categorias">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div class="categoria-card" onclick="mostrarCategoria('arcones')">
                    <div style="font-size: 3rem;">📦</div>
                    <h3>Arcones</h3>
                    <p id="count-arcones">0 productos</p>
                </div>
                <div class="categoria-card" onclick="mostrarCategoria('bolsitas')">
                    <div style="font-size: 3rem;">🍬</div>
                    <h3>Bolsitas de Dulces</h3>
                    <p id="count-bolsitas">0 productos</p>
                </div>
                <div class="categoria-card" onclick="mostrarCategoria('regalos')">
                    <div style="font-size: 3rem;">🎁</div>
                    <h3>Regalos</h3>
                    <p id="count-regalos">0 productos</p>
                </div>
                <div class="categoria-card" onclick="mostrarCategoria('decoraciones')">
                    <div style="font-size: 3rem;">🎈</div>
                    <h3>Decoraciones</h3>
                    <p id="count-decoraciones">0 productos</p>
                </div>
                <div class="categoria-card" onclick="mostrarCategoria('digitales')">
                    <div style="font-size: 3rem;">💻</div>
                    <h3>Digitales</h3>
                    <p id="count-digitales">0 productos</p>
                </div>
                <div class="categoria-card" onclick="mostrarCategoria('desayunos')">
                    <div style="font-size: 3rem;">☕</div>
                    <h3>Desayunos</h3>
                    <p id="count-desayunos">0 productos</p>
                </div>
            </div>
        </div>
        
        <!-- Vista de Subcategoría (inicialmente oculta) -->
        <div id="productos-subcategoria" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <button class="btn btn-outline" onclick="volverCategorias()">← Volver</button>
                <h3 id="subcategoria-titulo" style="margin: 0;">Productos</h3>
                <button class="btn btn-primary" onclick="abrirModalProducto()">➕ Nuevo</button>
            </div>
            
            <div id="lista-productos-grid"></div>
        </div>
    `;
    
    actualizarStatsProductos();
}

function actualizarStatsProductos() {
    const categorias = ['arcones', 'bolsitas', 'regalos', 'decoraciones', 'digitales', 'desayunos'];
    categorias.forEach(cat => {
        const productos = db.productos.filter(p => p.categoria === cat);
        const elem = document.getElementById(`count-${cat}`);
        if (elem) {
            elem.textContent = `${productos.length} productos`;
        }
    });
}

function mostrarCategoria(categoria) {
    currentCategoria = categoria;
    
    const nombresCategoria = {
        'arcones': '📦 Arcones',
        'bolsitas': '🍬 Bolsitas de Dulces',
        'regalos': '🎁 Regalos',
        'decoraciones': '🎈 Decoraciones',
        'digitales': '💻 Productos Digitales',
        'desayunos': '☕ Desayuno Sorpresa'
    };
    
    document.getElementById('subcategoria-titulo').textContent = nombresCategoria[categoria];
    document.getElementById('productos-categorias').style.display = 'none';
    document.getElementById('productos-subcategoria').style.display = 'block';
    
    mostrarProductosCategoria();
}

function volverCategorias() {
    document.getElementById('productos-categorias').style.display = 'block';
    document.getElementById('productos-subcategoria').style.display = 'none';
    currentCategoria = '';
    actualizarStatsProductos();
}

function mostrarProductosCategoria() {
    let productos = currentCategoria === 'todos' 
        ? db.productos 
        : db.productos.filter(p => p.categoria === currentCategoria);
    
    const grid = document.getElementById('lista-productos-grid');
    
    if (productos.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <p>No hay productos en esta categoría</p>
                <button class="btn btn-primary" onclick="abrirModalProducto()" style="margin-top: 1rem;">
                    ➕ Agregar Primer Producto
                </button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
            ${productos.map(p => {
                const margen = p.costo ? ((p.precio - p.costo) / p.precio * 100).toFixed(0) : 0;
                const stockClase = p.stock === 0 ? 'badge-danger' : p.stock <= (p.stockMinimo || 5) ? 'badge-warning' : 'badge-success';
                const stockTexto = p.stock === 0 ? 'Agotado' : p.stock <= (p.stockMinimo || 5) ? 'Stock Bajo' : 'Disponible';
                
                return `
                    <div class="categoria-card" onclick="verProductoDetalle(${p.id})" style="cursor: pointer;">
                        <div style="font-size: 4rem; margin-bottom: 0.5rem;">${p.imagen || '📦'}</div>
                        <h4 style="margin-bottom: 0.5rem;">${p.nombre}</h4>
                        <p style="font-size: 0.85rem; color: var(--gray); margin-bottom: 0.5rem;">${p.descripcion.substring(0, 80)}...</p>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                            <div>
                                <div style="font-size: 1.3rem; font-weight: 700; color: var(--primary);">${formatearMoneda(p.precio)}</div>
                                <div style="font-size: 0.75rem; color: var(--gray);">Stock: ${p.stock}</div>
                            </div>
                            <span class="badge ${stockClase}">${stockTexto}</span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function verProductoDetalle(id) {
    const p = db.productos.find(x => x.id === id);
    if (!p) return;
    
    const margen = p.costo ? ((p.precio - p.costo) / p.precio * 100).toFixed(1) : 0;
    const ganancia = p.costo ? (p.precio - p.costo) : 0;
    
    abrirModal(`
        <div class="modal-header">
            <h3 class="modal-title">🎁 ${p.nombre}</h3>
            <button class="modal-close" onclick="cerrarModal()">×</button>
        </div>
        <div class="modal-body">
            <div style="text-align: center; font-size: 6rem; margin-bottom: 1.5rem;">${p.imagen || '📦'}</div>
            
            <div class="detalle-seccion">
                <div class="detalle-titulo">📋 Información del Producto</div>
                <div style="display: grid; gap: 0.5rem;">
                    <div><strong>SKU:</strong> ${p.sku || 'N/A'}</div>
                    <div><strong>Categoría:</strong> ${p.categoria}</div>
                    <div><strong>Estado:</strong> <span class="badge ${p.estado === 'activo' ? 'badge-success' : 'badge-danger'}">${p.estado || 'activo'}</span></div>
                </div>
            </div>

            <div class="detalle-seccion">
                <div class="detalle-titulo">📝 Descripción</div>
                <p>${p.descripcion}</p>
            </div>
            
            <div class="detalle-seccion">
                <div class="detalle-titulo">✨ Qué Incluye</div>
                <p style="white-space: pre-line;">${p.detalles || 'Sin detalles adicionales'}</p>
            </div>
            
            <!-- Estadísticas -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-value">${formatearMoneda(p.precio)}</div>
                    <div class="stat-label">Precio</div>
                </div>
                ${p.costo ? `
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-value">${formatearMoneda(ganancia)}</div>
                        <div class="stat-label">Ganancia (+${margen}%)</div>
                    </div>
                ` : ''}
                <div class="stat-card">
                    <div class="stat-icon">📦</div>
                    <div class="stat-value">${p.stock}</div>
                    <div class="stat-label">En Stock</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">✅</div>
                    <div class="stat-value">${p.vendidos || 0}</div>
                    <div class="stat-label">Vendidos</div>
                </div>
            </div>
            
            <!-- Acciones -->
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="cerrarModal()">Cerrar</button>
                <button class="btn btn-outline" onclick="eliminarProducto(${p.id})" 
                        style="color: #ef5350; border-color: #ef5350;">🗑️ Eliminar</button>
                <button class="btn btn-primary" onclick="editarProducto(${p.id})">✏️ Editar</button>
            </div>
        </div>
    `);
}

function eliminarProducto(id) {
    const producto = db.productos.find(p => p.id === id);
    if (!producto) return;
    
    const pedidosAsociados = db.pedidos.filter(p => p.productoId === id).length;
    
    let mensaje = `¿Estás seguro de eliminar el producto "${producto.nombre}"?`;
    if (pedidosAsociados > 0) {
        mensaje += `\n\n⚠️ Este producto tiene ${pedidosAsociados} pedido(s) asociado(s). Los pedidos NO se eliminarán.`;
    }
    
    if (confirm(mensaje)) {
        const index = db.productos.findIndex(p => p.id === id);
        db.productos.splice(index, 1);
        guardarEnLocalStorage();
        cerrarModal();
        renderProductos();
        alert('✅ Producto eliminado correctamente');
    }
}

function editarProducto(id) {
    const p = db.productos.find(x => x.id === id);
    cerrarModal();
    setTimeout(() => abrirModalProducto(p), 100);
}

function abrirModalProducto(data = null) {
    const categoriasOpciones = {
        'arcones': 'Arcones',
        'bolsitas': 'Bolsitas de Dulces',
        'regalos': 'Regalos',
        'decoraciones': 'Decoraciones',
        'digitales': 'Productos Digitales',
        'desayunos': 'Desayuno Sorpresa'
    };
    
    abrirModal(`
        <div class="modal-header">
            <h3 class="modal-title">${data ? '✏️ Editar' : '➕ Nuevo'} Producto</h3>
            <button class="modal-close" onclick="cerrarModal()">×</button>
        </div>
        <div class="modal-body">
            <form id="form-producto" onsubmit="guardarProducto(event, ${data ? data.id : 'null'})">
                <!-- Imagen -->
                <div class="form-group">
                    <label class="form-label">Imagen del Producto (Emoji) *</label>
                    <input type="text" id="producto-imagen" class="form-control" value="${data && data.imagen ? data.imagen : '📦'}" 
                        placeholder="Pega un emoji aquí" style="text-align: center; font-size: 2rem;" required>
                    <small style="color: var(--gray); display: block; margin-top: 0.5rem;">Copia y pega un emoji para representar el producto</small>
                </div>
                
                <!-- Información Básica -->
                <div class="form-group">
                    <label class="form-label">Nombre del Producto *</label>
                    <input type="text" class="form-control" name="nombre" value="${data ? data.nombre : ''}" required>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">SKU *</label>
                        <input type="text" class="form-control" name="sku" value="${data && data.sku ? data.sku : ''}" placeholder="Ej: ARC-ROM-001" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Categoría *</label>
                        <select class="form-control" name="categoria" required>
                            ${Object.entries(categoriasOpciones).map(([val, label]) => 
                                `<option value="${val}" ${data && data.categoria === val ? 'selected' : ''}>${label}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                
                <!-- Descripciones -->
                <div class="form-group">
                    <label class="form-label">Descripción Corta *</label>
                    <textarea class="form-control" name="descripcion" required style="min-height: 60px;" placeholder="Breve descripción del producto...">${data && data.descripcion ? data.descripcion : ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Detalles Completos (Qué Incluye) *</label>
                    <textarea class="form-control" name="detalles" required placeholder="Incluye:
• Item 1
• Item 2
• Item 3">${data && data.detalles ? data.detalles : ''}</textarea>
                </div>
                
                <!-- Precios -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Precio de Venta *</label>
                        <input type="number" class="form-control" name="precio" value="${data ? data.precio : ''}" step="0.01" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Costo</label>
                        <input type="number" class="form-control" name="costo" value="${data && data.costo ? data.costo : ''}" step="0.01" placeholder="Costo del producto">
                    </div>
                </div>
                
                <!-- Inventario -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Stock Actual *</label>
                        <input type="number" class="form-control" name="stock" value="${data ? data.stock : '0'}" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Stock Mínimo *</label>
                        <input type="number" class="form-control" name="stockMinimo" value="${data && data.stockMinimo ? data.stockMinimo : '5'}" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Unidades Vendidas</label>
                        <input type="number" class="form-control" name="vendidos" value="${data && data.vendidos ? data.vendidos : '0'}">
                    </div>
                </div>
                
                <!-- Estado -->
                <div class="form-group">
                    <label class="form-label">Estado</label>
                    <select class="form-control" name="estado">
                        <option value="activo" ${!data || data.estado === 'activo' ? 'selected' : ''}>✅ Activo</option>
                        <option value="inactivo" ${data && data.estado === 'inactivo' ? 'selected' : ''}>❌ Inactivo</option>
                    </select>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="cerrarModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="document.getElementById('form-producto').requestSubmit()">💾 Guardar Producto</button>
        </div>
    `);
}

function guardarProducto(event, id) {
    event.preventDefault();
    const form = new FormData(event.target);
    
    // Validar
    const errores = validarFormularioProducto(form);
    if (!mostrarErrores(errores)) {
        return;
    }
    
    const producto = {
        nombre: form.get('nombre'),
        sku: form.get('sku'),
        categoria: form.get('categoria'),
        descripcion: form.get('descripcion'),
        detalles: form.get('detalles'),
        precio: parseFloat(form.get('precio')),
        costo: parseFloat(form.get('costo')) || 0,
        stock: parseInt(form.get('stock')),
        stockMinimo: parseInt(form.get('stockMinimo')),
        vendidos: parseInt(form.get('vendidos')) || 0,
        estado: form.get('estado'),
        imagen: document.getElementById('producto-imagen').value || '📦'
    };
    
    if (id) {
        const index = db.productos.findIndex(p => p.id === id);
        db.productos[index] = { ...db.productos[index], ...producto };
        alert('✅ Producto actualizado correctamente');
    } else {
        producto.id = nextId.productos++;
        db.productos.push(producto);
        alert('✅ Producto creado correctamente');
    }
    
    guardarEnLocalStorage();
    cerrarModal();
    
    if (currentCategoria) {
        mostrarProductosCategoria();
    }
    actualizarStatsProductos();
}
