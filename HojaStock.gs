function validarStockYAbortarSiNoCumple({ minProductos = 10, maxHoras = 48 } = {}) {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(C.SHEET_STOCK);
  if (!sh) throw new Error(`No existe la hoja "${C.SHEET_STOCK}".`);
  if (sh.getLastRow() <= 1) throw new Error(`"${C.SHEET_STOCK}" está VACÍA.`);

  const values = sh.getRange(2,1, sh.getLastRow()-1, 4).getValues(); // A:D
  const setP = new Set();
  let masReciente = null;

  for (const [prod, , , ts] of values) {
    const p = String(prod||'').trim();
    if (p) setP.add(p);
    const f = ts instanceof Date ? ts : (ts ? new Date(ts) : null);
    if (f && (!masReciente || f > masReciente)) masReciente = f;
  }
  if (setP.size < minProductos) throw new Error(`Stock insuficiente: ${setP.size} productos (<${minProductos}).`);
  if (!masReciente) throw new Error(`Stock sin fecha válida (col D).`);
  const horas = (Date.now() - masReciente.getTime())/36e5;
  if (horas > maxHoras) throw new Error(`Snapshot de Stock desactualizado: ${horas.toFixed(1)}h (>${maxHoras}h).`);
}

function obtenerStockActual() {
  // Asume que validarStockYAbortarSiNoCumple() ya se llamó antes
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(C.SHEET_STOCK);
  const rows = sh.getLastRow()-1;
  const values = sh.getRange(2,1, rows, 4).getValues();

  const mapa = new Map();
  for (const [producto, stock, unidad, ts] of values) {
    const key = String(producto||'').trim();
    if (!key) continue;
    mapa.set(key.toLowerCase(), {
      producto: key,
      stock: Number(stock||0),
      unidad: unidad||'',
      ts: ts||null,
    });
  }
  return mapa;
}

/**
 * @description Repara y establece los encabezados y fórmulas en la hoja "Stock".
 * Utiliza setFormula() con la sintaxis específica del usuario: funciones en inglés y separadores de punto y coma.
 */
function repararFormulasStock() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const stockSheet = ss.getSheetByName(C.SHEET_STOCK);

  if (!stockSheet) {
    console.error(`No se encontró la hoja "${C.SHEET_STOCK}".`);
    return;
  }

  // Definir encabezados
  const headers = [
    ["Producto Base (PB)", "Stock Actual", "Unidad", "Fecha Snapshot"]
  ];

  // --- FÓRMULAS (Sintaxis específica: inglés y punto y coma) ---
  const formulaA2 = `=SORT(UNIQUE(FILTER('${C.SHEET_SKU}'!B2:B; LEN('${C.SHEET_SKU}'!B2:B)>0)))`;
  const lookupTableFormula = `SORTN(SORT(HSTACK('${C.SHEET_INVENTARIO_HISTORICO}'!B2:D; '${C.SHEET_INVENTARIO_HISTORICO}'!A2:A); 4; FALSE); 9^9; 2; 1; TRUE)`;
  const formulaB2 = `=MAP(A2:A; LAMBDA(producto; IF(ISBLANK(producto);; IFERROR(VLOOKUP(producto; ${lookupTableFormula}; 2; FALSE)))))`;
  const formulaC2 = `=MAP(A2:A; LAMBDA(producto; IF(ISBLANK(producto);; IFERROR(VLOOKUP(producto; ${lookupTableFormula}; 3; FALSE)))))`;
  const formulaD2 = `=MAP(A2:A; LAMBDA(producto; IF(ISBLANK(producto);; IFERROR(VLOOKUP(producto; ${lookupTableFormula}; 4; FALSE)))))`;

  // --- EJECUCIÓN ---
  // 1. Limpiar el rango de datos para evitar valores residuales.
  stockSheet.getRange("A2:D" + stockSheet.getMaxRows()).clearContent();

  // 2. Establecer los encabezados correctos en la fila 1.
  stockSheet.getRange("A1:D1").setValues(headers);

  // 3. Escribir las fórmulas en las celdas correspondientes.
  stockSheet.getRange("A2").setFormula(formulaA2);
  stockSheet.getRange("B2").setFormula(formulaB2);
  stockSheet.getRange("C2").setFormula(formulaC2);
  stockSheet.getRange("D2").setFormula(formulaD2);
}