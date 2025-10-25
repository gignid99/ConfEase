// Import the functions you need from the SDKs you need
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
