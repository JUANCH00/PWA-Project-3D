import * as THREE from "three";
import { caja, esfera, conexion, en, COLORES } from "./comunes";

/**
 * Microservicios: una puerta de enlace en el centro y servicios autónomos
 * alrededor, cada uno independiente de los demás.
 */
export function construirMicroservicios(): THREE.Group {
  const grupo = new THREE.Group();
  const servicios = 6;
  const radio = 2.3;
  const colores = [COLORES.cian, COLORES.violeta, COLORES.rosa, COLORES.verde, COLORES.ambar, COLORES.cian];

  grupo.add(esfera(0.5, COLORES.hueso));

  for (let i = 0; i < servicios; i++) {
    const angulo = (i / servicios) * Math.PI * 2;
    const x = Math.cos(angulo) * radio;
    const y = Math.sin(angulo) * radio;

    grupo.add(en(caja(0.95, 0.95, 0.95, colores[i]), x, y, 0));
    grupo.add(conexion(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, 0)));
  }

  return grupo;
}
