import * as THREE from "three";
import { caja, conexion, en, COLORES } from "./comunes";

/**
 * MVC: tres bloques en triángulo. El Controlador (arriba) se conecta con el
 * Modelo y con la Vista; entre Modelo y Vista NO hay línea — esa ausencia es
 * justamente el patrón.
 */
export function construirMvc(): THREE.Group {
  const grupo = new THREE.Group();

  const controlador = en(caja(1.9, 0.8, 1.2, COLORES.ambar), 0, 1.5, 0);
  const modelo = en(caja(1.9, 0.8, 1.2, COLORES.cian), -1.9, -1.1, 0);
  const vista = en(caja(1.9, 0.8, 1.2, COLORES.violeta), 1.9, -1.1, 0);

  grupo.add(controlador, modelo, vista);
  grupo.add(
    conexion(new THREE.Vector3(-0.5, 1.2, 0), new THREE.Vector3(-1.6, -0.7, 0)),
    conexion(new THREE.Vector3(0.5, 1.2, 0), new THREE.Vector3(1.6, -0.7, 0)),
  );

  return grupo;
}
