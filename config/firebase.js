import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDSlPhibTKrXg1llSvtM8ienRZ1Qyv5N34",
  authDomain: "pe-mma-punhe.firebaseapp.com",
  projectId: "pe-mma-punhe",
  storageBucket: "pe-mma-punhe.firebasestorage.app",
  messagingSenderId: "507480918531",
  appId: "1:507480918531:web:573ffa0be34e170bef1c36"
};
// initialize firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();
