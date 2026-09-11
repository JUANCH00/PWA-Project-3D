/* ============================================================================
   CAPA DE VISTA — Registro de constructores 3D.

   Traduce el id de un patrón al objeto 3D que lo representa. Fíjate en que el
   registro está tipado por `string`, no por PatronArquitectura: la vista no
   importa nada de dominio/, solo recibe un identificador.
   ========================================================================== */

import * as THREE from "three";

import { construirArbolBinario } from "./arbolBinario";
import { construirCapas } from "./capas";
import { construirClienteCacheServidor } from "./clienteCacheServidor";
import { construirClienteServidor } from "./clienteServidor";
import { construirMicroservicios } from "./microservicios";
import { construirMvc } from "./mvc";
import { construirPublicadorSuscriptor } from "./publicadorSuscriptor";
import { construirRepositorio } from "./repositorio";

type ConstructorPatron = () => THREE.Group;

const REGISTRO: Record<string, ConstructorPatron> = {
  "arbol-binario": construirArbolBinario,
  capas: construirCapas,
  "cliente-cache-servidor": construirClienteCacheServidor,
  "cliente-servidor": construirClienteServidor,
  microservicios: construirMicroservicios,
  mvc: construirMvc,
  "publicador-suscriptor": construirPublicadorSuscriptor,
  repositorio: construirRepositorio,
};

/** Devuelve el objeto 3D de un patrón, o un cubo neutro si el id no existe. */
export function construirPatron(id: string): THREE.Group {
  const constructor = REGISTRO[id];
  if (constructor) return constructor();

  const marcador = new THREE.Group();
  marcador.add(
    new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.5, 1.5),
      new THREE.MeshStandardMaterial({ color: 0x475569, wireframe: true }),
    ),
  );
  return marcador;
}
