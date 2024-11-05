self.addEventListener("push", function (event) {
  console.log("NOTIFICATION PUSH");
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Notification Title";
  const options = {
    body: data.body || "Notification body content.",
    icon: "/icon-192x192.png",
    badge: "/icon-96x96.png",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
if ("workbox" in self) {
  workbox.setConfig({ debug: false });
  workbox.core.setLogLevel(workbox.core.LOG_LEVELS.silent);

  // Remplace toutes les fonctions de log par une fonction vide
  const noop = () => {};
  workbox.core.logger.log = noop;
  workbox.core.logger.warn = noop;
  workbox.core.logger.error = noop;
  workbox.core.logger.debug = noop;
  workbox.core.logger.info = noop;
}
