import firebase from "firebase/app";
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAl4vK8VUFMCwBHfDQhZqrHcpXilkE4T9o",
    authDomain: "crud-react-01-46e97.firebaseapp.com",
    databaseURL: "https://crud-react-01-46e97.firebaseio.com",
    projectId: "crud-react-01-46e97",
    storageBucket: "crud-react-01-46e97.appspot.com",
    messagingSenderId: "585379492431",
    appId: "1:585379492431:web:c557bc927c5ae648f0303a"
  };

// Inicializamos Firebase
firebase.initializeApp(firebaseConfig);

export default firebase