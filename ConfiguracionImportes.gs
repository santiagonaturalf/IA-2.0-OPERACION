/**
 * @file ConfiguracionImportes.gs
 * @description Contiene la lógica para configurar las hojas de importación de datos históricos.
 */

const SHEET_ADQUISICIONES_HISTORIAL = "Adquisiciones (historial)";
const SHEET_INVENTARIO_HISTORICO = "Inventario (histórico)";

const FORMULA_ADQUISICIONES = '=IMPORTRANGE("https://docs.google.com/spreadsheets/d/1vCZejbBPMh73nbAhdZNYFOlvJvRoMA7PVSCUiLl8MMQ","HISTORIAL_Adquisiciones!A:Z")';
const FORMULA_INVENTARIO = '=IMPORTRANGE("https://docs.google.com/spreadsheets/d/1G2VsuIfuaOWEmsPmJacmPuyFFUwq5WMKyE9p5Vrxysk","Inventario Histórico!A:Z")';

/**
 * Crea y configura las hojas para importar datos históricos desde otras hojas de cálculo.
 * Si las hojas ya existen, no hace nada.
 */
function configurarImportesHistoricos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const hojas = [
    {
      nombre: SHEET_ADQUISICIONES_HISTORIAL,
      formula: FORMULA_ADQUISICIONES
    },
    {
      nombre: SHEET_INVENTARIO_HISTORICO,
      formula: FORMULA_INVENTARIO
    }
  ];

  let hojasCreadas = [];
  let hojasExistentes = [];

  hojas.forEach(info => {
    let hoja = ss.getSheetByName(info.nombre);
    if (!hoja) {
      hoja = ss.insertSheet(info.nombre);
      hoja.getRange("A1").setFormula(info.formula);
      hoja.hideSheet();
      hojasCreadas.push(info.nombre);
    } else {
      hojasExistentes.push(info.nombre);
    }
  });

  let mensaje = '';
  if (hojasCreadas.length > 0) {
    mensaje += 'Hojas de historial creadas y configuradas: ' + hojasCreadas.join(', ') + '.\n\n';
  }
  if (hojasExistentes.length > 0) {
    mensaje += 'Hojas de historial ya existentes: ' + hojasExistentes.join(', ') + '.';
  }

  if (mensaje) {
    ui.alert('Configuración de Históricos', mensaje, ui.ButtonSet.OK);
  } else {
    ui.alert('Configuración de Históricos', 'No se realizaron cambios.', ui.ButtonSet.OK);
  }
}