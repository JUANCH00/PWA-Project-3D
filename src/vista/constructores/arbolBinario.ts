import * as THREE from "three";
import { esfera, conexion, en, COLORES } from "./comunes";

/**
 * Árbol Binario: la raíz arriba y, en cada nivel, el doble de nodos.
 * Se dibuja con la misma altura 4 que tiene el catálogo real del proyecto.
 */
export function construirArbolBinario(): THREE.Group {
  const grupo = new THREE.Group();

  // [x, y] de cada nodo, nivel por nivel
  const niveles: Array<Array<[number, number]>> = [
    [[0, 1.9]],
    [
      [-1.6, 0.5],
      [1.6, 0.5],
    ],
    [
      [-2.4, -0.9],
      [-0.8, -0.9],
      [0.8, -0.9],
      [2.4, -0.9],
    ],
  ];

  const colores = [COLORES.ambar, COLORES.cian, COLORES.violeta];

  niveles.forEach((nivel, i) => {
    nivel.forEach(([x, y]) => {
      grupo.add(en(esfera(i === 0 ? 0.42 : 0.32, colores[i]), x, y, 0));
    });
  });

  // Une cada nodo con sus dos hijos del nivel siguiente
  niveles.slice(0, -1).forEach((nivel, i) => {
    const hijos = niveles[i + 1];
    nivel.forEach(([x, y], j) => {
      [hijos[j * 2], hijos[j * 2 + 1]].forEach(([hx, hy]) => {
        grupo.add(conexion(new THREE.Vector3(x, y, 0), new THREE.Vector3(hx, hy, 0)));
      });
    });
  });

  return grupo;
}
