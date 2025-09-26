/**
 * Crea el menú personalizado "SantiagoNatural" en la UI de Google Sheets.
 */
function crearMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('SantiagoNatural')
      .addSubMenu(ui.createMenu('Configuración')
          .addItem('Verificar Hojas de Operación', 'configurarHojas')
          .addItem('Configurar Hojas de Historial', 'configurarImportesHistoricos'))
      .addSeparator()
      .addItem('1. Iniciar día (Limpiar Orders)', 'iniciarDiaOperativo')
      .addItem('2. Generar Listas de Envasado y Adquisición', 'calcularTodo')
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