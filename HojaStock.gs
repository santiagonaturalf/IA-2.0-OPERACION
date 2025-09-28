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