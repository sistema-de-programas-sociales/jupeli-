# 💵 GUÍA: Sistema de Costeo de Productos

## 🎯 ¿Qué es el Sistema de Costeo?

El sistema de costeo te permite calcular exactamente cuánto te cuesta producir cada producto considerando todos los insumos necesarios, ver tu margen de utilidad y tomar decisiones informadas sobre precios.

## 📋 ¿Cómo Funciona?

### Conceptos Clave:

1. **Receta**: Es la "fórmula" de tu producto. Define qué insumos necesitas y en qué cantidades.

2. **Insumos**: Son los materiales que usas (tela, dulces, listones, cajas, etc.). Ya deben estar registrados en **Inventario → Insumos**.

3. **Costo de Producción**: Se calcula automáticamente multiplicando:
   - Cantidad de cada insumo × Costo unitario del insumo

4. **Margen de Utilidad**: Es el porcentaje de ganancia sobre el precio de venta.

## 🚀 Tutorial Paso a Paso

### Paso 1: Registrar tus Insumos (Una sola vez)

Antes de crear recetas, necesitas tener tus insumos en el sistema:

1. Ve a **Inventario → Insumos**
2. Clic en **➕ Nuevo Insumo**
3. Registra cada material que uses:
   - Nombre: "Listón rosa"
   - Categoría: "Listones"
   - Costo Unitario: $15.00
   - Unidad: metros
   - Stock actual: 50

**Ejemplo de insumos para camiones:**
- Cartón corrugado (50 × 30 cm) - $25.00/pieza
- Listón decorativo - $15.00/metro
- Dulces variados - $80.00/kg
- Papel decorado - $3.00/hoja
- Pegamento - $2.50/aplicación

### Paso 2: Crear una Receta

1. Ve a **💵 Costeo**
2. Clic en **➕ Nueva Receta**
3. Llena la información básica:
   - **Nombre**: "Camión de Regalo Mediano"
   - **Descripción**: "Camión decorado con dulces y listones"
   - **Precio de Venta**: $150.00

4. **Agregar Insumos**:
   - Clic en **➕ Agregar Insumo**
   - Selecciona "Cartón corrugado"
   - Cantidad: 2 (piezas)
   - Se calcula automáticamente: 2 × $25 = $50.00
   
   - Clic en **➕ Agregar Insumo**
   - Selecciona "Listón decorativo"
   - Cantidad: 1.5 (metros)
   - Se calcula automáticamente: 1.5 × $15 = $22.50
   
   - Clic en **➕ Agregar Insumo**
   - Selecciona "Dulces variados"
   - Cantidad: 0.3 (kg)
   - Se calcula automáticamente: 0.3 × $80 = $24.00
   
   (Y así con todos los insumos...)

5. **Ver Preview de Costos** (se actualiza automáticamente):
   - Costo de Producción: $96.50
   - Precio de Venta: $150.00
   - Utilidad: $53.50
   - Margen: 35.7% ✅

6. Clic en **➕ Crear Receta**

### Paso 3: Calcular para Múltiples Unidades

Una vez creada la receta, puedes calcular para cualquier cantidad:

1. En la tarjeta del producto, ve a "🧮 Calcular para:"
2. Ingresa la cantidad: **14** unidades
3. Clic en **Calcular**

**Te mostrará:**

#### Resumen General:
- **Costo por Unidad**: $96.50
- **Costo Total Producción**: $1,351.00 (para 14 camiones)
- **Precio Venta por Unidad**: $150.00
- **Ingreso Total Ventas**: $2,100.00
- **Utilidad por Unidad**: $53.50
- **Utilidad Total**: $749.00
- **Margen de Utilidad**: 35.7%

#### Desglose por Insumo:
```
┌─────────────────────┬──────────────┬──────────────┬───────────────┬──────────────┬─────────────┐
│ Insumo              │ Cant/Unidad  │ Cant Total   │ Costo Unit    │ Costo/Unidad │ Costo Total │
├─────────────────────┼──────────────┼──────────────┼───────────────┼──────────────┼─────────────┤
│ Cartón corrugado    │ 2 piezas     │ 28 piezas    │ $25.00/pieza  │ $50.00       │ $700.00     │
│ Listón decorativo   │ 1.5 metros   │ 21 metros    │ $15.00/metro  │ $22.50       │ $315.00     │
│ Dulces variados     │ 0.3 kg       │ 4.2 kg       │ $80.00/kg     │ $24.00       │ $336.00     │
└─────────────────────┴──────────────┴──────────────┴───────────────┴──────────────┴─────────────┘
```

#### Análisis:
- Invertirás **$1,351.00** en materiales
- Venderás por **$2,100.00**
- Tu ganancia neta será de **$749.00**
- Margen de utilidad: **35.7%** ✅ (Excelente)

## 📊 Interpretación de Márgenes

El sistema te indica automáticamente si tu margen es bueno:

- **≥ 30%** → 🟢 Excelente (recomendado)
- **20-29%** → 🟡 Aceptable
- **< 20%** → 🔴 Bajo (considera ajustar precios)

## 💡 Casos de Uso Prácticos

### Ejemplo 1: Ajustar Precio de Venta

Si tu margen es muy bajo:

**Receta Actual:**
- Costo: $96.50
- Precio Venta: $120.00
- Margen: **19.6%** 🔴

**Ajuste:**
1. Edita la receta
2. Cambia Precio de Venta a: $150.00
3. Nuevo margen: **35.7%** ✅

### Ejemplo 2: Cotizar un Pedido Grande

Cliente quiere 50 camiones:

