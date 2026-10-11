// Firebase Web SDK configuration for Prompt Maker.
// Firebase web config is intended for client-side use; protect data with Firestore Security Rules.
const firebaseConfig = {
  apiKey: "AIzaSyCn7GUkOaFO4l0x1zM5mwW4hFkW2ISxR10",
  authDomain: "shanpalia-apk-hub.firebaseapp.com",
  projectId: "shanpalia-apk-hub",
  storageBucket: "shanpalia-apk-hub.firebasestorage.app",
  messagingSenderId: "270953807883",
  appId: "1:270953807883:web:c900f4409938f16477870e",
  measurementId: "G-7BMQEGPY8C"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
