/* ============================================================================
   CAPA DE DOMINIO — Qué es un patrón de arquitectura.

   Esta capa es la más baja de todas: no importa nada de ninguna otra capa.
   No sabe que existe una pantalla, ni Three.js, ni el navegador. Solo define
   el vocabulario del proyecto.
   ========================================================================== */

/** Las tres familias en las que agrupamos el catálogo. */
export type CategoriaPatron = "estructural" | "distribuida" | "datos";

export interface PatronArquitectura {
  id: string;
  nombre: string;
  categoria: CategoriaPatron;
  descripcion: string;
}
