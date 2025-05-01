// src/firebase/auth.js
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./config";
import { doc, setDoc, getDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Referência ao documento do usuário no Firestore
    const userRef = doc(db, "users", user.uid);
    const existingDoc = await getDoc(userRef);

    if (!existingDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        fanLevel: 1,
        medals: [false, false, false, false, false],
        socialLinks: {},
      });
    }

    return { user };
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
}
