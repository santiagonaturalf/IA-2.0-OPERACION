/**
 * @file Configuracion.gs
 * @description Contiene las funciones para configurar la hoja de cálculo,
 * como la creación de las hojas necesarias.
 */

/**
 * Función principal para configurar o verificar la estructura de la hoja de cálculo.
 * Crea las hojas de operación y las de historial si no existen.
 */
function configurarHojas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  let mensajes = [];

  // Configurar hojas de operación
  const { creadas: opCreadas, existentes: opExistentes } = configurarHojasOperacion(ss);
  if (opCreadas.length > 0) mensajes.push('Hojas de operación creadas: ' + opCreadas.join(', ') + '.');
  if (opExistentes.length > 0) mensajes.push('Hojas de operación ya existentes: ' + opExistentes.join(', ') + '.');

  // Configurar hojas de historial
  const { creadas: histCreadas, existentes: histExistentes } = configurarHojasHistorial(ss);
  if (histCreadas.length > 0) mensajes.push('Hojas de historial creadas y ocultadas: ' + histCreadas.join(', ') + '.');
  if (histExistentes.length > 0) mensajes.push('Hojas de historial ya existentes: ' + histExistentes.join(', ') + '.');

  // Informar al usuario sobre el resultado
  if (mensajes.length > 0) {
    ui.alert('Resultado de la Configuración', mensajes.join('\n\n'), ui.ButtonSet.OK);
  } else {
    ui.alert('Configuración', 'No se realizaron cambios.', ui.ButtonSet.OK);
  }
}

/**
 * Crea y formatea las hojas de operación diaria.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss - La hoja de cálculo activa.
 * @returns {{creadas: string[], existentes: string[]}} - Nombres de las hojas creadas y existentes.
 */
function configurarHojasOperacion(ss) {
  const hojas = [
    { nombre: SHEET_ORDERS, headers: ['Fecha', 'Cliente', 'Producto (NP)', 'Cantidad', 'Unidad Venta (UMV)', 'Precio', 'Estado'] },
    { nombre: SHEET_SKU, headers: ['Nombre Producto (NP)', 'Producto Base (PB)', 'Cantidad Venta', 'Unidad Venta (UMV)', 'Formato Adq.', 'Cantidad Adq.', 'Unidad Adq. (UMA)', 'Categoría', 'Proveedor', 'Teléfono Prov.', 'UMPB', 'Merma%', 'Stock de Seguridad'] },
    { nombre: SHEET_STOCK, headers: ['Producto Base (PB)', 'Stock Actual', 'Unidad (UMPB)', 'Fecha Snapshot'] },
    { nombre: SHEET_ENVASADO, headers: ['Producto (NP)', 'Cantidad a Envasar', 'Unidad (UMV)'] },
    { nombre: SHEET_ADQUISICION, headers: ['Producto Base (PB)', 'Demanda Neta', 'Lote de Compra', '# Lotes a Comprar', 'Total a Comprar', 'Unidad (UMPB)'] }
  ];

  let creadas = [];
  let existentes = [];

  hojas.forEach(hojaInfo => {
    let hoja = ss.getSheetByName(hojaInfo.nombre);
    if (!hoja) {
      hoja = ss.insertSheet(hojaInfo.nombre);
      creadas.push(hojaInfo.nombre);

      const headerRange = hoja.getRange(1, 1, 1, hojaInfo.headers.length);
      headerRange.setValues([hojaInfo.headers]).setFontWeight('bold').setBackground('#DDEBF7');
      hoja.setFrozenRows(1);
      hoja.getRange("A:Z").setNumberFormat("@"); // Formato de texto para evitar problemas con números

      for (let i = 1; i <= hojaInfo.headers.length; i++) hoja.autoResizeColumn(i);
    } else {
      existentes.push(hojaInfo.nombre);
    }
  });

  return { creadas, existentes };
}

/**
 * Crea y configura las hojas para importar datos históricos.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss - La hoja de cálculo activa.
 * @returns {{creadas: string[], existentes: string[]}} - Nombres de las hojas creadas y existentes.
 */
function configurarHojasHistorial(ss) {
  const hojas = [
    { nombre: SHEET_ADQUISICIONES_HISTORIAL, formula: FORMULA_ADQUISICIONES },
    { nombre: SHEET_INVENTARIO_HISTORICO, formula: FORMULA_INVENTARIO }
  ];

  let creadas = [];
  let existentes = [];

  hojas.forEach(info => {
    let hoja = ss.getSheetByName(info.nombre);
    if (!hoja) {
      hoja = ss.insertSheet(info.nombre);
      hoja.getRange("A1").setFormula(info.formula);
      hoja.hideSheet();
      creadas.push(info.nombre);
    } else {
      existentes.push(info.nombre);
    }
  });

  return { creadas, existentes };
}