// ========== UTILIDADES GENERALES ==========

// ========== VALIDACIONES ==========
function validarTelefono(telefono) {
    if (!telefono) return false;
    const regex = /^[\d\s\-\(\)]+$/;
    const soloNumeros = telefono.replace(/\D/g, '');
    return regex.test(telefono) && soloNumeros.length === 10;
}

function validarEmail(email) {
    if (!email) return true; // Email es opcional
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarNumeroPositivo(numero) {
    const num = parseFloat(numero);
    return !isNaN(num) && num >= 0;
}

function validarEnteroPositivo(numero) {
    const num = parseInt(numero);
    return !isNaN(num) && num >= 0 && Number.isInteger(num);
}

function validarFormularioCliente(formData) {
    const errores = [];
    
    const nombre = formData.get('nombre');
    if (!nombre || nombre.trim().length < 2) {
        errores.push('El nombre debe tener al menos 2 caracteres');
    }
    
    const telefono = formData.get('telefono');
    if (!validarTelefono(telefono)) {
        errores.push('Teléfono inválido (debe tener 10 dígitos)');
    }
    
    const email = formData.get('email');
    if (email && !validarEmail(email)) {
        errores.push('Email inválido');
    }
    
    return errores;
}

function validarFormularioProducto(formData) {
    const errores = [];
    
    const nombre = formData.get('nombre');
    if (!nombre || nombre.trim().length < 2) {
        errores.push('El nombre debe tener al menos 2 caracteres');
    }
    
    const precio = formData.get('precio');
    if (!validarNumeroPositivo(precio)) {
        errores.push('El precio debe ser un número positivo');
    }
    
    const stock = formData.get('stock');
    if (!validarEnteroPositivo(stock)) {
        errores.push('El stock debe ser un número entero positivo');
    }
    
    const costo = formData.get('costo');
    if (costo && !validarNumeroPositivo(costo)) {
        errores.push('El costo debe ser un número positivo');
    }
    
    return errores;
}

function mostrarErrores(errores) {
    if (errores.length === 0) return true;
    
    alert('❌ Errores en el formulario:\n\n' + 
          errores.map((e, i) => `${i + 1}. ${e}`).join('\n'));
    return false;
}

// ========== FORMATEO ==========
function formatearMoneda(cantidad) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(cantidad);
}

function calcularMargen(precio, costo) {
    if (!costo || costo === 0) return 0;
    return ((precio - costo) / precio * 100).toFixed(1);
}

function generarSKU(categoria, nombre) {
    const prefijos = {
        'arcones': 'ARC',
        'bolsitas': 'BOL',
        'regalos': 'REG',
        'decoraciones': 'DEC',
        'digitales': 'DIG',
        'desayunos': 'DES'
    };
    const prefijo = prefijos[categoria] || 'PRD';
    const iniciales = nombre.split(' ').map(p => p[0]).join('').substring(0, 3).toUpperCase();
    const numero = String(nextId.productos).padStart(3, '0');
    return `${prefijo}-${iniciales}-${numero}`;
}

// ========== FECHAS ==========
function obtenerFechaHoy() {
    return new Date().toISOString().split('T')[0];
}

function diasHastaFecha(fecha) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaEntrega = new Date(fecha + 'T00:00:00');
    const diffTime = fechaEntrega - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function formatearFecha(fecha) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-MX', options);
}

function obtenerNombreMes(fecha) {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const date = new Date(fecha + 'T00:00:00');
    return meses[date.getMonth()];
}

// ========== NAVEGACIÓN ==========
function cambiarVista(vistaId) {
    // Ocultar todas las vistas
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    // Mostrar la vista seleccionada
    document.getElementById(vistaId).classList.add('active');
    
    // Actualizar menú de navegación
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-view') === vistaId) {
            item.classList.add('active');
        }
    });
}

// ========== MODAL ==========
function abrirModal(contenido) {
    const modal = document.getElementById('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="cerrarModal()">✕</button>
            ${contenido}
        </div>
    `;
    modal.style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
}

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
        cerrarModal();
    }
});

// ========== BÚSQUEDA ==========
function buscarEnArray(array, termino, campos) {
    if (!termino) return array;
    
    const terminoBusqueda = termino.toLowerCase();
    return array.filter(item => {
        return campos.some(campo => {
            const valor = item[campo];
            if (typeof valor === 'string') {
                return valor.toLowerCase().includes(terminoBusqueda);
            }
            return false;
        });
    });
}

// ========== ESTADÍSTICAS ==========
function calcularEstadisticas(array, campoNumerico) {
    if (array.length === 0) return { total: 0, promedio: 0, max: 0, min: 0 };
    
    const valores = array.map(item => item[campoNumerico] || 0);
    const total = valores.reduce((sum, val) => sum + val, 0);
    const promedio = total / valores.length;
    const max = Math.max(...valores);
    const min = Math.min(...valores);
    
    return { total, promedio, max, min };
}
