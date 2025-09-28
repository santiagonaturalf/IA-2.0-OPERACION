function onOpen() {
  const ui = SpreadsheetApp.getUi();
  try {
    ui.createMenu('Panel de Operaciones')
      .addItem('Limpiar día anterior',        'limpiarDiaAnterior')
      .addItem('Generar Lista de Adquisiciones','generarListasAdquisiciones')
      .addItem('Generar Lista de Envasado',    'generarListaEnvasado')
      .addSeparator()
      .addItem('Mostrar Panel',                'mostrarPanelOperaciones')
      .addSeparator()
      .addItem('🛠️ Configurar Hojas', 'configurarHojas')
      .addToUi();

    // Abre el panel lateral al cargar
    // Se comenta para evitar errores de permisos en el trigger onOpen.
    // El usuario puede abrirlo desde el menú.
    // mostrarPanelOperaciones();
  } catch (e) {
    SpreadsheetApp.getActive().toast('Error al iniciar menú/panel: ' + e.message, 'CRÍTICO', 8);
    throw e;
  }
}

function mostrarPanelOperaciones() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Panel de Operaciones')
    .setWidth(320);
  SpreadsheetApp.getUi().showSidebar(html);
}

// Acciones que invoca el panel
function generarListasAdquisiciones() {
  // Validación dura de stock (ABORTAR si falla)
  validarStockYAbortarSiNoCumple({ minProductos: 10, maxHoras: 48 });
  const stock = obtenerStockActual();          // ya validado arriba
  calcularTodo();                              // si calcularTodo usa obtenerStockActual internamente, déjalo así
}

function generarListaEnvasado() {
  const demanda = calcularDemandaEnvasado();
  if (!demanda) return;
  escribirHojaEnvasado(demanda);
  SpreadsheetApp.getActive().toast('Lista de Envasado generada', 'OK', 5);
}

// Ejemplo placeholder, para que el menú no falle si aún no la tienen
function limpiarDiaAnterior() {
  SpreadsheetApp.getActive().toast('Limpieza ejecutada (placeholder).', 'Info', 4);
}