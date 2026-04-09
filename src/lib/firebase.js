import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDmsfFydrJi0AxVpt_x1j2Kq12hUTLLX4Y",
  authDomain: "udhaari-87610.firebaseapp.com",
  projectId: "udhaari-87610",
  storageBucket: "udhaari-87610.firebasestorage.app",
  messagingSenderId: "483590653797",
  appId: "1:483590653797:web:70d0d861e9baaf87bc438c",
  measurementId: "G-Y7DWXDBPSD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export { analytics };
