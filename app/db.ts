import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE,
    authDomain: "storm-6d92b.firebaseapp.com",
    projectId: "storm-6d92b",
    storageBucket: "storm-6d92b.appspot.com",
    messagingSenderId: "310123051562",
    appId: "1:310123051562:web:8ccf0bedd8030bae14e153",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default db;
