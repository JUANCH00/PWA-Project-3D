import * as THREE from "three";
import { caja, cilindro, conexion, en, COLORES } from "./comunes";

/**
 * Repositorio: los consumidores (arriba) solo hablan con el repositorio.
 * Ninguna línea los une con el almacenamiento — por eso se puede cambiar la
 * base de datos sin que se enteren.
 */
export function construirRepositorio(): THREE.Group {
  const grupo = new THREE.Group();

  const consumidores = [-1.5, 1.5];
  consumidores.forEach((x) => {
    grupo.add(en(caja(1.3, 0.8, 1.1, COLORES.cian), x, 2.0, 0));
    grupo.add(conexion(new THREE.Vector3(x, 1.6, 0), new THREE.Vector3(0, 0.75, 0)));
  });

  grupo.add(en(caja(3.2, 0.85, 1.4, COLORES.violeta), 0, 0.3, 0));
  grupo.add(conexion(new THREE.Vector3(0, -0.15, 0), new THREE.Vector3(0, -1.1, 0), COLORES.verde));
  grupo.add(en(cilindro(1.05, 1.1, COLORES.ambar), 0, -1.7, 0));

  return grupo;
}
