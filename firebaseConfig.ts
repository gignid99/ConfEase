// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, browserLocalPersistence } from "firebase/auth";
import ReactNativeAsyncStorage, { AsyncStorageStatic } from "@react-native-async-storage/async-storage"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMsd70RwA9bWvIz3tDQT-zOMIjCf_QUbI",
  authDomain: "conf-44fdd.firebaseapp.com",
  projectId: "conf-44fdd",
  storageBucket: "conf-44fdd.firebasestorage.app",
  messagingSenderId: "691681352064",
  appId: "1:691681352064:web:5bb588e820a9830ae5c965"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// export const auth= initializeAuth(app, {persistence:getReactNativePersistence(ReactNativeAsyncStorage)});


// Updated code for persistence
let auth;

if (Platform.OS === "web") {
  // ✅ Web persistence
  auth = initializeAuth(app, {
    persistence: browserLocalPersistence,
  });
} else {
  // ✅ Mobile persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}


export { auth };




















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

function getReactNativePersistence(AsyncStorage: AsyncStorageStatic): import("firebase/auth").Persistence | import("firebase/auth").Persistence[] | undefined {
  throw new Error("Function not implemented.");
}
