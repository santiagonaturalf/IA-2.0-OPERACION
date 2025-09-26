/**
 * @OnlyCurrentDoc
 *
 * El script principal para el sistema de operaciones de Santiago Natural.
 * Contiene las funciones de inicialización y la lógica de la interfaz de usuario.
 */

/**
 * Se ejecuta cuando la hoja de cálculo se abre.
 * Muestra la barra lateral y crea el menú personalizado.
 */
function onOpen() {
  showSidebar();
  crearMenu();
}

/**
 * Crea y muestra la barra lateral de la aplicación desde el archivo HTML.
 * Esta será la interfaz principal para el usuario.
 */
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Panel de Operaciones')
      .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Muestra una alerta en la UI. Esta función es llamada desde el JavaScript
 * del lado del cliente en la barra lateral para dar feedback al usuario.
 * @param {string} title - El título de la ventana de alerta.
 * @param {string} message - El mensaje a mostrar en la alerta.
 */
function showAlert(title, message) {
  SpreadsheetApp.getUi().alert(title, message, SpreadsheetApp.getUi().ButtonSet.OK);
}