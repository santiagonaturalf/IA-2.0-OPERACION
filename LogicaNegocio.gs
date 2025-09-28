/**
 * Contiene la lógica de negocio principal para procesar los pedidos
 * y generar las listas de envasado y adquisición.
 */

// Estados de pedido que se consideran para el procesamiento
const ESTADOS_INCLUIBLES = ["Procesando", "CONFIRMADO", "PEND_PAGO"]; // "Procesando" es el default de Shopify

/**
 * Orquesta todo el proceso de cálculo.
 * 1. Calcula la demanda de envasado (NP).
 * 2. Convierte a demanda de PB.
 * 3. Próximamente: Calcula la adquisición necesaria.
 */
function calcularTodo() {
  const skuMap = obtenerMapeoSKU();
  if (!skuMap) return;

  const demandaEnvasado = calcularDemandaEnvasado();
  if (!demandaEnvasado) return;

  escribirHojaEnvasado(demandaEnvasado);

  const demandaPB = calcularDemandaPB(demandaEnvasado, skuMap);
  if (!demandaPB) return;

  const stockActual = obtenerStockActual();

  const adquisicion = calcularAdquisicion(demandaPB, stockActual, skuMap);
  if (!adquisicion) return;

  escribirHojaAdquisicion(adquisicion);

  SpreadsheetApp.getUi().alert('Proceso completado. Las hojas "Envasado" y "Adquisicion" han sido generadas exitosamente.');
}

/**
 * Escribe la lista de adquisición calculada en la hoja "Adquisicion".
 *
 * @param {Object} adquisicion - El objeto con los datos de compra por PB.
 */
function escribirHojaAdquisicion(adquisicion) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(C.SHEET_ADQUISICION);

  if (!sheet) {
    sheet = ss.insertSheet(C.SHEET_ADQUISICION);
  }

  sheet.clear();
  const headers = [
    "Producto Base (PB)", "Demanda Bruta", "Stock Actual", "Demanda Neta",
    "Formato Compra", "Lote Compra", "Lotes a Comprar", "Total a Comprar", "Proveedor"
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");

  const data = Object.keys(adquisicion).map(pb => {
    const item = adquisicion[pb];
    return [
      pb,
      item.demandaBruta,
      item.stockActual,
      item.demandaNeta,
      item.formato,
      item.lote,
      item.lotesAComprar,
      item.totalAComprar,
      item.proveedor
    ];
  });

  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
    sheet.autoResizeColumns(1, headers.length);
  }
}

/**
 * Calcula la lista de adquisición necesaria basándose en la demanda de PB,
 * el stock actual y la información de lotes de compra del SKU.
 *
 * @param {Object} demandaPB - La demanda bruta para cada Producto Base.
 * @param {Object} stockActual - El inventario actual para cada Producto Base.
 * @param {Object} skuMap - El mapa de conversión de la hoja SKU.
 * @returns {Object} Un objeto con la información de compra para cada PB.
 */
function calcularAdquisicion(demandaPB, stockActual, skuMap) {
  const adquisicion = {};

  // Necesitamos un mapa inverso de PB a una de sus filas de SKU para obtener info de compra.
  const pbInfoMap = {};
  for (const np in skuMap) {
    const skuInfo = skuMap[np];
    const pb = skuInfo["Producto Base (PB)"];
    if (!pbInfoMap[pb]) {
      pbInfoMap[pb] = skuInfo;
    }
  }

  for (const pb in demandaPB) {
    const demandaBruta = demandaPB[pb];

    // Normalizar el nombre del producto para la búsqueda en el Map de stock.
    const pbNormalizado = String(pb).trim().toLowerCase();
    const stockInfo = stockActual.get(pbNormalizado);
    const stock = stockInfo ? stockInfo.stock : 0; // Obtener el valor de stock del objeto.

    // D_PB_neto = max(0, D_PB - Stock)
    // Se omite merma y stock de seguridad por ahora.
    const demandaNeta = Math.max(0, demandaBruta - stock);

    if (demandaNeta > 0) {
      const infoCompra = pbInfoMap[pb];
      if (infoCompra) {
        const loteCompra = parseFloat(infoCompra["Cantidad Adq."]);
        // Aquí debería ir la conversión de UMA a UMPB. Asumimos 1 por ahora.

        if (!isNaN(loteCompra) && loteCompra > 0) {
          // #Lotes = CEIL(DemandaNeta / Lote)
          const numLotes = Math.ceil(demandaNeta / loteCompra);
          const compraTotal = numLotes * loteCompra;

          adquisicion[pb] = {
            demandaBruta: demandaBruta,
            stockActual: stock,
            demandaNeta: demandaNeta,
            lote: loteCompra,
            lotesAComprar: numLotes,
            totalAComprar: compraTotal,
            formato: infoCompra["Formato Adq."],
            proveedor: infoCompra["Proveedor"],
          };
        }
      }
    }
  }

  return adquisicion;
}