1. Abre la receta
2. Calcula para: **50** unidades
3. Obtienes:
   - Inversión en materiales: $4,825.00
   - Ingreso por ventas: $7,500.00
   - Ganancia: $2,675.00

### Ejemplo 3: Comparar Productos

¿Cuál producto es más rentable?

**Camión Pequeño:**
- Costo: $50.00
- Venta: $80.00
- Utilidad: $30.00
- Margen: **37.5%**

**Camión Grande:**
- Costo: $120.00
- Venta: $180.00
- Utilidad: $60.00
- Margen: **33.3%**

**Análisis**: El pequeño tiene mejor margen (37.5%), pero el grande da más utilidad en pesos ($60 vs $30).

## 🔧 Funciones Disponibles

### En Cada Receta:

- **👁️ Ver Detalles**: Información completa de la receta
- **✏️ Editar**: Modificar insumos o precios
- **🗑️ Eliminar**: Borrar la receta
- **🧮 Calculadora**: Calcular para cualquier cantidad
- **📥 Exportar**: Imprimir o guardar cálculos

### Búsqueda:

Usa el campo de búsqueda para encontrar recetas rápidamente:
- Por nombre: "Camión"
- Por descripción: "Regalo mediano"

## ⚠️ Consideraciones Importantes

### 1. Mantén los Costos Actualizados

Si el precio de tus insumos cambia:

1. Ve a **Inventario → Insumos**
2. Edita el insumo
3. Actualiza el **Costo Unitario**
4. **Todas las recetas se actualizan automáticamente** ✅

### 2. Revisa el Stock

Antes de aceptar un pedido grande, verifica que tengas suficiente stock:

1. Calcula producción (ej: 50 unidades)
2. Revisa "Cantidad Total" de cada insumo
3. Compara con tu stock en **Inventario**

### 3. Considera Costos Adicionales

El sistema calcula **solo materiales directos**. Recuerda agregar mentalmente:

- Mano de obra
- Electricidad
- Transporte
- Empaque adicional
- Comisiones

**Recomendación**: Agrega 10-15% extra al costo para cubrir estos gastos.

## 📈 Mejores Prácticas

### 1. Crea Recetas para TODOS tus Productos

Aunque algunos parezcan obvios, tener todo documentado te ayuda a:
- Estandarizar producción
- Calcular inventario necesario
- Entrenar nuevo personal
- No olvidar ningún insumo

### 2. Usa Nombres Descriptivos

**❌ Mal**: "Camión 1", "Camión 2"
**✅ Bien**: "Camión Regalo Pequeño Rosa", "Camión Regalo Grande Azul"

### 3. Actualiza Precios Periódicamente

Revisa tus recetas cada 3-6 meses para asegurar que los precios sigan siendo rentables.

### 4. Experimenta con Diferentes Escenarios

Usa la calculadora para probar:
- ¿Y si hago 20 en lugar de 10?
- ¿Y si subo el precio $20?
- ¿Cuántas necesito vender para recuperar inversión?

## 🎓 Ejemplo Completo

### Caso: "Desayuno Sorpresa Premium"

**Paso 1**: Registrar insumos
- Charola decorativa - $35.00/pieza
- Frutas frescas - $60.00/kg
- Pan dulce - $5.00/pieza
- Jugo natural - $25.00/litro
- Tarjeta personalizada - $8.00/pieza
- Listón - $12.00/metro

**Paso 2**: Crear receta
- Nombre: "Desayuno Sorpresa Premium"
- Descripción: "Desayuno completo con frutas, pan y jugo"
- Precio Venta: $350.00

**Paso 3**: Agregar insumos
- Charola decorativa: 1 pieza = $35.00
- Frutas frescas: 0.5 kg = $30.00
- Pan dulce: 3 piezas = $15.00
- Jugo natural: 0.5 litros = $12.50
- Tarjeta: 1 pieza = $8.00
- Listón: 2 metros = $24.00

**Costo Total**: $124.50
**Precio Venta**: $350.00
**Utilidad**: $225.50
**Margen**: 64.4% ✅ ¡Excelente!

**Paso 4**: Pedido de 15 desayunos
- Inversión: $1,867.50
- Ingreso: $5,250.00
- Ganancia: $3,382.50

## 🆘 Preguntas Frecuentes

**P: ¿Puedo usar el mismo insumo en varias recetas?**
R: ¡Sí! Un insumo puede estar en múltiples recetas. Si actualizas su costo, se actualiza en todas.

**P: ¿Qué pasa si no tengo un insumo en el inventario?**
R: Primero debes registrarlo en **Inventario → Insumos**. Sin insumos no puedes crear recetas.

**P: ¿Puedo cambiar la cantidad de insumos después?**
R: Sí, edita la receta y ajusta las cantidades. Los costos se recalculan automáticamente.

**P: ¿Se guardan los cálculos?**
R: Los cálculos son en tiempo real y no se guardan. Pero puedes exportar a PDF o imprimir.

**P: ¿Cómo sincroniza con Firebase?**
R: Todas las recetas se guardan automáticamente en Firebase y se sincronizan entre todos tus dispositivos.

---

## 🎉 Conclusión

El sistema de costeo te da el poder de:
- ✅ Saber exactamente cuánto te cuesta cada producto
- ✅ Establecer precios justos y rentables
- ✅ Calcular rápidamente para cualquier cantidad
- ✅ Tomar decisiones informadas sobre tu negocio
- ✅ Maximizar tus ganancias

**¡Empieza ahora y toma control total de tus costos!** 💪

---

**Creado para:** Jupeli
**Versión:** 3.0 Firebase Cloud
**Fecha:** Febrero 2025
