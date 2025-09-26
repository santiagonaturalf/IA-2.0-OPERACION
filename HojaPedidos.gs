/**
 * Gestiona las operaciones relacionadas con la hoja "Orders".
 */

/**
 * Limpia la hoja "Orders" para el inicio del día.
 * Borra todos los datos excepto la primera fila de encabezados.
 */
function limpiarHojaOrders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_ORDERS);

  if (sheet) {
    // Obtiene el rango de datos, excluyendo la primera fila (encabezados)
    const range = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn());
    // Limpia el contenido del rango
    if (sheet.getLastRow() > 1) {
       range.clearContent();
    }
  } else {
    SpreadsheetApp.getUi().alert(`La hoja "${SHEET_ORDERS}" no fue encontrada.`);
  }
}