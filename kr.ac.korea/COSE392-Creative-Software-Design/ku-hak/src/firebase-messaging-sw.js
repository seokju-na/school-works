importScripts('https://www.gstatic.com/firebasejs/4.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.10.1/firebase-messaging.js');


firebase.initializeApp({
    messagingSenderId: '118643550231',
});


const messaging = firebase.messaging();
