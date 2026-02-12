// ========== INICIALIZACIÓN DE LA APLICACIÓN JUPELI ==========

// Función principal de inicialización
async function inicializarApp() {
    console.log('🚀 Iniciando JUPELI...');
    
    // Mostrar mensaje de carga
    mostrarMensajeCarga('Conectando con Firebase...');
    
    try {
        // Inicializar Firestore y cargar datos
        await inicializarFirestore();
        
        // Inicializar todos los módulos
        initDashboard();
        initClientes();
        initProductos();
        initPedidos();
        initCosteo();
        initInventario();
        initFinanzas();
        initReportes();
        initMas();
        
        // Configurar navegación
        configurarNavegacion();
        
        // Configurar listeners de actualización automática
        configurarListenersDB();
        
        // Renderizar vista inicial (Dashboard)
        renderDashboard();
        
        // Ocultar mensaje de carga
        ocultarMensajeCarga();
        
        console.log('✅ JUPELI inicializado correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar:', error);
        alert('⚠️ Error al inicializar la aplicación. Verifica tu conexión y la configuración de Firebase.');
    }
}

// Mostrar mensaje de carga
function mostrarMensajeCarga(mensaje) {
    const loader = document.createElement('div');
    loader.id = 'app-loader';
    loader.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0,0,0,0.8); display: flex; align-items: center; 
                    justify-content: center; z-index: 99999;">
            <div style="background: white; padding: 2rem; border-radius: 12px; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🔥</div>
                <div style="font-size: 1.2rem; font-weight: bold;">${mensaje}</div>
                <div style="margin-top: 1rem; color: #666;">Por favor espera...</div>
            </div>
        </div>
    `;
    document.body.appendChild(loader);
}

// Ocultar mensaje de carga
function ocultarMensajeCarga() {
    const loader = document.getElementById('app-loader');
    if (loader) {
        loader.remove();
    }
}

// Configurar listeners para actualización automática cuando cambien los datos
function configurarListenersDB() {
    window.addEventListener('dbUpdated', (event) => {
        const { coleccion } = event.detail;
        console.log(`🔄 Base de datos actualizada: ${coleccion}`);
        
        // Re-renderizar la vista activa
        const vistaActiva = document.querySelector('.view.active');
        if (vistaActiva) {
            const vistaId = vistaActiva.id;
            renderizarVista(vistaId);
        }
    });
}

// Configurar eventos de navegación
function configurarNavegacion() {
    // Navegación superior
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const vistaId = this.getAttribute('data-view');
            cambiarVista(vistaId);
        });
    });
}

// Función para cambiar de vista
function cambiarVista(vistaId) {
    // Remover clase active de todos los nav-items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Agregar clase active al nav-item seleccionado
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.getAttribute('data-view') === vistaId) {
            item.classList.add('active');
        }
    });
    
    // Ocultar todas las vistas
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Mostrar la vista seleccionada
    const vistaSeleccionada = document.getElementById(vistaId);
    if (vistaSeleccionada) {
        vistaSeleccionada.classList.add('active');
    }
    
    // Renderizar el contenido de la vista
    renderizarVista(vistaId);
}

// Renderizar vista según el ID
function renderizarVista(vistaId) {
    switch(vistaId) {
        case 'view-dashboard':
            renderDashboard();
            break;
        case 'view-clientes':
            renderClientes();
            break;
        case 'view-productos':
            renderProductos();
            break;
        case 'view-pedidos':
            renderPedidos();
            break;
        case 'view-costeo':
            renderCosteo();
            break;
        case 'view-inventario':
            renderInventario();
            break;
        case 'view-finanzas':
            renderFinanzas();
            break;
        case 'view-reportes':
            renderReportes();
            break;
        case 'view-mas':
            renderMas();
            break;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarApp);

// NOTA: Con Firestore, el auto-guardado ya no es necesario
// Firebase sincroniza automáticamente en tiempo real
