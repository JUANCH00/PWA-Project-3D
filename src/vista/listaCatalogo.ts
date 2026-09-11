/* ============================================================================
   CAPA DE VISTA — La lista lateral del catálogo.

   Fíjate en que NO importa PatronArquitectura de dominio/. La regla de la
   arquitectura en capas dice que la vista y el modelo no se conocen entre sí,
   así que la vista declara aquí la forma mínima que necesita recibir, y es el
   Controlador quien traduce del modelo a esta forma.
   ========================================================================== */

/** Lo mínimo que la lista necesita saber de un patrón para pintarlo. */
export interface ItemCatalogo {
  id: string;
  nombre: string;
  categoria: string;
}

export class ListaCatalogo {
  private contenedor: HTMLElement;
  private alSeleccionar: (id: string) => void;

  constructor(contenedor: HTMLElement, alSeleccionar: (id: string) => void) {
    this.contenedor = contenedor;
    this.alSeleccionar = alSeleccionar;
  }

  pintar(items: ItemCatalogo[]): void {
    this.contenedor.replaceChildren();

    items.forEach((item) => {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "item-catalogo";
      boton.dataset.id = item.id;

      const nombre = document.createElement("span");
      nombre.className = "item-nombre";
      nombre.textContent = item.nombre;

      const categoria = document.createElement("span");
      categoria.className = `item-categoria cat-${item.categoria}`;
      categoria.textContent = item.categoria;

      boton.append(nombre, categoria);
      boton.addEventListener("click", () => this.alSeleccionar(item.id));

      this.contenedor.appendChild(boton);
    });
  }

  marcarSeleccionado(id: string): void {
    this.contenedor.querySelectorAll<HTMLElement>(".item-catalogo").forEach((boton) => {
      boton.classList.toggle("activo", boton.dataset.id === id);
    });
  }
}
