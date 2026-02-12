// ========== MÓDULO: COSTEO DE PRODUCTOS ==========
// Sistema para calcular costos de producción y márgenes de utilidad

function initCosteo() {
    console.log('✅ Módulo Costeo inicializado');
}

function renderCosteo() {
    const container = document.getElementById('view-costeo');
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2 class="section-title" style="margin: 0;">💵 Costeo de Productos</h2>
            <button class="btn btn-primary" onclick="abrirModalReceta()">➕ Nueva Receta</button>
        </div>
        
        <!-- Búsqueda -->
        <div style="background: white; padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <input type="text" id="search-recetas" placeholder="🔍 Buscar receta..." 
                   onkeyup="filtrarRecetas()" class="form-control">
        </div>
        
        <!-- Lista de Recetas -->
        <div id="recetas-container"></div>
    `;
    
    mostrarRecetas();
}

// Estructura de una receta:
// {
//   id: 1,
//   nombreProducto: "Camión de Regalo",
//   descripcion: "Camión decorado con dulces",
//   insumos: [
//     { insumoId: 1, cantidad: 2, unidad: "piezas" },
//     { insumoId: 5, cantidad: 0.5, unidad: "metros" }
//   ],
//   precioVenta: 150,
//   notas: "Especificaciones adicionales"
// }

function mostrarRecetas() {
    const container = document.getElementById('recetas-container');
    
    if (!db.recetas || db.recetas.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; background: white; border-radius: 12px;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📋</div>
                <h3 style="color: var(--gray); margin-bottom: 1rem;">No hay recetas creadas</h3>
                <p style="color: var(--gray);">Crea tu primera receta para calcular costos de producción</p>
                <button class="btn btn-primary" onclick="abrirModalReceta()" style="margin-top: 1rem;">
                    ➕ Crear Primera Receta
                </button>
            </div>
        `;
        return;
    }
    
    const busqueda = document.getElementById('search-recetas')?.value.toLowerCase() || '';
    const recetasFiltradas = db.recetas.filter(r => 
        r.nombreProducto.toLowerCase().includes(busqueda) ||
        r.descripcion?.toLowerCase().includes(busqueda)
    );
    
    container.innerHTML = `
        <div style="display: grid; gap: 1.5rem;">
            ${recetasFiltradas.map(receta => crearTarjetaReceta(receta)).join('')}
        </div>
    `;
}

