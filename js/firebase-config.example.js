// ========== ARCHIVO DE EJEMPLO - NO CONTIENE CREDENCIALES REALES ==========
// 
// Este es un archivo de ejemplo. Para configurar tu propia instancia:
// 
// 1. Copia este archivo y renómbralo a: firebase-config.js
// 2. Ve a Firebase Console: https://console.firebase.google.com/
// 3. Crea un proyecto nuevo o selecciona uno existente
// 4. Agrega una aplicación web (icono </>)
// 5. Copia tu configuración real y pégala aquí
// 6. Guarda el archivo como firebase-config.js
// 
// IMPORTANTE: El archivo firebase-config.js está en .gitignore 
// para proteger tus credenciales. Nunca compartas tus claves reales.

const firebaseConfig = {
    apiKey: "AIza...-tu-api-key-real",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar Firestore
const firestore = firebase.firestore();

// Referencia a la colección principal
const jupeli_db = firestore.collection('jupeli_data');

console.log('🔥 Firebase inicializado correctamente');
