import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Replace with your actual Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyCJBG6tKmmF9ftWQktJSP_O15zRMeGkA_w",
    authDomain: "vehicle-service-manageme-4a48d.firebaseapp.com",
    projectId: "vehicle-service-manageme-4a48d",
    storageBucket: "vehicle-service-manageme-4a48d.appspot.com",
    messagingSenderId: "1038146211943",
    appId: "1:1038146211943:web:98ae1fa96f567f906e44c2",
    measurementId: "G-HJ0TSKDJ7P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