function crearTarjetaReceta(receta) {
    const costos = calcularCostosReceta(receta);
    
    return `
        <div class="content-card" style="position: relative;">
            <!-- Botones de Acción -->
            <div style="position: absolute; top: 1rem; right: 1rem; display: flex; gap: 0.5rem;">
                <button class="btn btn-sm btn-outline" onclick="verDetallesReceta(${receta.id})" 
                        title="Ver detalles">
                    👁️
                </button>
                <button class="btn btn-sm btn-outline" onclick="abrirModalReceta(${receta.id})" 
                        title="Editar">
                    ✏️
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarReceta(${receta.id})" 
                        title="Eliminar">
                    🗑️
                </button>
            </div>
            
            <!-- Header -->
            <div style="margin-bottom: 1.5rem; padding-right: 8rem;">
                <h3 style="margin: 0 0 0.5rem 0; color: var(--primary);">${receta.nombreProducto}</h3>
                ${receta.descripcion ? `<p style="color: var(--gray); margin: 0;">${receta.descripcion}</p>` : ''}
            </div>
            
            <!-- Grid de Métricas -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                <!-- Costo Unitario -->
                <div style="background: #f0f9ff; padding: 1rem; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                    <div style="font-size: 0.85rem; color: #0c4a6e; margin-bottom: 0.5rem;">Costo Unitario</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #0ea5e9;">${formatearMoneda(costos.costoUnitario)}</div>
                </div>
                
                <!-- Precio de Venta -->
                <div style="background: #f0fdf4; padding: 1rem; border-radius: 8px; border-left: 4px solid #22c55e;">
                    <div style="font-size: 0.85rem; color: #14532d; margin-bottom: 0.5rem;">Precio de Venta</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #22c55e;">${formatearMoneda(receta.precioVenta || 0)}</div>
                </div>
                
                <!-- Margen de Utilidad -->
                <div style="background: ${costos.margenPorcentaje >= 30 ? '#f0fdf4' : '#fff7ed'}; padding: 1rem; border-radius: 8px; border-left: 4px solid ${costos.margenPorcentaje >= 30 ? '#22c55e' : '#f97316'};">
                    <div style="font-size: 0.85rem; color: ${costos.margenPorcentaje >= 30 ? '#14532d' : '#7c2d12'}; margin-bottom: 0.5rem;">Margen</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: ${costos.margenPorcentaje >= 30 ? '#22c55e' : '#f97316'};">
                        ${costos.margenPorcentaje.toFixed(1)}%
                    </div>
                </div>
                
                <!-- Utilidad por Unidad -->
                <div style="background: #faf5ff; padding: 1rem; border-radius: 8px; border-left: 4px solid #a855f7;">
                    <div style="font-size: 0.85rem; color: #581c87; margin-bottom: 0.5rem;">Utilidad Unitaria</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #a855f7;">${formatearMoneda(costos.utilidadUnitaria)}</div>
                </div>
            </div>
            
            <!-- Insumos Utilizados -->
            <div style="margin-top: 1rem;">
                <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--dark);">
                    📦 Insumos (${receta.insumos.length})
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${receta.insumos.map(ins => {
                        const insumo = db.insumos.find(i => i.id === ins.insumoId);
                        return insumo ? `
                            <span style="background: #f3f4f6; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem;">
                                ${insumo.nombre} (${ins.cantidad} ${ins.unidad})
                            </span>
                        ` : '';
                    }).join('')}
                </div>
            </div>
            
            <!-- Calculadora Rápida -->
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb;">
                <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                    <span style="font-weight: 600; color: var(--dark);">🧮 Calcular para:</span>
                    <input type="number" id="cantidad-${receta.id}" value="1" min="1" 
                           style="width: 80px; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px;">
                    <span>unidades</span>
                    <button class="btn btn-sm btn-primary" onclick="calcularProduccion(${receta.id})">
                        Calcular
                    </button>
                </div>
            </div>
        </div>
    `;
}

function calcularCostosReceta(receta) {
    let costoTotal = 0;
    
    receta.insumos.forEach(insumoReceta => {
        const insumo = db.insumos.find(i => i.id === insumoReceta.insumoId);
        if (insumo) {
            const costoInsumo = (parseFloat(insumo.costoUnitario) || 0) * (parseFloat(insumoReceta.cantidad) || 0);
            costoTotal += costoInsumo;
        }
    });
    
    const precioVenta = parseFloat(receta.precioVenta) || 0;
    const utilidadUnitaria = precioVenta - costoTotal;
    const margenPorcentaje = precioVenta > 0 ? (utilidadUnitaria / precioVenta) * 100 : 0;
    
    return {
        costoUnitario: costoTotal,
        precioVenta: precioVenta,
        utilidadUnitaria: utilidadUnitaria,
        margenPorcentaje: margenPorcentaje
    };
}

