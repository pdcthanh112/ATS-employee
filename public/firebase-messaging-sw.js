//public/firebase-messaging-sw.js
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', () => {
    // eslint-disable-next-line no-restricted-globals
    const urlParams = new URLSearchParams(location.search);
    // eslint-disable-next-line no-restricted-globals
    self.firebaseNotificationConfig = Object.fromEntries(urlParams);
});

const defaultConfig = {
    apiKey: true,
    projectId: true,
    messagingSenderId: true,
    appId: true,
    measurementId: true,
};
// eslint-disable-next-line no-restricted-globals, no-undef
firebase.initializeApp(self.firebaseNotificationConfig || defaultConfig);
// eslint-disable-next-line no-undef
if (firebase.messaging.isSupported()) {
    // eslint-disable-next-line no-undef
    const messaging = firebase.messaging();
    const channel = new BroadcastChannel('notifications');
    messaging.onBackgroundMessage(function (payload) {
        //can not console.log here
        channel.postMessage(payload);
    });
}