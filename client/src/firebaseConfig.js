// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKh1YSB_h6UOo_F_kXW0RqXiAz9CDWMDo",
  authDomain: "campustrade-1.firebaseapp.com",
  projectId: "campustrade-1",
  storageBucket: "campustrade-1.firebasestorage.app",
  messagingSenderId: "315010224612",
  appId: "1:315010224612:web:07a0f3d2ae8ad0bbb477f1",
  measurementId: "G-BTDVH9P9WL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, db, analytics };