function calcularProduccion(recetaId) {
    const receta = db.recetas.find(r => r.id === recetaId);
    if (!receta) return;
    
    const cantidadInput = document.getElementById(`cantidad-${recetaId}`);
    const cantidad = parseInt(cantidadInput.value) || 1;
    
    const costos = calcularCostosReceta(receta);
    
    // Calcular para múltiples unidades
    const costoTotalProduccion = costos.costoUnitario * cantidad;
    const ingresoTotalVentas = costos.precioVenta * cantidad;
    const utilidadTotal = costos.utilidadUnitaria * cantidad;
    
    // Desglose por insumo
    let detalleInsumos = '<div style="margin-top: 1rem;"><h4>Desglose de Insumos:</h4><table class="data-table" style="width: 100%;"><thead><tr><th>Insumo</th><th>Cantidad por Unidad</th><th>Cantidad Total</th><th>Costo Unitario</th><th>Costo por Unidad</th><th>Costo Total</th></tr></thead><tbody>';
    
    receta.insumos.forEach(ins => {
        const insumo = db.insumos.find(i => i.id === ins.insumoId);
        if (insumo) {
            const cantidadPorUnidad = parseFloat(ins.cantidad);
            const cantidadTotal = cantidadPorUnidad * cantidad;
            const costoUnitario = parseFloat(insumo.costoUnitario) || 0;
            const costoPorUnidad = costoUnitario * cantidadPorUnidad;
            const costoTotal = costoPorUnidad * cantidad;
            
            detalleInsumos += `
                <tr>
                    <td><strong>${insumo.nombre}</strong></td>
                    <td>${cantidadPorUnidad} ${ins.unidad}</td>
                    <td><strong>${cantidadTotal.toFixed(2)} ${ins.unidad}</strong></td>
                    <td>${formatearMoneda(costoUnitario)} / ${insumo.unidad}</td>
                    <td>${formatearMoneda(costoPorUnidad)}</td>
                    <td><strong>${formatearMoneda(costoTotal)}</strong></td>
                </tr>
            `;
        }
    });
    
    detalleInsumos += '</tbody></table></div>';
    
    abrirModal(`
        <div class="modal-header">
            <h2>🧮 Cálculo de Producción</h2>
            <span class="modal-close" onclick="cerrarModal()">×</span>
        </div>
        <div class="modal-body">
            <h3 style="color: var(--primary); margin-bottom: 1rem;">${receta.nombreProducto}</h3>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">Cantidad a producir: <strong>${cantidad} unidades</strong></p>
            
            <!-- Resumen de Costos -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div style="background: #fef3c7; padding: 1.5rem; border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.85rem; color: #78350f; margin-bottom: 0.5rem;">Costo por Unidad</div>
                    <div style="font-size: 1.8rem; font-weight: 700; color: #f59e0b;">${formatearMoneda(costos.costoUnitario)}</div>
                </div>
                
                <div style="background: #fee2e2; padding: 1.5rem; border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.85rem; color: #7f1d1d; margin-bottom: 0.5rem;">Costo Total Producción</div>
                    <div style="font-size: 1.8rem; font-weight: 700; color: #ef4444;">${formatearMoneda(costoTotalProduccion)}</div>
                </div>
                
                <div style="background: #dbeafe; padding: 1.5rem; border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.85rem; color: #1e3a8a; margin-bottom: 0.5rem;">Precio Venta por Unidad</div>
                    <div style="font-size: 1.8rem; font-weight: 700; color: #3b82f6;">${formatearMoneda(costos.precioVenta)}</div>
                </div>
                
                <div style="background: #dcfce7; padding: 1.5rem; border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.85rem; color: #14532d; margin-bottom: 0.5rem;">Ingreso Total Ventas</div>
                    <div style="font-size: 1.8rem; font-weight: 700; color: #22c55e;">${formatearMoneda(ingresoTotalVentas)}</div>
                </div>
                
                <div style="background: #f3e8ff; padding: 1.5rem; border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.85rem; color: #581c87; margin-bottom: 0.5rem;">Utilidad por Unidad</div>
                    <div style="font-size: 1.8rem; font-weight: 700; color: #a855f7;">${formatearMoneda(costos.utilidadUnitaria)}</div>
                </div>
                
                <div style="background: #e0f2fe; padding: 1.5rem; border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.85rem; color: #0c4a6e; margin-bottom: 0.5rem;">Utilidad Total</div>
                    <div style="font-size: 1.8rem; font-weight: 700; color: #0ea5e9;">${formatearMoneda(utilidadTotal)}</div>
                </div>
                
                <div style="background: ${costos.margenPorcentaje >= 30 ? '#dcfce7' : '#fed7aa'}; padding: 1.5rem; border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.85rem; color: ${costos.margenPorcentaje >= 30 ? '#14532d' : '#7c2d12'}; margin-bottom: 0.5rem;">Margen de Utilidad</div>
                    <div style="font-size: 1.8rem; font-weight: 700; color: ${costos.margenPorcentaje >= 30 ? '#22c55e' : '#f97316'};">${costos.margenPorcentaje.toFixed(1)}%</div>
                </div>
            </div>
            
            ${detalleInsumos}
            
            <!-- Análisis -->
            <div style="margin-top: 2rem; padding: 1rem; background: #f9fafb; border-radius: 8px; border-left: 4px solid var(--primary);">
                <h4 style="margin: 0 0 0.5rem 0;">📊 Análisis:</h4>
                <ul style="margin: 0; padding-left: 1.5rem; color: var(--dark);">
                    <li>Invertirás <strong>${formatearMoneda(costoTotalProduccion)}</strong> en materiales</li>
                    <li>Venderás por <strong>${formatearMoneda(ingresoTotalVentas)}</strong></li>
                    <li>Tu ganancia neta será de <strong>${formatearMoneda(utilidadTotal)}</strong></li>
                    <li>Margen de utilidad: <strong>${costos.margenPorcentaje.toFixed(1)}%</strong> ${costos.margenPorcentaje >= 30 ? '✅ (Excelente)' : costos.margenPorcentaje >= 20 ? '⚠️ (Aceptable)' : '❌ (Bajo)'}</li>
                </ul>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="cerrarModal()">Cerrar</button>
            <button class="btn btn-primary" onclick="exportarCalculoCosteo(${recetaId}, ${cantidad})">
                📥 Exportar PDF
            </button>
        </div>
    `);
}

