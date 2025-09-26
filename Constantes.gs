/**
 * @file Constantes.gs
 * @description Almacena todas las constantes globales del proyecto para
 * centralizar la configuración.
 */

const C = Object.freeze({
  // --- NOMBRES DE HOJAS DE OPERACIÓN ---
  SHEET_ORDERS: "Orders",
  SHEET_SKU: "SKU",
  SHEET_ENVASADO: "Envasado",
  SHEET_ADQUISICION: "Adquisicion",
  SHEET_STOCK: "Stock",

  // --- NOMBRES Y FÓRMULAS DE HOJAS DE HISTORIAL ---
  SHEET_ADQUISICIONES_HISTORIAL: "Adquisiciones (historial)",
  SHEET_INVENTARIO_HISTORICO: "Inventario (histórico)",

  FORMULA_ADQUISICIONES: '=IMPORTRANGE("https://docs.google.com/spreadsheets/d/1vCZejbBPMh73nbAhdZNYFOlvJvRoMA7PVSCUiLl8MMQ","HISTORIAL_Adquisiciones!A:Z")',
  FORMULA_INVENTARIO: '=IMPORTRANGE("https://docs.google.com/spreadsheets/d/1G2VsuIfuaOWEmsPmJacmPuyFFUwq5WMKyE9p5Vrxysk","Inventario Histórico!A:Z")'
});