import firebase from "firebase/app";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyAUp13B8qq3b1ww9ieGL5km-UnMJTyhQ_0",
  authDomain: "pomodoro-49fec.firebaseapp.com",
  databaseURL: "https://pomodoro-49fec.firebaseio.com",
  projectId: "pomodoro-49fec",
  storageBucket: "pomodoro-49fec.appspot.com",
  messagingSenderId: "345458702982",
  appId: "1:345458702982:web:fd04e2ff6c195adab0af07",
  measurementId: "G-L2QEYDF9B4",
};

firebase.initializeApp(config);

const db = firebase.firestore();

const masterTasksRef = db.collection("masterTasks");
const taskRoundsRef = db.collection("taskRoundEntry");

export { masterTasksRef, taskRoundsRef };