function abrirModalReceta(recetaId = null) {
    const receta = recetaId ? db.recetas.find(r => r.id === recetaId) : null;
    const isEditing = receta !== null;
    
    // Inicializar insumos temporales
    window.insumosTemporales = receta ? JSON.parse(JSON.stringify(receta.insumos)) : [];
    
    abrirModal(`
        <div class="modal-header">
            <h2>${isEditing ? '✏️ Editar' : '➕ Nueva'} Receta de Producto</h2>
            <span class="modal-close" onclick="cerrarModal()">×</span>
        </div>
        <div class="modal-body">
            <form id="form-receta" onsubmit="guardarReceta(event, ${recetaId})">
                <!-- Información Básica -->
                <div class="form-section">
                    <h3>📝 Información del Producto</h3>
                    
                    <div class="form-group">
                        <label>Nombre del Producto *</label>
                        <input type="text" name="nombreProducto" class="form-control" 
                               value="${receta?.nombreProducto || ''}" required
                               placeholder="Ej: Camión de Regalo">
                    </div>
                    
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea name="descripcion" class="form-control" rows="2"
                                  placeholder="Descripción del producto...">${receta?.descripcion || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Precio de Venta Sugerido *</label>
                        <input type="number" name="precioVenta" class="form-control" 
                               value="${receta?.precioVenta || ''}" required min="0" step="0.01"
                               placeholder="0.00">
                    </div>
                </div>
                
                <!-- Insumos -->
                <div class="form-section">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3>🧵 Insumos Necesarios</h3>
                        <button type="button" class="btn btn-sm btn-primary" onclick="agregarInsumoTemporal()">
                            ➕ Agregar Insumo
                        </button>
                    </div>
                    
                    <div id="lista-insumos-receta"></div>
                </div>
                
                <!-- Notas -->
                <div class="form-section">
                    <h3>📌 Notas Adicionales</h3>
                    <textarea name="notas" class="form-control" rows="3"
                              placeholder="Notas sobre el proceso de elaboración...">${receta?.notas || ''}</textarea>
                </div>
                
                <!-- Preview de Costos -->
                <div id="preview-costos" style="margin-top: 1.5rem;"></div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="cerrarModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="document.getElementById('form-receta').requestSubmit()">
                ${isEditing ? '💾 Guardar Cambios' : '➕ Crear Receta'}
            </button>
        </div>
    `);
    
    actualizarListaInsumosTemporales();
    actualizarPreviewCostos();
}

