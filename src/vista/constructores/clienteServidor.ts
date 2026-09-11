import * as THREE from "three";
import { caja, conexion, en, COLORES } from "./comunes";

/**
 * Cliente-Servidor: dos procesos separados y dos líneas entre ellos
 * (la petición que sube y la respuesta que baja).
 */
export function construirClienteServidor(): THREE.Group {
  const grupo = new THREE.Group();

  grupo.add(en(caja(1.9, 1.3, 1.3, COLORES.cian), -2.1, 0, 0));
  grupo.add(en(caja(1.9, 2.1, 1.3, COLORES.violeta), 2.1, 0, 0));

  grupo.add(
    conexion(new THREE.Vector3(-1.1, 0.3, 0), new THREE.Vector3(1.1, 0.3, 0), COLORES.verde),
    conexion(new THREE.Vector3(1.1, -0.3, 0), new THREE.Vector3(-1.1, -0.3, 0), COLORES.ambar),
  );

  return grupo;
}
