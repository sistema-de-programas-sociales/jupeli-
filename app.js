// ========== INICIALIZACIÓN DE LA APLICACIÓN JUPELI ==========

// Función principal de inicialización
function inicializarApp() {
    // Cargar datos desde localStorage
    cargarDesdeLocalStorage();
    
    // Inicializar todos los módulos
    initDashboard();
    initClientes();
    initProductos();
    initPedidos();
    initInventario();
    initFinanzas();
    initReportes();
    initMas();
    
    // Configurar navegación
    configurarNavegacion();
    
    // Renderizar vista inicial (Dashboard)
    renderDashboard();
    
    console.log('✅ JUPELI inicializado correctamente');
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

// Auto-guardar cada 30 segundos
setInterval(() => {
    guardarEnLocalStorage();
}, 30000);

// Guardar antes de cerrar la página
window.addEventListener('beforeunload', () => {
    guardarEnLocalStorage();
});
