// ========== MÓDULO: PRODUCTOS (MEJORADO CON CATEGORÍAS DINÁMICAS) ==========

// Namespace para evitar conflictos globales
const ProductosModule = {
    currentCategoria: '',
    categorias: [
        { id: 'arcones', nombre: 'Arcones', icono: '📦' },
        { id: 'bolsitas', nombre: 'Bolsitas de Dulces', icono: '🍬' },
        { id: 'regalos', nombre: 'Regalos', icono: '🎁' },
        { id: 'decoraciones', nombre: 'Decoraciones', icono: '🎈' },
        { id: 'digitales', nombre: 'Digitales', icono: '💻' },
        { id: 'desayunos', nombre: 'Desayunos', icono: '☕' }
    ]
};

function initProductos() {
    console.log('✅ Módulo Productos inicializado');
}

function renderProductos() {
    const container = document.getElementById('view-productos');
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2 class="section-title" style="margin: 0;">🎁 Categorías de Productos</h2>
            <button class="btn btn-primary" onclick="abrirModalNuevaCategoria()">➕ Nueva Categoría</button>
        </div>
        
        <!-- Vista de Categorías -->
        <div id="productos-categorias">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem;" id="grid-categorias">
                <!-- Se llenan dinámicamente -->
            </div>
        </div>
        
        <!-- Vista de Subcategoría (inicialmente oculta) -->
        <div id="productos-subcategoria" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <button class="btn btn-outline" onclick="volverCategorias()">← Volver</button>
                <h3 id="subcategoria-titulo" style="margin: 0;">Productos</h3>
                <button class="btn btn-primary" onclick="abrirModalProductoEnCategoria()">➕ Nuevo Producto</button>
            </div>
            
            <div id="lista-productos-grid"></div>
        </div>
    `;
    
    mostrarCategoriasGrid();
}

function mostrarCategoriasGrid() {
    const grid = document.getElementById('grid-categorias');
    if (!grid) return;
    
    grid.innerHTML = ProductosModule.categorias.map(cat => {
        const productos = db.productos.filter(p => p.categoria === cat.id);
        return `
            <div class="categoria-card" onclick="mostrarCategoria('${cat.id}')">
                <div style="font-size: 3rem;">${cat.icono}</div>
                <h3>${cat.nombre}</h3>
                <p id="count-${cat.id}">${productos.length} productos</p>
            </div>
        `;
    }).join('');
}

function actualizarStatsProductos() {
    ProductosModule.categorias.forEach(cat => {
        const productos = db.productos.filter(p => p.categoria === cat.id);
        const elem = document.getElementById(`count-${cat.id}`);
        if (elem) {
            elem.textContent = `${productos.length} productos`;
        }
    });
}

function abrirModalNuevaCategoria() {
    abrirModal(`
        <div class="modal-header">
            <h2>➕ Nueva Categoría de Productos</h2>
            <span class="modal-close" onclick="cerrarModal()">×</span>
        </div>
        <div class="modal-body">
            <form id="form-nueva-categoria" onsubmit="guardarNuevaCategoria(event)">
                <div class="form-group">
                    <label>Nombre de la Categoría *</label>
                    <input type="text" name="nombre" class="form-control" required
                           placeholder="Ej: Piñatas, Centros de Mesa, etc.">
                </div>
                
                <div class="form-group">
                    <label>Ícono (Emoji) *</label>
                    <input type="text" name="icono" class="form-control" required maxlength="2"
                           placeholder="Ej: 🎉, 🎊, 🎈" value="🎁">
                    <small style="color: var(--gray); margin-top: 0.5rem; display: block;">
                        Usa un emoji para representar esta categoría
                    </small>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="cerrarModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="document.getElementById('form-nueva-categoria').requestSubmit()">
                ➕ Crear Categoría
            </button>
        </div>
    `);
}

function guardarNuevaCategoria(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const nombreCategoria = formData.get('nombre');
    const icono = formData.get('icono');
    const id = nombreCategoria.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Verificar que no exista
    if (ProductosModule.categorias.find(c => c.id === id)) {
        alert('⚠️ Ya existe una categoría con ese nombre');
        return;
    }
    
    ProductosModule.categorias.push({
        id: id,
        nombre: nombreCategoria,
        icono: icono
    });
    
    cerrarModal();
    renderProductos();
    alert('✅ Categoría creada exitosamente');
}

function mostrarCategoria(categoria) {
    ProductosModule.currentCategoria = categoria;
    
    const cat = ProductosModule.categorias.find(c => c.id === categoria);
    const nombreCategoria = cat ? `${cat.icono} ${cat.nombre}` : 'Productos';
    
    document.getElementById('subcategoria-titulo').textContent = nombreCategoria;
    document.getElementById('productos-categorias').style.display = 'none';
    document.getElementById('productos-subcategoria').style.display = 'block';
    
    mostrarProductosCategoria();
}

function volverCategorias() {
    document.getElementById('productos-categorias').style.display = 'block';
    document.getElementById('productos-subcategoria').style.display = 'none';
    ProductosModule.currentCategoria = '';
    actualizarStatsProductos();
}

function mostrarProductosCategoria() {
    let productos = ProductosModule.currentCategoria === 'todos' 
        ? db.productos 
        : db.productos.filter(p => p.categoria === ProductosModule.currentCategoria);
    
    const grid = document.getElementById('lista-productos-grid');
    
    if (productos.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <p>No hay productos en esta categoría</p>
                <button class="btn btn-primary" onclick="abrirModalProductoEnCategoria()" style="margin-top: 1rem;">
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
        // Sincronización automática con Firebase
        cerrarModal();
        renderProductos();
        alert('✅ Producto eliminado correctamente');
    }
}

function editarProducto(id) {
    const p = db.productos.find(x => x.id === id);
    cerrarModal();
    setTimeout(() => abrirModalProductoEnCategoria(p), 100);
}

function abrirModalProductoEnCategoria(data = null) {
    // Verificar si hay recetas disponibles
    const hayRecetas = db.recetas && db.recetas.length > 0;
    
    abrirModal(`
        <div class="modal-header">
            <h3 class="modal-title">${data ? '✏️ Editar' : '➕ Nuevo'} Producto</h3>
            <button class="modal-close" onclick="cerrarModal()">×</button>
        </div>
        <div class="modal-body">
            ${hayRecetas && !data ? `
                <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #2196f3;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <span style="font-size: 1.2rem;">💡</span>
                        <strong>¿Ya tienes este producto en Costeo?</strong>
                    </div>
                    <p style="margin: 0.5rem 0; color: #0d47a1;">Puedes importar los datos de una receta para no tener que llenarlos de nuevo.</p>
                    <button type="button" class="btn btn-primary" onclick="seleccionarRecetaParaProducto()" style="margin-top: 0.5rem;">
                        📋 Importar desde Receta
                    </button>
                </div>
            ` : ''}
            
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
                    <input type="text" id="producto-nombre" class="form-control" name="nombre" value="${data ? data.nombre : ''}" required>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">SKU *</label>
                        <input type="text" id="producto-sku" class="form-control" name="sku" value="${data && data.sku ? data.sku : ''}" placeholder="Ej: ARC-ROM-001" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Categoría *</label>
                        <select class="form-control" name="categoria" required>
                            ${ProductosModule.categorias.map(cat => 
                                `<option value="${cat.id}" ${(data && data.categoria === cat.id) || (!data && ProductosModule.currentCategoria === cat.id) ? 'selected' : ''}>${cat.nombre}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                
                <!-- Descripciones -->
                <div class="form-group">
                    <label class="form-label">Descripción Corta *</label>
                    <textarea id="producto-descripcion" class="form-control" name="descripcion" required style="min-height: 60px;" placeholder="Breve descripción del producto...">${data && data.descripcion ? data.descripcion : ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Detalles Completos (Qué Incluye) *</label>
                    <textarea id="producto-detalles" class="form-control" name="detalles" required placeholder="Incluye:
• Item 1
• Item 2
• Item 3">${data && data.detalles ? data.detalles : ''}</textarea>
                </div>
                
                <!-- Precios -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Precio de Venta *</label>
                        <input type="number" id="producto-precio" class="form-control" name="precio" value="${data ? data.precio : ''}" step="0.01" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Costo</label>
                        <input type="number" id="producto-costo" class="form-control" name="costo" value="${data && data.costo ? data.costo : ''}" step="0.01" placeholder="Costo del producto">
                        <small style="color: var(--gray); display: block; margin-top: 0.5rem;">
                            ${hayRecetas ? 'Se calcula automáticamente si importas una receta' : ''}
                        </small>
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
                
                <!-- Campo oculto para ID de receta si se importa -->
                <input type="hidden" id="producto-receta-id" name="recetaId" value="${data && data.recetaId ? data.recetaId : ''}">
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="cerrarModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="document.getElementById('form-producto').requestSubmit()">💾 Guardar Producto</button>
        </div>
    `);
}

function seleccionarRecetaParaProducto() {
    if (!db.recetas || db.recetas.length === 0) {
        alert('⚠️ No hay recetas disponibles. Primero crea una receta en la sección de Costeo.');
        return;
    }
    
    abrirModalSecundario(`
        <div class="modal-header">
            <h3>📋 Seleccionar Receta</h3>
        </div>
        <div class="modal-body">
            <p style="margin-bottom: 1rem; color: var(--gray);">
                Selecciona una receta para importar sus datos al producto:
            </p>
            
            <div style="display: grid; gap: 0.5rem; max-height: 400px; overflow-y: auto;">
                ${db.recetas.map(receta => {
                    const costos = calcularCostosReceta(receta);
                    return `
                        <div onclick="importarReceta(${receta.id})" 
                             style="padding: 1rem; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s;"
                             onmouseover="this.style.borderColor='#667eea'; this.style.background='#f9fafb'"
                             onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='white'">
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; margin-bottom: 0.25rem;">${receta.nombreProducto}</div>
                                    <div style="font-size: 0.85rem; color: var(--gray);">${receta.descripcion || 'Sin descripción'}</div>
                                    <div style="margin-top: 0.5rem; font-size: 0.85rem;">
                                        <span style="color: #ef4444;">Costo: ${formatearMoneda(costos.costoUnitario)}</span>
                                        <span style="margin: 0 0.5rem;">•</span>
                                        <span style="color: #22c55e;">Precio: ${formatearMoneda(receta.precioVenta)}</span>
                                        <span style="margin: 0 0.5rem;">•</span>
                                        <span style="color: #a855f7;">Margen: ${costos.margenPorcentaje.toFixed(1)}%</span>
                                    </div>
                                </div>
                                <div style="background: #667eea; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem;">
                                    ${receta.insumos.length} insumos
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="cerrarModalSecundario()">Cancelar</button>
        </div>
    `);
}

function importarReceta(recetaId) {
    const receta = db.recetas.find(r => r.id === recetaId);
    if (!receta) return;
    
    const costos = calcularCostosReceta(receta);
    
    // Llenar los campos del formulario
    document.getElementById('producto-nombre').value = receta.nombreProducto;
    document.getElementById('producto-descripcion').value = receta.descripcion || '';
    document.getElementById('producto-precio').value = receta.precioVenta;
    document.getElementById('producto-costo').value = costos.costoUnitario.toFixed(2);
    document.getElementById('producto-receta-id').value = recetaId;
    
    // Generar SKU automático
    const sku = receta.nombreProducto.substring(0, 3).toUpperCase() + '-' + Date.now().toString().slice(-6);
    document.getElementById('producto-sku').value = sku;
    
    // Generar detalles basados en los insumos
    let detalles = 'Incluye:\n';
    receta.insumos.forEach(ins => {
        const insumo = db.insumos.find(i => i.id === ins.insumoId);
        if (insumo) {
            detalles += `• ${insumo.nombre} (${ins.cantidad} ${ins.unidad})\n`;
        }
    });
    document.getElementById('producto-detalles').value = detalles;
    
    cerrarModalSecundario();
    
    alert(`✅ Datos importados de la receta "${receta.nombreProducto}"\n\n` +
          `Costo: ${formatearMoneda(costos.costoUnitario)}\n` +
          `Precio: ${formatearMoneda(receta.precioVenta)}\n` +
          `Margen: ${costos.margenPorcentaje.toFixed(1)}%\n\n` +
          `Puedes ajustar lo que necesites antes de guardar.`);
}

function abrirModalProducto(data = null) {
    // Mantener compatibilidad con llamadas antiguas
    abrirModalProductoEnCategoria(data);
}

function guardarProducto(event, id) {
    event.preventDefault();
    const form = new FormData(event.target);
    
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
        imagen: document.getElementById('producto-imagen').value || '📦',
        recetaId: form.get('recetaId') || null
    };
    
    if (id) {
        actualizarRegistro('productos', id, producto);
        alert('✅ Producto actualizado correctamente');
    } else {
        agregarRegistro('productos', producto);
        alert('✅ Producto creado correctamente');
    }
    
    cerrarModal();
    
    if (ProductosModule.currentCategoria) {
        mostrarProductosCategoria();
    }
    actualizarStatsProductos();
}

console.log('✅ Módulo Productos cargado');
