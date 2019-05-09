import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
const app = firebase.initializeApp({
    apiKey: "AIzaSyDWNLo6RkhY6wniWcRGbar1kqbZHmHgnNQ",
    authDomain: "react-chess-b94b7.firebaseapp.com",
    databaseURL: "https://react-chess-b94b7.firebaseio.com",
    projectId: "react-chess-b94b7",
    storageBucket: "react-chess-b94b7.appspot.com",
    messagingSenderId: "70773725857"
});

export default app;
