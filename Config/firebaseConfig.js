// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUMPq83XnIjELCOCILZv9qHLLLekU4JCU",
  authDomain: "cloud-file-manager-ccae3.firebaseapp.com",
  projectId: "cloud-file-manager-ccae3",
  storageBucket: "cloud-file-manager-ccae3.firebasestorage.app",
  messagingSenderId: "942999006003",
  appId: "1:942999006003:web:3f254d241b5c6704a86c46",
  measurementId: "G-X6DNSK55BE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);