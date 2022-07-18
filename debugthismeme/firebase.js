import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyD3SUBm6pno7NKRhxwVfKq7MYv-DScZLEg",
  authDomain: "debugthismeme.firebaseapp.com",
  projectId: "debugthismeme",
  storageBucket: "debugthismeme.appspot.com",
  messagingSenderId: "561715668811",
  appId: "1:561715668811:web:69bf8ba88eb0896745aace",
};
let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app;
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
export default firebase;
