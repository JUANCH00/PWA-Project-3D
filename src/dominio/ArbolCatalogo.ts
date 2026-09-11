/* ============================================================================
   CAPA DE DOMINIO — El catálogo como árbol binario de búsqueda (ABB).

   Los patrones se guardan ordenados alfabéticamente por nombre: en cada nodo,
   todo lo menor va a la izquierda y todo lo mayor a la derecha. Eso nos da
   dos cosas gratis:

     1. buscar(nombre) baja por una sola rama en vez de revisar los 8 elementos;
     2. enOrden() devuelve el catálogo YA alfabetizado, sin ordenar nada a mano.

   El árbol es, además, uno de los 8 patrones que el propio catálogo muestra
   en 3D: el proyecto se enseña a sí mismo.
   ========================================================================== */

import type { PatronArquitectura } from "./PatronArquitectura";

/** Un nodo del árbol: un patrón y, como máximo, dos hijos. */
class NodoCatalogo {
  valor: PatronArquitectura;
  izquierda: NodoCatalogo | null = null;
  derecha: NodoCatalogo | null = null;

  constructor(valor: PatronArquitectura) {
    this.valor = valor;
  }
}

/**
 * Compara dos nombres con las reglas del español (tildes y ñ incluidas).
 * Usar localeCompare en vez de `<` evita que "Árbol" quede fuera de sitio:
 * con comparación binaria, "Á" (U+00C1) sería mayor que cualquier letra ASCII.
 */
function compararNombres(a: string, b: string): number {
  return a.localeCompare(b, "es", { sensitivity: "base" });
}

export class ArbolCatalogo {
  private raiz: NodoCatalogo | null = null;
  private cantidad = 0;

  get tamano(): number {
    return this.cantidad;
  }

  /** Inserta un patrón en la rama que le corresponde por su nombre. */
  insertar(patron: PatronArquitectura): void {
    const nuevo = new NodoCatalogo(patron);
    this.cantidad += 1;

    if (this.raiz === null) {
      this.raiz = nuevo;
      return;
    }

    let actual = this.raiz;
    while (true) {
      const comparacion = compararNombres(patron.nombre, actual.valor.nombre);

      if (comparacion < 0) {
        if (actual.izquierda === null) {
          actual.izquierda = nuevo;
          return;
        }
        actual = actual.izquierda;
      } else {
        if (actual.derecha === null) {
          actual.derecha = nuevo;
          return;
        }
        actual = actual.derecha;
      }
    }
  }

  /**
   * Busca por nombre bajando una sola rama.
   * Con 8 patrones balanceados visita 4 nodos como máximo, no los 8.
   */
  buscar(nombre: string): PatronArquitectura | null {
    let actual = this.raiz;

    while (actual !== null) {
      const comparacion = compararNombres(nombre, actual.valor.nombre);
      if (comparacion === 0) return actual.valor;
      actual = comparacion < 0 ? actual.izquierda : actual.derecha;
    }

    return null;
  }

  /**
   * Busca por id. El árbol está ordenado por NOMBRE, no por id, así que aquí
   * no hay atajo posible: toca recorrerlo completo. Es justo el contraste que
   * hace visible para qué sirve el orden del árbol.
   */
  buscarPorId(id: string): PatronArquitectura | null {
    return this.enOrden().find((patron) => patron.id === id) ?? null;
  }

  /**
   * Recorrido in-order (izquierda → nodo → derecha).
   * En un ABB este recorrido entrega los elementos ordenados: es lo que usa
   * la lista lateral para pintarse alfabetizada sin llamar a sort().
   */
  enOrden(): PatronArquitectura[] {
    const resultado: PatronArquitectura[] = [];

    const visitar = (nodo: NodoCatalogo | null): void => {
      if (nodo === null) return;
      visitar(nodo.izquierda);
      resultado.push(nodo.valor);
      visitar(nodo.derecha);
    };

    visitar(this.raiz);
    return resultado;
  }

  /**
   * Altura del árbol. Sirve para comprobar que la inserción balanceada
   * funcionó: 8 patrones insertados en orden alfabético dan altura 8 (un árbol
   * degenerado, una lista disfrazada); insertados raíz-mitad-mitad dan 4.
   */
  altura(): number {
    const medir = (nodo: NodoCatalogo | null): number =>
      nodo === null ? 0 : 1 + Math.max(medir(nodo.izquierda), medir(nodo.derecha));

    return medir(this.raiz);
  }
}
