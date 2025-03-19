importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAYHN2EpvydDXS-SejKb_njSvcdXq0fP8k",
    authDomain: "linton-fb31e.firebaseapp.com",
    projectId: "linton-fb31e",
    storageBucket: "linton-fb31e.firebasestorage.app",
    messagingSenderId: "670923450328",
    appId: "1:670923450328:web:64886d0e5ed196992934ad",
    measurementId: "G-34MRJH25CZ"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();
// Optional: Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: '/firebase-logo.png' // Optional: Add an icon if desired
    icon: payload.notification?.image
  };
  self.registration.showNotification(notificationTitle, notificationOptions);

  self.addEventListener('notificationclick', function(event) {
    console.log("Notification clicked, opening:", "https://linton-group.netlify.app/download-center");
    event.notification.close();
    event.waitUntil(
      clients.openWindow("https://linton-group.netlify.app/download-center/")
    );
  });
});