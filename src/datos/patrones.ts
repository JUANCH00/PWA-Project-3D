/* ============================================================================
   CAPA DE DATOS — Los 8 patrones iniciales (seed data) y el armado del árbol.

   Junto con dominio/, forma el MODELO del MVC. Solo importa de dominio/, que
   es la capa que tiene justo debajo.
   ========================================================================== */

import type { PatronArquitectura } from "../dominio/PatronArquitectura";
import { ArbolCatalogo } from "../dominio/ArbolCatalogo";

/** Los 8 patrones del catálogo, en orden alfabético español. */
export const PATRONES: PatronArquitectura[] = [
  {
    id: "arbol-binario",
    nombre: "Árbol Binario",
    categoria: "datos",
    descripcion:
      "Estructura jerárquica donde cada nodo tiene como máximo dos hijos. En un árbol de búsqueda, todo lo menor va a la izquierda y todo lo mayor a la derecha, lo que permite encontrar un elemento bajando una sola rama. Es la estructura que este mismo proyecto usa para guardar el catálogo.",
  },
  {
    id: "capas",
    nombre: "Arquitectura en Capas",
    categoria: "estructural",
    descripcion:
      "Organiza el sistema en niveles horizontales con una responsabilidad cada uno, donde una capa solo puede depender de la que tiene justo debajo. Aísla los cambios: tocar la presentación no obliga a tocar los datos. Es la arquitectura de las carpetas de este proyecto.",
  },
  {
    id: "cliente-cache-servidor",
    nombre: "Cliente-Caché-Servidor",
    categoria: "distribuida",
    descripcion:
      "Añade una memoria intermedia entre el cliente y el servidor que guarda las respuestas ya pedidas. Reduce la latencia y la carga del servidor, a cambio de tener que decidir cuándo un dato guardado dejó de ser válido. Es la base de las PWA que funcionan sin conexión.",
  },
  {
    id: "cliente-servidor",
    nombre: "Cliente-Servidor",
    categoria: "distribuida",
    descripcion:
      "Reparte el sistema en dos roles: el cliente pide y el servidor responde, cada uno en su propio proceso y comunicándose por la red. Permite que muchos clientes compartan un servidor y que cada lado evolucione por separado mientras respeten el mismo contrato.",
  },
  {
    id: "microservicios",
    nombre: "Microservicios",
    categoria: "distribuida",
    descripcion:
      "Divide una aplicación en servicios pequeños e independientes, cada uno con su propia responsabilidad, su despliegue y a veces su propia base de datos. Gana autonomía y escalado selectivo, y paga con la complejidad de coordinar la red entre ellos.",
  },
  {
    id: "mvc",
    nombre: "MVC",
    categoria: "estructural",
    descripcion:
      "Separa el Modelo (los datos y sus reglas), la Vista (lo que se dibuja) y el Controlador (que traduce las acciones del usuario). El Modelo y la Vista no se conocen entre sí: el Controlador es el único que habla con los dos.",
  },
  {
    id: "publicador-suscriptor",
    nombre: "Publicador-Suscriptor",
    categoria: "distribuida",
    descripcion:
      "Quien emite un mensaje no sabe quién lo recibirá: publica en un canal y los interesados se suscriben a él. Desacopla al emisor de los receptores y permite agregar o quitar suscriptores sin tocar al publicador. Es el modelo de los eventos del DOM.",
  },
  {
    id: "repositorio",
    nombre: "Repositorio",
    categoria: "datos",
    descripcion:
      "Pone una fachada entre la lógica de negocio y el almacenamiento, de modo que el resto del código pida objetos sin saber si vienen de una base de datos, de un archivo o de una API. Permite cambiar la fuente de datos sin tocar a quien la consume.",
  },
];

/**
 * Inserta un arreglo YA ORDENADO en el árbol usando el orden raíz-mitad-mitad:
 * primero el elemento del medio (que queda como raíz), y luego, recursivamente,
 * el medio de la mitad izquierda y el medio de la mitad derecha.
 *
 * ¿Por qué no insertarlos en orden alfabético y ya? Porque cada nuevo nombre
 * sería mayor que el anterior y se iría siempre a la derecha: el árbol quedaría
 * degenerado (una lista encadenada disfrazada, de altura 8). Con este truco la
 * altura baja a 4, que es la mínima posible para 8 elementos.
 */
function insertarBalanceado(
  arbol: ArbolCatalogo,
  ordenados: PatronArquitectura[],
  inicio: number,
  fin: number,
): void {
  if (inicio > fin) return;

  const medio = Math.floor((inicio + fin) / 2);
  arbol.insertar(ordenados[medio]);

  insertarBalanceado(arbol, ordenados, inicio, medio - 1);
  insertarBalanceado(arbol, ordenados, medio + 1, fin);
}

/** Construye el catálogo completo como árbol binario balanceado. */
export function crearCatalogo(): ArbolCatalogo {
  const arbol = new ArbolCatalogo();

  // Se ordena aquí por si alguien agrega un patrón nuevo fuera de sitio:
  // insertarBalanceado necesita el arreglo ordenado para funcionar.
  const ordenados = [...PATRONES].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }),
  );

  insertarBalanceado(arbol, ordenados, 0, ordenados.length - 1);
  return arbol;
}
