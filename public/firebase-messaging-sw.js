/* eslint-disable no-undef */
importScripts("/firebase-sw-config.js");
importScripts(
  "https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js"
);

firebase.initializeApp(FIREBASE_SW_CONFIG);

const messaging = firebase.messaging();

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] background message", payload);

  // FCM already displays messages that include a `notification` payload.
  // Calling showNotification here as well causes duplicate system notifications.
  if (payload.notification) {
    return;
  }

  const data = payload.data ?? {};
  const title = data.title ?? "New message";
  const options = {
    body: data.body ?? "",
    icon: data.icon,
    data: payload.data,
  };

  return self.registration.showNotification(title, options);
});
