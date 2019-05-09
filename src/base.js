import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
const app = firebase.initializeApp({
    apiKey: "AIzaSyCfYHEPqB1yVX7---b48CV1X_SJjFS8DRw",
  authDomain: "chess-game-c0b7a.firebaseapp.com",
  databaseURL: "https://chess-game-c0b7a.firebaseio.com",
  projectId: "chess-game-c0b7a",
  storageBucket: "chess-game-c0b7a.appspot.com",
  messagingSenderId: "143668773226",
  appId: "1:143668773226:web:d6c4f11f0c6b4a9c"
});

export default app;
