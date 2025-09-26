/**
 * Gestiona las operaciones relacionadas con la hoja "Stock".
 * Esta hoja contiene el inventario actual de los Productos Base (PB).
 */

/**
 * Lee la hoja "Stock" y devuelve los niveles de inventario como un objeto.
 * Se asume que el stock ya está en la unidad canónica (UMPB).
 *
 * @returns {Object} Un objeto donde cada clave es un PB y el valor es la cantidad en stock.
 */
function obtenerStockActual() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_STOCK);

  if (!sheet) {
    SpreadsheetApp.getUi().alert(`La hoja de inventario "${SHEET_STOCK}" no fue encontrada. Se asumirá stock 0 para todos los productos.`);
    return {}; // Devuelve un objeto vacío si la hoja no existe
  }

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues(); // Asume 2 columnas: PB y Cantidad
  const stock = {};

  data.forEach(row => {
    const pb = row[0];
    const cantidad = parseFloat(row[1]);

    if (pb && !isNaN(cantidad)) {
      stock[pb] = cantidad;
    }
  });

  return stock;
}