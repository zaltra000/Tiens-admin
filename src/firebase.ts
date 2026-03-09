import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Using hardcoded values to prevent environment variable parsing issues
// These values were provided specifically for this project
const firebaseConfig = {
  apiKey: "AIzaSyBvg60yAx8ojtmRtw8cQbGUwhYtONY8RyQ",
  authDomain: "tiens-sudan.firebaseapp.com",
  databaseURL: "https://tiens-sudan-default-rtdb.firebaseio.com",
  projectId: "tiens-sudan",
  storageBucket: "tiens-sudan.firebasestorage.app",
  messagingSenderId: "778870562236",
  appId: "1:778870562236:web:aa6553c3cb9c9b7f489fb9"
};

console.log("Initializing Firebase with config:", { 
  ...firebaseConfig, 
  apiKey: "HIDDEN" 
});

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
