# IA-2.0-OPERACION

Aquí tienes una descripción exhaustiva y operativa de la matemática interna del proyecto y, en especial, de la hoja SKU. Está escrita para guiar el desarrollo de Apps Script y para que cualquiera del equipo entienda qué se calcula, por qué y cómo — sin dashboards, 100% operación diaria.

## 1) Diccionario mínimo de términos

- **NP**: Nombre Producto (lo que ve el cliente y figura en Orders).
- **PB**: Producto Base (materia prima real que se compra y descuenta de inventario).
- **UMV**: Unidad de venta del NP (p. ej., kg, unidad, 0,5 kg).
- **UMA**: Unidad de adquisición del PB (p. ej., bandeja 6,5 kg, caja 12 kg, bolsa 1 kg).
- **UMPB**: Unidad canónica de control de cada PB (normalmente kg o unidad).
- **Stock(PB)**: Stock disponible hoy del PB (traído por IMPORTRANGE y snapshoteado).
- **Orden**: una línea del archivo diario (cada línea es un NP con su cantidad).
- **Día operativo**: todo lo que se carga hoy se produce y distribuye hoy, salvo líneas anuladas manualmente.

## 2) Conjunto de datos “activos” del día

Partimos del conjunto de líneas importadas L (cada una es un NP con su cantidad).

### Normalización de estados
Se procesan los pedidos según su estado:
- **Pedidos Incluidos**: Aquellos con estado "CONFIRMADO" o "PEND_PAGO".
- **Pedidos Excluidos**: Aquellos con estado "CANCELADO" o "EXTRACCION".

### Conjunto operativo
$L^{*} = \{ \ell \in L \mid s(\ell) \text{ es un estado incluido} \}$

**Regla práctica**: por defecto procesamos todo lo importado. Si el usuario elimina o marca un pedido como excluido después de la carga, la línea sale de $L^{*}$ y se recalcula todo.

## 3) Demanda de Envasado (por NP)

Para cada NP:
$Q_{NP} = \sum_{\ell \in L^{*} \text{ con NP}} \text{Cantidad}(\ell)$

- Si la UMV es kg, $Q_{NP}$ puede ser decimal (ej.: 0,5).
- Si la UMV es unidad, $Q_{NP}$ es entero.

La lista de envasado del día es simplemente la tabla $\{(NP, Q_{NP})\}$, ordenada por categoría/NP.

## 4) Conversión NP → PB (matemática núcleo)

La hoja SKU provee el mapa de conversión. Para cada fila SKU:

- **Nombre Producto (NP)**
- **Producto Base (PB)**
- **Cantidad Venta y Unidad Venta (UMV)**
- **Formato Adq. / Cantidad Adq. / Unidad Adq. (UMA)**

### 4.1 Unidad canónica por PB (UMPB)
Cada PB trabaja en una unidad canónica (UMPB), generalmente **kg** o **unidad**.

### 4.2 Factor de consumo de NP en PB
$f_{NP \to PB} = \text{CantidadVenta} \times \text{conv}(\text{UMV} \to \text{UMPB})$

- Si UMV y UMPB son la misma unidad → `conv = 1`.
- Ejemplo: “Frutillón 0,5 kg” (UMV=kg, UMPB=kg) ⇒ $f = 0,5$ kg de frutilla.

### 4.3 Demanda de PB agregada
Sea $N(PB)$ el conjunto de NP que usan ese PB. Entonces:
$D_{PB} = \sum_{NP \in N(PB)} (Q_{NP} \times f_{NP \to PB})$

## 5) Ajustes por inventario, merma y seguridad

Partimos del snapshot de inventario: $Stock(PB)$ en UMPB.

- **Merma% por PB**: $m(PB) \in [0, 1]$
- **Stock de seguridad por PB**: $SS(PB) \ge 0$

### 5.1 Demanda neta de PB
$D_{PB}^{\text{neto}} = \max(0, D_{PB} \cdot (1 + m(PB)) + SS(PB) - Stock(PB))$

Si no usamos merma/seguridad, se asumen en 0.

## 6) Matemática de Adquisición Base (cómo comprar)

SKU define el lote de compra por PB:
$Lote(PB) = \text{CantidadAdq}(PB) \times \text{conv}(\text{UMA} \to \text{UMPB})$

Entonces, con la demanda neta del PB:
- **#Lotes(PB)** = $\lceil \frac{D_{PB}^{\text{neto}}}{Lote(PB)} \rceil$ (redondeo hacia arriba - CEILING)
- **CompraTotal(PB)** = `#Lotes(PB) \times Lote(PB)`

## 7) Flujo diario de operaciones

1.  **Carga de Orders**: Se pegan los datos del día.
2.  **Lista de Envasado**: Se calculan los $Q_{NP}$ para todos los pedidos activos.
3.  **Conversión a PB**: Se calcula la demanda bruta $D_{PB}$ usando SKU.
4.  **Inventario**: Se obtiene el snapshot de $Stock(PB)$.
5.  **Adquisición Base**: Se calcula la demanda neta $D_{PB}^{\text{neto}}$ y se determina la compra (#Lotes).
6.  **Órdenes de ruta**: Toman la lista de envasado y las direcciones.

Todo es diario: al iniciar el día siguiente, se limpian hojas temporales y se recomienza.

## 8) La hoja SKU: campos clave

- **Obligatorias**: `Nombre Producto (NP)`, `Producto Base (PB)`, `Cantidad Venta`, `Unidad Venta (UMV)`, `Formato Adq.`, `Cantidad Adq.`, `Unidad Adq. (UMA)`.
- **Opcionales**: `Categoría`, `Proveedor`, `Teléfono Prov.`, `UMPB`, `Merma%`, `Stock de Seguridad`.

## 9) Resumen de fórmulas clave (todas en UMPB)

- **Envasado por NP**: $Q_{NP} = \sum \text{Cantidades activas}$
- **Demanda bruta PB**: $D_{PB} = \sum (Q_{NP} \cdot f_{NP \to PB})$
- **Demanda neta PB**: $D_{PB}^{\text{neto}} = \max(0, D_{PB}(1+m) + SS - Stock)$
- **Compra por lotes**: `#Lotes = \lceil D_{PB}^{\text{neto}} / Lote(PB) \rceil`