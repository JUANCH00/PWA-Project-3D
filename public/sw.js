/* ============================================================================
   Service Worker del Atlas 3D.

   Vive en public/ por la misma razón que el manifest: Vite sirve esa carpeta
   tal cual, sin procesarla, así que este archivo queda en /sw.js. Y eso es
   obligatorio: un Service Worker solo controla las rutas que están a su
   altura o por debajo. En /sw.js su alcance (scope) es todo el sitio.

   Es JavaScript normal y no TypeScript porque Vite no compila public/.

   El ciclo de vida:
     1. install  -> se descarga y guarda el "app shell" en la caché
     2. activate -> borra las cachés de versiones anteriores
     3. fetch    -> intercepta cada petición y decide: ¿red o caché?
   ========================================================================== */

// Cambiar la versión es la forma de publicar un Service Worker nuevo: el
// navegador compara este archivo byte a byte y, si cambió, instala el nuevo.
const VERSION = "v1";
const PREFIJO = "atlas3d-";
const CACHE = `${PREFIJO}${VERSION}`;

// Lo mínimo para que la app abra sin conexión. Son rutas estables: están en
// public/ y Vite no les cambia el nombre.
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.svg",
  "/iconos/icon-192.png",
  "/iconos/icon-512.png",
  "/iconos/icon-512-maskable.png",
];

/**
 * En producción, Vite nombra el JS y el CSS con un hash (index-BppI_EOk.js)
 * que cambia en cada build, así que no se pueden escribir a mano aquí. La
 * solución: leer el index.html recién construido y sacar de él esas rutas.
 * En desarrollo el HTML apunta a /src/main.ts, no hay /assets/, y esta
 * función simplemente devuelve una lista vacía.
 */
async function recursosDelBuild() {
  try {
    const respuesta = await fetch("/index.html", { cache: "no-store" });
    const html = await respuesta.text();
    return [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]);
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------ 1. install */
self.addEventListener("install", (evento) => {
  console.log(`[SW ${VERSION}] install: guardando el app shell`);

  // waitUntil mantiene vivo al Service Worker hasta que la promesa termine.
  // Si addAll falla (un solo archivo que no exista), la instalación falla
  // completa y el navegador lo reintentará más adelante.
  evento.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const recursos = await recursosDelBuild();
      await cache.addAll([...APP_SHELL, ...recursos]);
      console.log(`[SW ${VERSION}] ${APP_SHELL.length + recursos.length} archivos en caché`);

      // Sin esto, el SW nuevo se queda en estado "waiting" hasta que se
      // cierren todas las pestañas que usan el viejo.
      await self.skipWaiting();
    })(),
  );
});

/* ----------------------------------------------------------- 2. activate */
self.addEventListener("activate", (evento) => {
  console.log(`[SW ${VERSION}] activate: limpiando cachés viejas`);

  evento.waitUntil(
    (async () => {
      const nombres = await caches.keys();
      await Promise.all(
        nombres
          // Solo tocamos NUESTRAS cachés: otro proyecto en el mismo origen
          // (localhost) podría tener las suyas.
          .filter((nombre) => nombre.startsWith(PREFIJO) && nombre !== CACHE)
          .map((nombre) => {
            console.log(`[SW ${VERSION}] borrando ${nombre}`);
            return caches.delete(nombre);
          }),
      );

      // Toma el control de las pestañas ya abiertas sin esperar a que se
      // recarguen.
      await self.clients.claim();
    })(),
  );
});

/* -------------------------------------------------------------- 3. fetch */

/** Red primero: siempre lo más nuevo, y la caché solo si no hay conexión. */
async function redPrimero(peticion) {
  const cache = await caches.open(CACHE);
  try {
    const respuesta = await fetch(peticion);
    if (respuesta.ok) cache.put(peticion, respuesta.clone());
    return respuesta;
  } catch {
    // Sin red: la página guardada, o en último caso el index.html del shell
    return (await cache.match(peticion)) ?? (await cache.match("/index.html")) ?? Response.error();
  }
}

/** Caché primero: para archivos que no cambian nunca con ese mismo nombre. */
async function cachePrimero(peticion) {
  const cache = await caches.open(CACHE);
  const guardada = await cache.match(peticion);
  if (guardada) return guardada;

  const respuesta = await fetch(peticion);
  if (respuesta.ok) cache.put(peticion, respuesta.clone());
  return respuesta;
}

self.addEventListener("fetch", (evento) => {
  const peticion = evento.request;
  const url = new URL(peticion.url);

  // Solo GET y solo de nuestro propio origen. Todo lo demás pasa de largo.
  if (peticion.method !== "GET" || url.origin !== self.location.origin) return;

  // Navegar a una página (escribir la URL, recargar): red primero, para que
  // una versión nueva de la app se vea en cuanto haya conexión.
  if (peticion.mode === "navigate") {
    evento.respondWith(redPrimero(peticion));
    return;
  }

  // Archivos con hash del build, íconos y manifest: caché primero. Un archivo
  // /assets/index-BppI_EOk.js nunca cambia; si el código cambia, cambia el
  // nombre. Por eso servirlo desde la caché es seguro y muy rápido.
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/iconos/") ||
    url.pathname === "/manifest.json"
  ) {
    evento.respondWith(cachePrimero(peticion));
    return;
  }

  // Todo lo demás (en desarrollo: /src/..., /@vite/client, /node_modules/...)
  // no se toca. Si el SW cacheara esos archivos, el recargado en caliente de
  // Vite dejaría de mostrar los cambios.
});
