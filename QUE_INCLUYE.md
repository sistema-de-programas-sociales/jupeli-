# 📦 JUPELI - Versión Completa con Sistema de Costeo

## ✅ LO QUE INCLUYE ESTE PAQUETE

### 🎯 Funcionalidad Principal
- **Sistema Completo de Gestión** (Clientes, Productos, Pedidos, Inventario, Finanzas, Reportes)
- **🆕 Sistema de Costeo de Productos** - Calcula costos, márgenes y utilidades
- **Firebase Firestore** - Sincronización en tiempo real
- **Multi-usuario** - Trabaja con colaboradores

### 📊 Sistema de Costeo (NUEVO)
Calcula exactamente cuánto te cuesta producir cada producto:

#### Características:
- ✅ Crea "recetas" con todos los insumos necesarios
- ✅ Calcula costo de producción automáticamente
- ✅ Calcula para cualquier cantidad (1, 14, 50, 100...)
- ✅ Muestra margen de utilidad en %
- ✅ Desglose detallado por insumo
- ✅ Análisis de rentabilidad

#### Ejemplo: 14 Camiones de Regalo
```
Costo por Camión: $96.50
Costo Total (14): $1,351.00
Precio Venta: $150.00
Ingreso Total: $2,100.00
Utilidad: $749.00
Margen: 35.7% ✅
```

### 🗂️ Estructura del Sistema

```
jupeli-firebase/
├── index.html                    ← ABRE ESTE ARCHIVO
├── LEEME_PRIMERO.txt             ← Lee esto primero
├── GUIA_SISTEMA_COSTEO.md        ← Tutorial completo del costeo
├── INICIO_RAPIDO.md              ← Guía rápida
├── README.md                     ← Documentación técnica
├── css/
│   └── styles.css
├── data/
│   ├── database.js               ← Incluye colección "recetas"
│   ├── crud-helper.js
│   └── utils.js
└── js/
    ├── firebase-config.js        ← Credenciales configuradas
    ├── app.js
    └── modules/
        ├── dashboard.js
        ├── clientes.js
        ├── productos.js
        ├── pedidos.js
        ├── costeo.js             ← 🆕 NUEVO MÓDULO
        ├── inventario.js
        ├── finanzas.js
        ├── reportes.js
        └── mas.js
```

## 🚀 CÓMO USAR

### Paso 1: Extraer
Descomprime el archivo ZIP

### Paso 2: Abrir
Haz **doble clic en `index.html`**
¡Listo! Se abre en tu navegador

### Paso 3: Usar el Costeo
1. Ve a **Inventario → Insumos**
   - Registra tus materiales (Cartón, Listón, Dulces, etc.)
   - Con sus costos unitarios

2. Ve a **💵 Costeo**
   - Clic en **➕ Nueva Receta**
   - Agrega el nombre del producto
   - Establece precio de venta
   - **➕ Agregar Insumo** (todos los necesarios)
   - Especifica cantidades

3. Calcula para cualquier cantidad:
   - En la tarjeta del producto
   - "🧮 Calcular para: [cantidad] unidades"
   - Clic **Calcular**
   - ¡Ve el desglose completo!

## 📊 NAVEGACIÓN

La barra superior tiene 9 pestañas:

1. 🏠 **Inicio** - Dashboard con estadísticas
2. 👥 **Clientes** - Gestión de clientes
3. 🎁 **Productos** - Catálogo de productos
4. 📦 **Pedidos** - Control de pedidos
5. 💵 **Costeo** - 🆕 Sistema de costeo (NUEVO)
6. 📊 **Inventario** - Stock e insumos
7. 💰 **Finanzas** - Ingresos y gastos
8. 📈 **Reportes** - Análisis y estadísticas
9. ⚙️ **Config** - Configuración técnica

## 🔑 FIREBASE CONFIGURADO

Las credenciales de tu proyecto "jupeli" ya están en el código:
- Archivo: `js/firebase-config.js`
- Proyecto: jupeli
- Todo funciona automáticamente

## 👥 COMPARTIR CON COLABORADOR

### Método 1: GitHub (Recomendado)
```bash
git init
git add .
git commit -m "Jupeli con Costeo"
git push
```

### Método 2: Compartir ZIP
1. Envía la carpeta completa
2. El colaborador abre `index.html`
3. Los datos se sincronizan automáticamente

**Nota:** Ambos deben tener las mismas credenciales Firebase (ya están en el código)

## 📚 DOCUMENTACIÓN

### Guías Incluidas:
- **LEEME_PRIMERO.txt** → Inicio rápido básico
- **GUIA_SISTEMA_COSTEO.md** → Tutorial completo del costeo con ejemplos
- **INICIO_RAPIDO.md** → Guía de uso general
- **README.md** → Documentación técnica completa
- **SETUP_RAPIDO.md** → Configuración para colaboradores

