# 🚀 Guía Rápida de Configuración Firebase

## Para el Propietario (Primera vez)

### 1. Crear Proyecto Firebase (5 minutos)

1. **Firebase Console**: https://console.firebase.google.com/
2. **Crear proyecto** → Nombre: "jupeli"
3. **Desactivar** Google Analytics
4. **Firestore Database** → Crear base de datos → Modo de prueba → us-central

### 2. Obtener Credenciales

1. **⚙️ Project Settings** → Tus apps → Web **</>**
2. **Registrar app**: "Jupeli Web"
3. **Copiar** el objeto `firebaseConfig`

### 3. Configurar Localmente

```bash
# Clonar/descargar proyecto
cd jupeli-modular

# Copiar archivo de ejemplo
cp js/firebase-config.example.js js/firebase-config.js

# Editar firebase-config.js y pegar tus credenciales
# Abrir index.html en navegador
```

### 4. Subir a GitHub

```bash
git init
git add .
git commit -m "Initial commit Jupeli"
git remote add origin [URL_TU_REPOSITORIO]
git push -u origin main
```

**⚠️ IMPORTANTE**: `firebase-config.js` NO se sube (está en .gitignore)

---

## Para Colaboradores

### Setup Rápido (2 minutos)

```bash
# 1. Clonar repositorio
git clone [URL_DEL_REPOSITORIO]
cd jupeli-modular

# 2. Crear archivo de configuración
cp js/firebase-config.example.js js/firebase-config.js

# 3. Pedir credenciales al propietario y pegarlas en firebase-config.js

# 4. Abrir index.html en navegador
```

---

## Credenciales a Compartir

**Envía esto a tu colaborador** (mensaje privado):

```javascript
const firebaseConfig = {
    apiKey: "AIza...",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456:web:abc123"
};
```

---

## Verificación Rápida

✅ Abrir index.html
✅ Ver mensaje "🔥 Firebase inicializado"
✅ Agregar un cliente de prueba
✅ Abrir en otra pestaña/dispositivo → Debe aparecer el cliente

---

## Problemas Comunes

❌ **Error: Firebase is not defined**
→ Verifica que firebase-config.js existe y tiene las credenciales

❌ **Error de permisos**
→ Firestore debe estar en "modo de prueba" o con reglas configuradas

❌ **No se sincronizan datos**
→ Ambos usuarios deben usar el MISMO projectId en firebase-config.js

---

## Migración desde localStorage

Primera vez que abres la app:
1. Si tienes datos en localStorage
2. Aparecerá un diálogo preguntando si migrar
3. Clic en "Aceptar" (SOLO UNA VEZ)
4. Los datos se copian a Firebase
5. Ya no necesitas localStorage

---

**🎉 Listo para trabajar juntos en tiempo real!**
