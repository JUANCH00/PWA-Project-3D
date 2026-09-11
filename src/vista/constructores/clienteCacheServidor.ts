import * as THREE from "three";
import { caja, conexion, en, COLORES } from "./comunes";

/**
 * Cliente-Caché-Servidor: la caché se interpone en el camino. La línea corta
 * cliente↔caché es la respuesta rápida; la larga, la que solo se paga cuando
 * el dato no está guardado.
 */
export function construirClienteCacheServidor(): THREE.Group {
  const grupo = new THREE.Group();

  grupo.add(en(caja(1.6, 1.2, 1.2, COLORES.cian), -2.6, 0, 0));
  grupo.add(en(caja(1.3, 1.6, 1.2, COLORES.ambar), 0, 0, 0));
  grupo.add(en(caja(1.6, 2.0, 1.2, COLORES.violeta), 2.6, 0, 0));

  grupo.add(
    conexion(new THREE.Vector3(-1.8, 0, 0), new THREE.Vector3(-0.65, 0, 0), COLORES.verde),
    conexion(new THREE.Vector3(0.65, 0, 0), new THREE.Vector3(1.8, 0, 0)),
    // El atajo: cuando la caché ya tiene el dato, el servidor ni se entera.
    conexion(new THREE.Vector3(-1.8, 0.75, 0), new THREE.Vector3(-0.4, 0.9, 0), COLORES.verde),
  );

  return grupo;
}
