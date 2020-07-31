// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.17.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.17.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyCNiRD2q4rUQVe8EUftGz_hMhEXJJJu_5k',
  authDomain: 'the-narrative-4f600.firebaseapp.com',
  databaseURL: 'https://the-narrative-4f600.firebaseio.com',
  projectId: 'the-narrative-4f600',
  storageBucket: 'the-narrative-4f600.appspot.com',
  messagingSenderId: '177219141704',
  appId: '1:177219141704:web:1235fe88c96833db76d87d',
  measurementId: 'G-RLR73MMP3P'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
