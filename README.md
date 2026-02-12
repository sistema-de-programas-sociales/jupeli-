# 🎁 JUPELI - Sistema de Gestión de Eventos y Detalles

Sistema completo de gestión para negocios de eventos, regalos y detalles personalizados. Con sincronización en tiempo real mediante Firebase Firestore.

## 🚀 Características Principales

- **Multi-usuario en Tiempo Real**: Sincronización automática entre dispositivos
- **Gestión de Clientes**: Base de datos completa con historial
- **Catálogo de Productos**: Inventario organizado por categorías
- **Control de Pedidos**: Seguimiento completo del ciclo de vida
- **Finanzas**: Control de ingresos y gastos
- **Inventario Avanzado**: Control de stock, entradas y salidas
- **Reportes**: Análisis y estadísticas del negocio
- **Exportación de Datos**: Backup en formato JSON

## 📋 Requisitos Previos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Cuenta de Google/Firebase (gratuita)
- Conexión a internet para sincronización

## 🔧 Configuración Inicial

### 1. Clonar el Repositorio

\`\`\`bash
git clone [URL_DEL_REPOSITORIO]
cd jupeli-modular
\`\`\`

### 2. Configurar Firebase

#### A. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Clic en "Agregar proyecto"
3. Nombre del proyecto: "jupeli" (o el que prefieras)
4. Deshabilita Google Analytics (opcional)
5. Clic en "Crear proyecto"

#### B. Obtener Credenciales

1. En tu proyecto, ve a **⚙️ Configuración del proyecto**
2. Desplázate a "Tus apps"
3. Clic en el icono **</>** (Web)
4. Registra la app:
   - Alias: "Jupeli Web"
   - No marques "Firebase Hosting"
   - Clic en "Registrar app"
5. **Copia la configuración \`firebaseConfig\`**

#### C. Configurar Firestore Database

1. En el menú lateral, ve a **Firestore Database**
2. Clic en "Crear base de datos"
3. Selecciona ubicación (preferible: \`us-central\`)
4. Modo de seguridad:
   - **Modo de prueba** (para desarrollo) - 30 días
   - **Modo de producción** (para uso real) - configura reglas después

5. Si elegiste modo producción, configura las reglas:
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ Solo para desarrollo
      // Para producción, implementa autenticación adecuada
    }
  }
}
\`\`\`

#### D. Crear Archivo de Configuración Local

1. Copia el archivo de ejemplo:
\`\`\`bash
cp js/firebase-config.example.js js/firebase-config.js
\`\`\`

2. Abre \`js/firebase-config.js\` y pega tu configuración:
\`\`\`javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY_REAL",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};
\`\`\`

3. **⚠️ IMPORTANTE**: Este archivo está en \`.gitignore\` para proteger tus credenciales

### 3. Abrir la Aplicación

1. Abre \`index.html\` en tu navegador
2. La primera vez, verás un mensaje de conexión con Firebase
3. Si tienes datos en localStorage, se te preguntará si deseas migrarlos

## 👥 Configuración para Colaboradores

### Compartir el Proyecto

1. **Sube el código a GitHub** (sin firebase-config.js):
\`\`\`bash
git add .
git commit -m "Configuración inicial Jupeli"
git push origin main
\`\`\`

2. **Comparte las credenciales de Firebase** de forma segura:
   - Por mensaje privado/encriptado
   - O agrega al colaborador directamente en Firebase Console

### Para el Colaborador

1. Clona el repositorio:
\`\`\`bash
git clone [URL_DEL_REPOSITORIO]
cd jupeli-modular
\`\`\`

2. Crea el archivo de configuración:
\`\`\`bash
cp js/firebase-config.example.js js/firebase-config.js
\`\`\`

3. Pega las credenciales de Firebase compartidas

4. Abre \`index.html\` en el navegador

¡Listo! Ahora ambos verán los mismos datos en tiempo real.

## 📊 Estructura del Proyecto

\`\`\`
jupeli-modular/
├── index.html                 # Punto de entrada
├── css/
│   └── styles.css            # Estilos globales
├── js/
│   ├── firebase-config.js    # Configuración Firebase (NO en Git)
│   ├── app.js                # Inicialización
│   └── modules/              # Módulos funcionales
│       ├── dashboard.js
│       ├── clientes.js
│       ├── productos.js
│       ├── pedidos.js
│       ├── inventario.js
│       ├── finanzas.js
│       ├── reportes.js
│       └── mas.js
└── data/
    ├── database.js           # Lógica de base de datos
    ├── crud-helper.js        # Helpers CRUD
    └── utils.js              # Utilidades generales
\`\`\`

## 🔒 Seguridad

### Reglas de Firestore Recomendadas (Producción)

Para un entorno de producción, implementa autenticación:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /jupeli_data/{document=**} {
      // Solo usuarios autenticados
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

## 🛠️ Desarrollo

### Agregar Nuevos Módulos

1. Crea archivo en \`js/modules/mi-modulo.js\`
2. Agrega \`<script>\` en \`index.html\`
3. Usa las funciones CRUD:

\`\`\`javascript
// Agregar registro
await agregarRegistro('miColeccion', {
    campo1: 'valor1',
    campo2: 'valor2'
});

// Actualizar registro
await actualizarRegistro('miColeccion', id, {
    campo1: 'nuevoValor'
});

// Eliminar registro
await eliminarRegistro('miColeccion', id);

// Obtener registros
const registros = obtenerTodosLosRegistros('miColeccion');
\`\`\`

### Sincronización Automática

Los datos se sincronizan automáticamente. Para reaccionar a cambios:

\`\`\`javascript
window.addEventListener('dbUpdated', (event) => {
    const { coleccion } = event.detail;
    console.log(\`Actualización en: \${coleccion}\`);
    // Re-renderizar tu vista
});
\`\`\`

## 📱 Características Adicionales

- **Modo Offline**: Los datos se mantienen en cache
- **Backup Automático**: Exporta/Importa JSON
- **Migración desde localStorage**: Automática en primer uso

## 🐛 Solución de Problemas

### Error: "Firebase no está definido"
- Verifica conexión a internet
- Revisa que \`firebase-config.js\` existe y tiene credenciales correctas

### No se sincronizan los datos
- Verifica reglas de Firestore
- Checa la consola del navegador (F12)
- Confirma que ambos usuarios usan el mismo proyecto Firebase

### Error de permisos
- Revisa las reglas de Firestore Database
- Asegúrate de estar en "modo de prueba" o tener reglas adecuadas

## 📞 Soporte

Para reportar problemas o sugerencias, crea un Issue en GitHub.

## 📄 Licencia

Proyecto privado - Todos los derechos reservados

---

**Desarrollado con ❤️ para gestión de eventos y detalles**
