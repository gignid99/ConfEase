// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
{/*const firebaseConfig = {
  apiKey: "AIzaSyBMsd70RwA9bWvIz3tDQT-zOMIjCf_QUbI",
  authDomain: "conf-44fdd.firebaseapp.com",
  projectId: "conf-44fdd",
  storageBucket: "conf-44fdd.firebasestorage.app",
  messagingSenderId: "691681352064",
  appId: "1:691681352064:web:5bb588e820a9830ae5c965"
};
*/}
const firebaseConfig = {
  apiKey: "AIzaSyC6lLlZXHTKwtB9UC6xCMgvmKvFDb-Rseo",
  authDomain: "confease-827ff.firebaseapp.com",
  projectId: "confease-827ff",
  storageBucket: "confease-827ff.firebasestorage.app",
  messagingSenderId: "1021008290738",
  appId: "1:1021008290738:web:f5971b9fb612cbb5fa3aab",
  measurementId: "G-29D4SX6BEH"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth= initializeAuth(app, {persistence:getReactNativePersistence(ReactNativeAsyncStorage)});
export const db = getFirestore(app);
export const storage = getStorage(app);






















{/*// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6lLlZXHTKwtB9UC6xCMgvmKvFDb-Rseo",
  authDomain: "confease-827ff.firebaseapp.com",
  projectId: "confease-827ff",
  storageBucket: "confease-827ff.firebasestorage.app",
  messagingSenderId: "1021008290738",
  appId: "1:1021008290738:web:f5971b9fb612cbb5fa3aab",
  measurementId: "G-29D4SX6BEH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);
export default app;
*/}