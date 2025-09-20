self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};

  event.waitUntil(
    self.registration.showNotification(data.title || "پیام جدید", {
      body: data.body || "شما یک پیام جدید دریافت کردید",
      icon: "/icon.png", // بذار تو public
      badge: "/badge.png", // آیکون کوچک
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
