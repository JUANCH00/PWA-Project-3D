import * as THREE from "three";
import { caja, conexion, en, COLORES } from "./comunes";

/**
 * Publicador-Suscriptor: el publicador (izquierda) solo habla con el canal.
 * No hay ninguna línea que lo una directamente con los suscriptores — no sabe
 * siquiera cuántos hay.
 */
export function construirPublicadorSuscriptor(): THREE.Group {
  const grupo = new THREE.Group();

  grupo.add(en(caja(1.5, 1.1, 1.1, COLORES.ambar), -2.7, 0, 0));

  // El canal: una barra vertical que reparte a quien esté suscrito
  grupo.add(en(caja(0.5, 3.4, 1.0, COLORES.hueso), -0.6, 0, 0));
  grupo.add(conexion(new THREE.Vector3(-1.9, 0, 0), new THREE.Vector3(-0.9, 0, 0), COLORES.verde));

  const alturas = [1.3, 0, -1.3];
  const colores = [COLORES.cian, COLORES.violeta, COLORES.rosa];

  alturas.forEach((y, i) => {
    grupo.add(en(caja(1.4, 0.9, 1.0, colores[i]), 2.2, y, 0));
    grupo.add(conexion(new THREE.Vector3(-0.3, y, 0), new THREE.Vector3(1.5, y, 0)));
  });

  return grupo;
}
