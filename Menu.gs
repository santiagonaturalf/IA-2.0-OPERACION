/**
 * Crea el menú personalizado "SantiagoNatural" en la UI de Google Sheets.
 * Con la barra lateral como UI principal, el menú se simplifica para solo
 * ofrecer una forma de reabrir la barra si se cierra.
 */
function crearMenu() {
  SpreadsheetApp.getUi()
      .createMenu('Panel de Operaciones')
      .addItem('Mostrar Panel', 'showSidebar')
      .addSeparator()
      .addItem('🛠️ Configurar Hojas', 'configurarHojas')
      .addToUi();
}