/**
 * Crea el menú personalizado "SantiagoNatural" en la UI de Google Sheets.
 */
function crearMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('SantiagoNatural')
      .addItem('Iniciar día', 'iniciarDiaOperativo')
      .addSeparator()
      .addItem('Generar Listas', 'calcularTodo')
      .addToUi();
}

/**
 * Función que se ejecuta al presionar "Iniciar día".
 * Llama a la función para limpiar la hoja de pedidos.
 */
function iniciarDiaOperativo() {
  limpiarHojaOrders();
  SpreadsheetApp.getUi().alert('Día iniciado. La hoja de "Orders" ha sido limpiada.');
}