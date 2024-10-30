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
  workbox.setConfig({ debug: false }); // Désactive les logs en mode production

  // Si vous voulez un niveau de log particulier en mode développement
  // Remplacez "debug" par "silent" pour ne rien afficher.
  workbox.core.setLogLevel(workbox.core.LOG_LEVELS.silent);
}
