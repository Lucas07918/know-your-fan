import { signInWithPopup, GoogleAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();

export const loginWithGoogle = async () => {
  try {
    console.log('Iniciando login com Google...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Login com Google bem-sucedido:', result);
    return { user: result.user };
  } catch (error) {
    console.error('Erro ao logar com Google:', error);
    throw error;
  }
};

export const loginWithTwitter = async () => {
  try {
    console.log('Iniciando login com Twitter...');
    const result = await signInWithPopup(auth, twitterProvider);
    console.log('Login com Twitter bem-sucedido:', result);
    return { user: result.user, result };
  } catch (error) {
    console.error('Erro ao logar com Twitter:', error);
    throw error;
  }
};