/**
 * @file Constantes.gs
 * @description Almacena todas las constantes globales del proyecto para
 * centralizar la configuración.
 */

// --- NOMBRES DE HOJAS DE OPERACIÓN ---
const SHEET_ORDERS = "Orders";
const SHEET_SKU = "SKU";
const SHEET_ENVASADO = "Envasado";
const SHEET_ADQUISICION = "Adquisicion";
const SHEET_STOCK = "Stock";

// --- NOMBRES Y FÓRMULAS DE HOJAS DE HISTORIAL ---
const SHEET_ADQUISICIONES_HISTORIAL = "Adquisiciones (historial)";
const SHEET_INVENTARIO_HISTORICO = "Inventario (histórico)";

const FORMULA_ADQUISICIONES = '=IMPORTRANGE("https://docs.google.com/spreadsheets/d/1vCZejbBPMh73nbAhdZNYFOlvJvRoMA7PVSCUiLl8MMQ","HISTORIAL_Adquisiciones!A:Z")';
const FORMULA_INVENTARIO = '=IMPORTRANGE("https://docs.google.com/spreadsheets/d/1G2VsuIfuaOWEmsPmJacmPuyFFUwq5WMKyE9p5Vrxysk","Inventario Histórico!A:Z")';