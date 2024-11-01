import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDSlPhibTKrXg1llSvtM8ienRZ1Qyv5N34",
  authDomain: "pe-mma-punhe.firebaseapp.com",
  projectId: "pe-mma-punhe",
  storageBucket: "pe-mma-punhe.firebasestorage.app",
  messagingSenderId: "507480918531",
  appId: "1:507480918531:web:573ffa0be34e170bef1c36"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore
export const database = getFirestore(app);