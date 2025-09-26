/**
 * Gestiona las operaciones y la lógica de negocio relacionadas con la hoja "SKU".
 * Esta hoja contiene el mapeo entre los productos de venta (NP) y los productos base (PB).
 */

/**
 * Obtiene los datos de la hoja SKU y los devuelve como un objeto para fácil acceso.
 * La clave del objeto será el 'Nombre Producto' (NP) para una búsqueda eficiente.
 *
 * @returns {Object} Un objeto donde cada clave es un NP y el valor es un objeto con los datos de esa fila.
 */
function obtenerMapeoSKU() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_SKU);

  if (!sheet) {
    SpreadsheetApp.getUi().alert(`La hoja "${SHEET_SKU}" no fue encontrada.`);
    return null;
  }

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  const skuMap = {};

  data.forEach(row => {
    const np = row[headers.indexOf("Nombre Producto (NP)")];
    if (np) {
      skuMap[np] = {};
      headers.forEach((header, index) => {
        skuMap[np][header] = row[index];
      });
    }
  });

  return skuMap;
}