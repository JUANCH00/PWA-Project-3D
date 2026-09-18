/* ============================================================================
   Registro del Service Worker.

   No pertenece a ninguna capa del MVC: no es dominio, ni vista, ni controla
   la interfaz. Es infraestructura de la PWA, y solo la usa main.ts.
   ========================================================================== */

// En la primera instalación el navegador también dispara "updatefound", así
// que el mismo worker llegaría dos veces. El WeakSet recuerda a cuáles ya
// seguimos (y no impide que el navegador libere los viejos).
const seguidos = new WeakSet<ServiceWorker>();

/** Muestra en consola cada cambio de estado del Service Worker. */
function seguirEstados(trabajador: ServiceWorker): void {
  if (seguidos.has(trabajador)) return;
  seguidos.add(trabajador);

  console.info(`[PWA] estado del Service Worker: ${trabajador.state}`);
  // installing -> installed -> activating -> activated  (o redundant si falla)
  trabajador.addEventListener("statechange", () => {
    console.info(`[PWA] estado del Service Worker: ${trabajador.state}`);
  });
}

export function registrarServiceWorker(): void {
  // Navegadores viejos, o una página servida por http:// que no sea localhost:
  // ahí no existen los Service Workers. La app sigue funcionando igual, solo
  // que sin modo offline.
  if (!("serviceWorker" in navigator)) {
    console.warn("[PWA] Este navegador no soporta Service Workers.");
    return;
  }

  // Se registra después de "load" para que la descarga del SW no le compita
  // ancho de banda a la primera carga de la página.
  window.addEventListener("load", async () => {
    try {
      const registro = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      console.info(`[PWA] Service Worker registrado. Scope: ${registro.scope}`);

      const trabajador = registro.installing ?? registro.waiting ?? registro.active;
      if (trabajador) seguirEstados(trabajador);

      // Si más adelante se publica un sw.js nuevo, también lo seguimos.
      registro.addEventListener("updatefound", () => {
        if (registro.installing) seguirEstados(registro.installing);
      });
    } catch (error) {
      console.error("[PWA] No se pudo registrar el Service Worker:", error);
    }
  });
}
