/**
 * @OnlyCurrentDoc
 *
 * El script principal para el sistema de operaciones de Santiago Natural.
 * Contiene las funciones de inicialización y las variables globales.
 */

// Constantes globales para los nombres de las hojas
const SHEET_ORDERS = "Orders";
const SHEET_SKU = "SKU";
const SHEET_ENVASADO = "Envasado";
const SHEET_ADQUISICION = "Adquisicion";
const SHEET_STOCK = "Stock";

/**
 * Función que se ejecuta cuando la hoja de cálculo se abre.
 * Se utiliza para añadir el menú personalizado a la UI.
 */
function onOpen() {
  crearMenu();
}