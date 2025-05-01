import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsYqxYBWiJlNf2X1-XIDoR7o-sdrhH7o8",
  authDomain: "furia-fan-app.firebaseapp.com",
  projectId: "furia-fan-app",
  storageBucket: "furia-fan-app.firebasestorage.app",
  messagingSenderId: "247875785514",
  appId: "1:247875785514:web:edcba392edbe3b71488453"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };