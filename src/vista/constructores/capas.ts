import * as THREE from "three";
import { caja, conexion, en, COLORES } from "./comunes";

/**
 * Arquitectura en Capas: losas apiladas, cada una apoyada sobre la anterior.
 * La línea vertical recuerda que la dependencia va siempre hacia abajo.
 */
export function construirCapas(): THREE.Group {
  const grupo = new THREE.Group();
  const colores = [COLORES.cian, COLORES.violeta, COLORES.rosa, COLORES.ambar];

  colores.forEach((color, i) => {
    const losa = caja(3.4, 0.45, 2.2, color);
    grupo.add(en(losa, 0, 1.5 - i * 0.75, 0));
  });

  grupo.add(
    conexion(new THREE.Vector3(2.1, 1.6, 0), new THREE.Vector3(2.1, -0.9, 0), COLORES.hueso),
  );

  return grupo;
}
