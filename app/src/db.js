import firebase from 'firebase/app';
import 'firebase/firestore';

// Get a Firestore instance
const db = firebase
  .initializeApp({
    apiKey: "AIzaSyCAARgbBG1pkOeJotsIub1a_1qszlQcEN4",
    authDomain: "facturacionparaguay.firebaseapp.com",
    projectId: "facturacionparaguay",
    storageBucket: "facturacionparaguay.appspot.com",
    messagingSenderId: "994468793874",
    appId: "1:994468793874:web:fc50545e75db1b1d2f12cb",
    measurementId: "G-SJW1NE9XF8"
  })
  .firestore();

console.log("db", db);
// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
//const { Timestamp, GeoPoint } = firebase.firestore;

// if using Firebase JS SDK < 5.8.0
db.settings({ timestampsInSnapshots: true });

export default db;