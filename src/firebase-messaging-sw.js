import { firebaseNotificationConfig } from './src/firebase'
if ('serviceWorker' in navigator) {
    const firebaseConfigParams = new URLSearchParams(firebaseNotificationConfig).toString();
    navigator.serviceWorker
        .register(`../firebase-messaging-sw.js?${firebaseConfigParams}`)
        .then(function (registration) {
            console.log('Registration successful, scope is:', registration.scope);
        })
        .catch(function (err) {
            console.log('Service worker registration failed, error:', err);
        });
}