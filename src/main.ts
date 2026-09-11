/* ============================================================================
   Punto de entrada. No contiene lógica propia: busca los tres elementos del
   HTML, arma el Controlador y lo arranca.
   ========================================================================== */

import "./estilos.css";
import { ControladorVisor } from "./controlador/ControladorVisor";

/** Busca un elemento obligatorio y falla con un mensaje claro si no está. */
function requerir<T extends Element>(selector: string): T {
  const elemento = document.querySelector<T>(selector);
  if (elemento === null) {
    throw new Error(`No se encontró "${selector}" en index.html`);
  }
  return elemento;
}

const listaEl = requerir<HTMLElement>("#lista-catalogo");
const lienzoEl = requerir<HTMLCanvasElement>("#lienzo-3d");
const descripcionEl = requerir<HTMLElement>("#descripcion-patron");

const controlador = new ControladorVisor(listaEl, lienzoEl, descripcionEl);
controlador.iniciar();

// TODO (Sesión 28): aquí va el registro del Service Worker.
// Hoy el manifest.json ya está listo, pero DevTools → Application marcará el
// Service Worker en rojo hasta la próxima sesión. Es intencional.