function actualizarListaInsumosTemporales() {
    const container = document.getElementById('lista-insumos-receta');
    
    if (!window.insumosTemporales || window.insumosTemporales.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: #f9fafb; border-radius: 8px; border: 2px dashed #d1d5db;">
                <p style="color: var(--gray); margin: 0;">No hay insumos agregados</p>
                <p style="color: var(--gray); font-size: 0.9rem; margin-top: 0.5rem;">Haz clic en "➕ Agregar Insumo" para empezar</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div style="display: grid; gap: 1rem;">
            ${window.insumosTemporales.map((ins, index) => {
                const insumo = db.insumos.find(i => i.id === ins.insumoId);
                if (!insumo) return '';
                
                const costoTotal = (parseFloat(insumo.costoUnitario) || 0) * (parseFloat(ins.cantidad) || 0);
                
                return `
                    <div style="background: white; padding: 1rem; border-radius: 8px; border: 1px solid #e5e7eb;">
                        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 1rem; align-items: center;">
                            <div>
                                <div style="font-weight: 600; color: var(--dark);">${insumo.nombre}</div>
                                <div style="font-size: 0.85rem; color: var(--gray);">
                                    ${formatearMoneda(insumo.costoUnitario)} / ${insumo.unidad}
                                </div>
                            </div>
                            
                            <div>
                                <input type="number" value="${ins.cantidad}" min="0" step="0.01"
                                       onchange="actualizarCantidadInsumoTemporal(${index}, this.value)"
                                       class="form-control" placeholder="Cantidad">
                            </div>
                            
                            <div>
                                <select onchange="actualizarUnidadInsumoTemporal(${index}, this.value)"
                                        class="form-control">
                                    <option value="piezas" ${ins.unidad === 'piezas' ? 'selected' : ''}>piezas</option>
                                    <option value="metros" ${ins.unidad === 'metros' ? 'selected' : ''}>metros</option>
                                    <option value="cm" ${ins.unidad === 'cm' ? 'selected' : ''}>cm</option>
                                    <option value="gramos" ${ins.unidad === 'gramos' ? 'selected' : ''}>gramos</option>
                                    <option value="kg" ${ins.unidad === 'kg' ? 'selected' : ''}>kg</option>
                                    <option value="ml" ${ins.unidad === 'ml' ? 'selected' : ''}>ml</option>
                                    <option value="litros" ${ins.unidad === 'litros' ? 'selected' : ''}>litros</option>
                                </select>
                            </div>
                            
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <div style="font-weight: 700; color: var(--primary); min-width: 80px; text-align: right;">
                                    ${formatearMoneda(costoTotal)}
                                </div>
                                <button type="button" class="btn btn-sm btn-danger" 
                                        onclick="eliminarInsumoTemporal(${index})">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function agregarInsumoTemporal() {
    if (!db.insumos || db.insumos.length === 0) {
        alert('⚠️ No hay insumos registrados. Primero crea insumos en la sección de Inventario.');
        return;
    }
    
    abrirModalSecundario(`
        <div class="modal-header">
            <h3>Seleccionar Insumo</h3>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Buscar Insumo</label>
                <input type="text" id="search-insumo-modal" class="form-control" 
                       placeholder="🔍 Buscar..." onkeyup="filtrarInsumosModal()">
            </div>
            
            <div id="lista-insumos-modal" style="max-height: 400px; overflow-y: auto;">
                ${db.insumos.map(insumo => `
                    <div class="insumo-selectable" onclick="seleccionarInsumo(${insumo.id})"
                         style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 0.5rem; cursor: pointer; transition: all 0.2s;"
                         onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
                        <div style="font-weight: 600;">${insumo.nombre}</div>
                        <div style="font-size: 0.85rem; color: var(--gray);">
                            ${formatearMoneda(insumo.costoUnitario)} / ${insumo.unidad} | 
                            Stock: ${insumo.stock} ${insumo.unidad}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="cerrarModalSecundario()">Cancelar</button>
        </div>
    `);
}

function seleccionarInsumo(insumoId) {
    // Verificar que no esté ya agregado
    if (window.insumosTemporales.some(i => i.insumoId === insumoId)) {
        alert('⚠️ Este insumo ya está agregado');
        return;
    }
    
    const insumo = db.insumos.find(i => i.id === insumoId);
    window.insumosTemporales.push({
        insumoId: insumoId,
        cantidad: 1,
        unidad: insumo.unidad
    });
    
    cerrarModalSecundario();
    actualizarListaInsumosTemporales();
    actualizarPreviewCostos();
}

function actualizarCantidadInsumoTemporal(index, cantidad) {
    window.insumosTemporales[index].cantidad = parseFloat(cantidad) || 0;
    actualizarListaInsumosTemporales();
    actualizarPreviewCostos();
}

function actualizarUnidadInsumoTemporal(index, unidad) {
    window.insumosTemporales[index].unidad = unidad;
    actualizarListaInsumosTemporales();
}

function eliminarInsumoTemporal(index) {
    window.insumosTemporales.splice(index, 1);
    actualizarListaInsumosTemporales();
    actualizarPreviewCostos();
}

function actualizarPreviewCostos() {
    const container = document.getElementById('preview-costos');
    if (!container) return;
    
    let costoTotal = 0;
    window.insumosTemporales.forEach(ins => {
        const insumo = db.insumos.find(i => i.id === ins.insumoId);
        if (insumo) {
            costoTotal += (parseFloat(insumo.costoUnitario) || 0) * (parseFloat(ins.cantidad) || 0);
        }
    });
    
    const precioVentaInput = document.querySelector('input[name="precioVenta"]');
    const precioVenta = parseFloat(precioVentaInput?.value) || 0;
    const utilidad = precioVenta - costoTotal;
    const margen = precioVenta > 0 ? (utilidad / precioVenta) * 100 : 0;
    
    container.innerHTML = `
        <div style="background: #f9fafb; padding: 1.5rem; border-radius: 12px; border: 2px solid #e5e7eb;">
            <h4 style="margin: 0 0 1rem 0;">💰 Preview de Costos</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                <div>
                    <div style="font-size: 0.85rem; color: var(--gray);">Costo de Producción</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #ef4444;">${formatearMoneda(costoTotal)}</div>
                </div>
                <div>
                    <div style="font-size: 0.85rem; color: var(--gray);">Precio de Venta</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #3b82f6;">${formatearMoneda(precioVenta)}</div>
                </div>
                <div>
                    <div style="font-size: 0.85rem; color: var(--gray);">Utilidad</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #22c55e;">${formatearMoneda(utilidad)}</div>
                </div>
                <div>
                    <div style="font-size: 0.85rem; color: var(--gray);">Margen</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: ${margen >= 30 ? '#22c55e' : '#f97316'};">${margen.toFixed(1)}%</div>
                </div>
            </div>
        </div>
    `;
    
    // Actualizar cada vez que cambie el precio de venta
    if (precioVentaInput) {
        precioVentaInput.removeEventListener('input', actualizarPreviewCostos);
        precioVentaInput.addEventListener('input', actualizarPreviewCostos);
    }
}

function guardarReceta(event, recetaId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    if (!window.insumosTemporales || window.insumosTemporales.length === 0) {
        alert('⚠️ Debes agregar al menos un insumo');
        return;
    }
    
    const recetaData = {
        nombreProducto: formData.get('nombreProducto'),
        descripcion: formData.get('descripcion'),
        precioVenta: parseFloat(formData.get('precioVenta')),
        insumos: window.insumosTemporales,
        notas: formData.get('notas')
    };
    
    if (recetaId) {
        // Actualizar receta existente
        const index = db.recetas.findIndex(r => r.id === recetaId);
        if (index !== -1) {
            db.recetas[index] = { ...db.recetas[index], ...recetaData };
        }
    } else {
        // Crear nueva receta
        db.recetas.push({
            id: nextId.recetas++,
            ...recetaData,
            fechaCreacion: new Date().toISOString()
        });
    }
    
    // Sincronización automática con Firebase
    
    cerrarModal();
    renderCosteo();
    
    alert(`✅ Receta ${recetaId ? 'actualizada' : 'creada'} exitosamente`);
}

function eliminarReceta(recetaId) {
    const receta = db.recetas.find(r => r.id === recetaId);
    if (!receta) return;
    
    if (!confirm(`¿Eliminar la receta "${receta.nombreProducto}"?`)) return;
    
    eliminarRegistro('recetas', recetaId);
    renderCosteo();
}

function verDetallesReceta(recetaId) {
    const receta = db.recetas.find(r => r.id === recetaId);
    if (!receta) return;
    
    const costos = calcularCostosReceta(receta);
    
    let detalleInsumos = '<table class="data-table" style="width: 100%; margin-top: 1rem;"><thead><tr><th>Insumo</th><th>Cantidad</th><th>Costo Unitario</th><th>Costo Total</th></tr></thead><tbody>';
    
    receta.insumos.forEach(ins => {
        const insumo = db.insumos.find(i => i.id === ins.insumoId);
        if (insumo) {
            const costoTotal = (parseFloat(insumo.costoUnitario) || 0) * (parseFloat(ins.cantidad) || 0);
            detalleInsumos += `
                <tr>
                    <td><strong>${insumo.nombre}</strong></td>
                    <td>${ins.cantidad} ${ins.unidad}</td>
                    <td>${formatearMoneda(insumo.costoUnitario)} / ${insumo.unidad}</td>
                    <td>${formatearMoneda(costoTotal)}</td>
                </tr>
            `;
        }
    });
    
    detalleInsumos += '</tbody></table>';
    
    abrirModal(`
        <div class="modal-header">
            <h2>📋 Detalles de Receta</h2>
            <span class="modal-close" onclick="cerrarModal()">×</span>
        </div>
        <div class="modal-body">
            <h3 style="color: var(--primary); margin-bottom: 1rem;">${receta.nombreProducto}</h3>
            ${receta.descripcion ? `<p style="color: var(--gray); margin-bottom: 1.5rem;">${receta.descripcion}</p>` : ''}
            
            <!-- Métricas -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div style="background: #fef3c7; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.85rem; color: #78350f;">Costo Unitario</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #f59e0b;">${formatearMoneda(costos.costoUnitario)}</div>
                </div>
                <div style="background: #dbeafe; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.85rem; color: #1e3a8a;">Precio de Venta</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #3b82f6;">${formatearMoneda(costos.precioVenta)}</div>
                </div>
                <div style="background: #dcfce7; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.85rem; color: #14532d;">Utilidad</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #22c55e;">${formatearMoneda(costos.utilidadUnitaria)}</div>
                </div>
                <div style="background: #f3e8ff; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.85rem; color: #581c87;">Margen</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #a855f7;">${costos.margenPorcentaje.toFixed(1)}%</div>
                </div>
            </div>
            
            <!-- Insumos -->
            <h4>🧵 Insumos Necesarios:</h4>
            ${detalleInsumos}
            
            ${receta.notas ? `
                <div style="margin-top: 1.5rem; padding: 1rem; background: #f9fafb; border-radius: 8px;">
                    <h4 style="margin: 0 0 0.5rem 0;">📌 Notas:</h4>
                    <p style="margin: 0; white-space: pre-wrap;">${receta.notas}</p>
                </div>
            ` : ''}
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="cerrarModal()">Cerrar</button>
            <button class="btn btn-primary" onclick="cerrarModal(); abrirModalReceta(${recetaId})">
                ✏️ Editar
            </button>
        </div>
    `);
}

function filtrarRecetas() {
    mostrarRecetas();
}

function exportarCalculoCosteo(recetaId, cantidad) {
    alert('📥 Función de exportar a PDF en desarrollo. Por ahora puedes usar el botón de imprimir del navegador (Ctrl+P).');
    window.print();
}

// Modal secundario para selección de insumos
function abrirModalSecundario(contenido) {
    const modal = document.createElement('div');
    modal.id = 'modal-secundario';
    modal.className = 'modal';
    modal.style.zIndex = '10001';
    modal.innerHTML = `<div class="modal-content">${contenido}</div>`;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function cerrarModalSecundario() {
    const modal = document.getElementById('modal-secundario');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

function filtrarInsumosModal() {
    const busqueda = document.getElementById('search-insumo-modal').value.toLowerCase();
    const items = document.querySelectorAll('.insumo-selectable');
    
    items.forEach(item => {
        const texto = item.textContent.toLowerCase();
        item.style.display = texto.includes(busqueda) ? 'block' : 'none';
    });
}

console.log('✅ Módulo Costeo cargado');
