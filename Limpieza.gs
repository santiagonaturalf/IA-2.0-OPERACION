/**
 * @file Limpieza.gs
 * @description Contiene funciones para limpiar las hojas de operación,
 * preparando el entorno para un nuevo día.
 */

/**
 * Orquesta la limpieza de todas las hojas operativas para el inicio de un nuevo día.
 * Limpia el contenido de Orders, Envasado y Adquisicion, conservando los encabezados.
 */
function limpiarHojasOperativas() {
  const ui = SpreadsheetApp.getUi();
  const hojasALimpiar = [SHEET_ORDERS, SHEET_ENVASADO, SHEET_ADQUISICION];

  let hojasLimpiadas = [];
  let hojasNoEncontradas = [];

  hojasALimpiar.forEach(nombreHoja => {
    const resultado = limpiarContenidoHoja(nombreHoja);
    if (resultado.exito) {
      hojasLimpiadas.push(nombreHoja);
    } else {
      // Si la hoja no se encuentra, no es un error crítico si es una de las generadas.
      if (resultado.mensaje.includes("no fue encontrada")) {
         hojasNoEncontradas.push(nombreHoja);
      }
    }
  });

  let mensajeFinal = "";
  if(hojasLimpiadas.length > 0) {
    mensajeFinal += 'Hojas limpiadas con éxito: ' + hojasLimpiadas.join(', ') + '.\n\n';
  }
  if(hojasNoEncontradas.length > 0) {
    // Es normal no encontrar Envasado y Adquisicion si no se ha corrido el cálculo.
    // Solo informamos que están listas para ser generadas.
    mensajeFinal += 'Las hojas ' + hojasNoEncontradas.join(', ') + ' están listas para ser generadas.';
  }

  ui.alert('Limpieza de Día Completada', mensajeFinal, ui.ButtonSet.OK);
}

/**
 * Limpia el contenido de una hoja específica, conservando la fila de encabezado.
 * @param {string} nombreHoja - El nombre de la hoja a limpiar.
 * @returns {{exito: boolean, mensaje: string}} - Objeto con el resultado de la operación.
 */
function limpiarContenidoHoja(nombreHoja) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(nombreHoja);

  if (sheet) {
    const ultimaFila = sheet.getLastRow();
    if (ultimaFila > 1) {
      // Borra desde la fila 2 hasta el final.
      sheet.getRange(2, 1, ultimaFila - 1, sheet.getLastColumn()).clearContent();
    }
    return { exito: true, mensaje: `La hoja "${nombreHoja}" fue limpiada.` };
  } else {
    return { exito: false, mensaje: `La hoja "${nombreHoja}" no fue encontrada.` };
  }
}