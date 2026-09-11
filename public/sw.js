/* RiceTrack service worker — local notifications (no push server) */
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : "/app";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(target);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "SHOW_REMINDER") {
    const title = data.title || "RiceTrack";
    const body = data.body || "Time to log a meal.";
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: "/icon-192.png",
        badge: "/favicon-32.png",
        tag: data.tag || "ricetrack-meal",
        renotify: true,
        data: { url: data.url || "/app" },
      })
    );
  }
});
