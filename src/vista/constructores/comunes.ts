/* ============================================================================
   CAPA DE VISTA — Piezas 3D reutilizables por los constructores.

   Nada de esto sabe qué es un PatronArquitectura: son ladrillos genéricos
   (cajas, esferas, cilindros, líneas) que cada constructor combina a su manera.
   ========================================================================== */

import * as THREE from "three";

export const COLORES = {
  cian: 0x38bdf8,
  violeta: 0xa78bfa,
  ambar: 0xfbbf24,
  verde: 0x34d399,
  rosa: 0xf472b6,
  hueso: 0xe2e8f0,
  linea: 0x64748b,
} as const;

/** Caja sólida con sus aristas resaltadas: se lee como un diagrama. */
export function caja(
  ancho: number,
  alto: number,
  fondo: number,
  color: number,
): THREE.Group {
  const grupo = new THREE.Group();

  const cuerpo = new THREE.Mesh(
    new THREE.BoxGeometry(ancho, alto, fondo),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.45,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9,
    }),
  );

  const aristas = new THREE.LineSegments(
    new THREE.EdgesGeometry(cuerpo.geometry),
    new THREE.LineBasicMaterial({ color: COLORES.hueso, transparent: true, opacity: 0.55 }),
  );

  grupo.add(cuerpo, aristas);
  return grupo;
}

export function esfera(radio: number, color: number): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radio, 32, 16),
    new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.15 }),
  );
}

export function cilindro(radio: number, alto: number, color: number): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.CylinderGeometry(radio, radio, alto, 32),
    new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.2 }),
  );
}

/** Línea recta entre dos puntos: sirve de "flecha" entre componentes. */
export function conexion(
  desde: THREE.Vector3,
  hasta: THREE.Vector3,
  color: number = COLORES.linea,
): THREE.Line {
  const geometria = new THREE.BufferGeometry().setFromPoints([desde, hasta]);
  return new THREE.Line(
    geometria,
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.75 }),
  );
}

/** Atajo para posicionar cualquier objeto en un solo renglón. */
export function en<T extends THREE.Object3D>(objeto: T, x: number, y: number, z = 0): T {
  objeto.position.set(x, y, z);
  return objeto;
}