### Guía del Costeo:
La `GUIA_SISTEMA_COSTEO.md` incluye:
- ✅ Tutorial paso a paso
- ✅ Ejemplo completo: Desayuno Sorpresa Premium
- ✅ Casos de uso prácticos
- ✅ Cómo ajustar precios
- ✅ Cómo cotizar pedidos grandes
- ✅ Mejores prácticas
- ✅ Preguntas frecuentes

## 🆕 CAMBIOS EN ESTA VERSIÓN

### Agregado:
✅ **Sistema de Costeo de Productos** (pestaña 💵 Costeo)
✅ Módulo `costeo.js` completamente funcional
✅ Colección `recetas` en Firebase
✅ Calculadora de producción para múltiples unidades
✅ Desglose detallado por insumo
✅ Análisis de márgenes de utilidad
✅ Guía completa del sistema de costeo

### Mantenido:
✅ Todas las funcionalidades anteriores
✅ Firebase Firestore configurado
✅ Sincronización en tiempo real
✅ Multi-dispositivo y multi-usuario
✅ Todas las demás secciones funcionando

### Eliminado:
❌ Archivos del servidor (.bat, .sh, servidor.py)
❌ Archivos de solución de problemas del servidor
❌ test-firebase.html

**Razón:** Ahora funciona directamente abriendo `index.html`

## 🎯 BENEFICIOS DEL SISTEMA DE COSTEO

### Para Ti:
✅ **Sabes exactamente** cuánto inviertes en cada producto
✅ **Ves claramente** tu ganancia real
✅ **Calculas rápido** para cualquier cantidad
✅ **Tomas decisiones** informadas sobre precios
✅ **No olvidas** ningún insumo
✅ **Estableces precios** justos y rentables

### Para tu Negocio:
✅ **Márgenes óptimos** (sistema recomienda ≥30%)
✅ **Control total** de costos
✅ **Profesionalismo** al cotizar
✅ **Escalabilidad** - calcula 1 o 1000 unidades
✅ **Rentabilidad garantizada**

## 💡 EJEMPLO PRÁCTICO

### Caso: 14 Camiones de Regalo

**1. Registras Insumos:**
- Cartón corrugado: $25.00/pieza
- Listón decorativo: $15.00/metro
- Dulces variados: $80.00/kg
- Papel decorado: $3.00/hoja
- Pegamento: $2.50/aplicación

**2. Creas Receta:**
- Nombre: "Camión de Regalo"
- Precio Venta: $150.00
- Insumos:
  - Cartón: 2 piezas
  - Listón: 1.5 metros
  - Dulces: 0.3 kg
  - Papel: 5 hojas
  - Pegamento: 1 aplicación

**3. Calculas para 14 unidades:**

### RESULTADO:

| Concepto | Por Unidad | Total (14) |
|----------|------------|------------|
| **Costo Producción** | $96.50 | $1,351.00 |
| **Precio Venta** | $150.00 | $2,100.00 |
| **Utilidad** | $53.50 | $749.00 |
| **Margen** | 35.7% | 35.7% |

### DESGLOSE POR INSUMO:
- Cartón: 28 piezas × $25 = $700.00
- Listón: 21 metros × $15 = $315.00
- Dulces: 4.2 kg × $80 = $336.00
- *(etc...)*

**Análisis:** Margen 35.7% = ✅ Excelente

## 🔧 CARACTERÍSTICAS TÉCNICAS

### Base de Datos:
- Firebase Firestore
- Sincronización en tiempo real
- 12 colecciones (incluye "recetas")
- Backup automático en la nube

### Seguridad:
- Credenciales en archivo separado
- .gitignore configurado
- Reglas de Firebase activas

### Compatibilidad:
- Chrome, Firefox, Safari, Edge
- Windows, Mac, Linux
- Dispositivos móviles

## 🆘 SOPORTE

### Problemas Comunes:

**Página en Blanco:**
- Abre consola (F12)
- Verifica conexión a internet
- Revisa errores en rojo

**No Sincroniza:**
- Confirma internet activo
- Verifica Firebase en Config (🟢)
- Ambos usuarios mismas credenciales

**No Encuentra Insumos:**
- Primero registra insumos en Inventario
- Luego crea recetas en Costeo

### Logs del Sistema:
Abre la consola (F12) para ver:
- ✅ Firebase inicializado
- 📥 Colecciones cargadas
- 💾 Datos sincronizados

## 🎉 ¡TODO LISTO!

Tu aplicación Jupeli está **completamente funcional** con:
- ✅ Firebase configurado
- ✅ Sistema de Costeo activo
- ✅ Todas las funcionalidades
- ✅ Documentación completa
- ✅ Sincronización en tiempo real

**Simplemente abre `index.html` y empieza a usar** 💪

---

**Proyecto:** Jupeli - Sistema de Gestión con Costeo
**Versión:** 3.1 Final
**Fecha:** Febrero 2025
**Desarrollado para:** Audik
**Características:** Firebase + Costeo + Multi-usuario
