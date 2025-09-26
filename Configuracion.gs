/**
 * @file Configuracion.gs
 * @description Contiene las funciones para configurar la hoja de cálculo,
 * como la creación de las hojas necesarias.
 */

/**
 * Función principal para configurar o verificar la estructura de la hoja de cálculo.
 * Crea las hojas necesarias con sus encabezados si no existen.
 */
function configurarHojas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const hojas = [
    {
      nombre: SHEET_ORDERS,
      headers: ['Fecha', 'Cliente', 'Producto (NP)', 'Cantidad', 'Unidad Venta (UMV)', 'Precio', 'Estado']
    },
    {
      nombre: SHEET_SKU,
      headers: [
        'Nombre Producto (NP)', 'Producto Base (PB)', 'Cantidad Venta', 'Unidad Venta (UMV)',
        'Formato Adq.', 'Cantidad Adq.', 'Unidad Adq. (UMA)', 'Categoría', 'Proveedor',
        'Teléfono Prov.', 'UMPB', 'Merma%', 'Stock de Seguridad'
      ]
    },
    {
      nombre: SHEET_STOCK,
      headers: ['Producto Base (PB)', 'Stock Actual', 'Unidad (UMPB)', 'Fecha Snapshot']
    },
    {
      nombre: SHEET_ENVASADO,
      headers: ['Producto (NP)', 'Cantidad a Envasar', 'Unidad (UMV)']
    },
    {
      nombre: SHEET_ADQUISICION,
      headers: ['Producto Base (PB)', 'Demanda Neta', 'Lote de Compra', '# Lotes a Comprar', 'Total a Comprar', 'Unidad (UMPB)']
    }
  ];

  let hojasCreadas = [];
  let hojasExistentes = [];

  hojas.forEach(hojaInfo => {
    let hoja = ss.getSheetByName(hojaInfo.nombre);
    if (!hoja) {
      hoja = ss.insertSheet(hojaInfo.nombre);
      hojasCreadas.push(hojaInfo.nombre);

      const headerRange = hoja.getRange(1, 1, 1, hojaInfo.headers.length);
      headerRange.setValues([hojaInfo.headers]);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#DDEBF7');
      hoja.setFrozenRows(1);

      // Autoajustar columnas para mejor visualización
      for (let i = 1; i <= hojaInfo.headers.length; i++) {
        hoja.autoResizeColumn(i);
      }
    } else {
      hojasExistentes.push(hojaInfo.nombre);
    }
  });

  // Informar al usuario sobre el resultado
  let mensaje = '';
  if (hojasCreadas.length > 0) {
    mensaje += 'Hojas creadas: ' + hojasCreadas.join(', ') + '.\n\n';
  }
  if (hojasExistentes.length > 0) {
    mensaje += 'Hojas ya existentes: ' + hojasExistentes.join(', ') + '.';
  }

  ui.alert('Configuración completada', mensaje, ui.ButtonSet.OK);
}