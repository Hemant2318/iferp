/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDHnSwJ-5tStWh_qnRxbmzQ300D8EnISJM",
  authDomain: "iferp-57ded.firebaseapp.com",
  projectId: "iferp-57ded",
  storageBucket: "iferp-57ded.appspot.com",
  messagingSenderId: "115830330284",
  appId: "1:115830330284:web:6342f55780d452a77a2009",
  measurementId: "G-F730NGVXME",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
const messaging = firebase.messaging.isSupported()
  ? firebase.messaging()
  : null;
if (messaging) {
  messaging.onBackgroundMessage((payload) => {
    const content = payload.notification;
    const notificationTitle = content.title;
    const notificationOptions = {
      body: content.body,
      data: payload.data,
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  self.addEventListener("notificationclick", (event) => {
    const { data } = event?.notification || {};
    event.waitUntil(
      (async () => {
        const allClients = await clients.matchAll({
          includeUncontrolled: true,
        });
        let iferpClient;

        for (const client of allClients) {
          const url = new URL(client.url);
          if (self.location.origin === url.origin) {
            client.focus();
            client.postMessage(data);
            iferpClient = client;
            break;
          }
        }
        if (!iferpClient) {
          console.log("Client Not Found");
        }
      })()
    );
  });
}
