import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBvg60yAx8ojtmRtw8cQbGUwhYtONY8RyQ",
    authDomain: "tiens-sudan.firebaseapp.com",
    databaseURL: "https://tiens-sudan-default-rtdb.firebaseio.com",
    projectId: "tiens-sudan",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "inventory");

get(dbRef).then((snapshot) => {
  if (snapshot.exists()) {
    console.log("SUCCESS! Got data from Firebase:", snapshot.val());
  } else {
    console.log("No data available at 'inventory' node.");
  }
  process.exit(0);
}).catch((error) => {
  console.error("ERROR connection failed:", error);
  process.exit(1);
});
