import { GoogleAuthProvider, TwitterAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./config";
import { doc, setDoc, getDoc } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();
twitterProvider.addScope('users.read tweet.read follows.read');

export async function loginWithGoogle() {
  try {
    console.log("Iniciando login com Google...");
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Login com Google bem-sucedido:", result);
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
    console.error("Erro ao fazer login com Google:", {
      code: error.code,
      message: error.message,
      details: error
    });
    throw error;
  }
}

export async function loginWithTwitter() {
  try {
    console.log("Iniciando login com Twitter...");
    console.log("Twitter provider config:", {
      scopes: twitterProvider._scopes,
      customParameters: twitterProvider._customParameters
    });
    const result = await signInWithPopup(auth, twitterProvider);
    console.log("Login com Twitter bem-sucedido:", result);
    const user = result.user;

    // Referência ao documento do usuário no Firestore
    const userRef = doc(db, "users", user.uid);
    const existingDoc = await getDoc(userRef);

    if (!existingDoc.exists()) {
      // Twitter may not provide displayName or email, use provider data
      const twitterData = user.providerData.find((data) => data.providerId === 'twitter.com');
      const name = user.displayName || twitterData?.displayName || 'Usuário Twitter';
      const email = user.email || twitterData?.email || null;
      const photoURL = user.photoURL || twitterData?.photoURL || null;

      await setDoc(userRef, {
        uid: user.uid,
        name,
        email,
        photoURL,
        fanLevel: 1,
        medals: [false, false, false, false, false],
        socialLinks: {},
      });
    }

    return { user, result }; // Return result for credential extraction
  } catch (error) {
    console.error("Erro ao fazer login com Twitter:", {
      code: error.code,
      message: error.message,
      details: error
    });
    throw error;
  }
}