// ========== CONFIGURACIÓN FIREBASE JUPELI ==========
// Credenciales del proyecto Firebase
// Proyecto: jupeli
// ID: jupeli

const firebaseConfig = {
    apiKey: "AIzaSyAiWzGHwdMlqPZnpDn__smdPxq401Qhs",
    authDomain: "jupeli.firebaseapp.com",
    projectId: "jupeli",
    storageBucket: "jupeli.firebasestorage.app",
    messagingSenderId: "100034081683",
    appId: "1:100034081683:web:b4efcb9ce769cc20fa7e25",
    measurementId: "G-8P25W2RSVV"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar Firestore
const firestore = firebase.firestore();

// Referencia a la colección principal
const jupeli_db = firestore.collection('jupeli_data');

console.log('🔥 Firebase inicializado correctamente para proyecto: jupeli');