/**
 * Convierte la demanda de productos de envasado (NP) en demanda de productos base (PB).
 *
 * @param {Object} demandaEnvasado - Objeto con la demanda por NP.
 * @param {Object} skuMap - El mapa de conversión de la hoja SKU.
 * @returns {Object} Un objeto donde cada clave es un PB y el valor es la demanda bruta total.
 */
function calcularDemandaPB(demandaEnvasado, skuMap) {
  const demandaPB = {};

  for (const np in demandaEnvasado) {
    if (skuMap[np]) {
      const q_np = demandaEnvasado[np];
      const skuInfo = skuMap[np];

      const pb = skuInfo["Producto Base (PB)"];
      const cantidadVenta = parseFloat(skuInfo["Cantidad Venta"]);

      // Aquí se debería incluir la lógica de conversión de unidades (conv(UMV -> UMPB))
      // Por ahora, asumimos factor de conversión 1.
      const factorConsumo = cantidadVenta;

      if (pb && !isNaN(factorConsumo)) {
        if (demandaPB[pb]) {
          demandaPB[pb] += q_np * factorConsumo;
        } else {
          demandaPB[pb] = q_np * factorConsumo;
        }
      }
    } else {
      // Registrar o alertar sobre NP que no tienen un mapeo en SKU
      Logger.log(`El producto "${np}" no se encontró en la hoja SKU.`);
    }
  }

  return demandaPB;
}

/**
 * Lee la hoja "Orders", filtra los pedidos activos y calcula la cantidad total
 * necesaria para cada "Nombre Producto" (NP).
 *
 * @returns {Object} Un objeto donde cada clave es un NP y el valor es la cantidad total.
 */
function calcularDemandaEnvasado() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(C.SHEET_ORDERS);

  if (!sheet) {
    SpreadsheetApp.getUi().alert(`La hoja "${C.SHEET_ORDERS}" no fue encontrada.`);
    return null;
  }

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  const colIndexNombreProducto = headers.indexOf("Nombre Producto");
  const colIndexCantidad = headers.indexOf("Cantidad");
  const colIndexEstado = headers.indexOf("Estado");

  if (colIndexNombreProducto === -1 || colIndexCantidad === -1 || colIndexEstado === -1) {
    SpreadsheetApp.getUi().alert('Faltan columnas esenciales en la hoja "Orders": "Nombre Producto", "Cantidad" o "Estado".');
    return null;
  }

  const demandaNP = {};

  data.forEach(row => {
    const estado = row[colIndexEstado];

    // Incluir solo si el estado es válido y la fila no está vacía
    if (ESTADOS_INCLUIBLES.includes(estado.trim()) && row[colIndexNombreProducto]) {
      const np = row[colIndexNombreProducto];
      const cantidad = parseFloat(row[colIndexCantidad]);

      if (!isNaN(cantidad)) {
        if (demandaNP[np]) {
          demandaNP[np] += cantidad;
        } else {
          demandaNP[np] = cantidad;
        }
      }
    }
  });

  return demandaNP;
}

/**
 * Escribe los resultados de la demanda de envasado en la hoja "Envasado".
 * Limpia la hoja antes de escribir los nuevos datos.
 *
 * @param {Object} demandaEnvasado - Objeto con la demanda por NP.
 */
function escribirHojaEnvasado(demandaEnvasado) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(C.SHEET_ENVASADO);

  if (!sheet) {
    sheet = ss.insertSheet(C.SHEET_ENVASADO);
  }

  // Limpiar hoja
  sheet.clear();

  // Escribir encabezados
  const headers = ["Producto a Envasar (NP)", "Cantidad Total"];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");

  // Escribir datos
  const data = Object.keys(demandaEnvasado).map(np => [np, demandaEnvasado[np]]);

  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
    sheet.autoResizeColumns(1, 2);
  }
}