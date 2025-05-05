import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "./firebase/config"

import LandingPage from './pages/LandingPage'
import CadastroPage from './pages/CadastroPage'
import UploadDocumentoPage from './pages/UploadDocumentoPage'
import ConectarRedesPage from './pages/ConectarRedesPage'
import HubPage from './pages/HubPage'
import PerfilPage from './pages/PerfilPage'
import EditProfilePage from "./pages/EditProfilePage"
import EarnPointsPage from './pages/EarnPointsPage'
import CallbackPage from './pages/CallbackPage'
import AddEsportsProfilePage from './pages/AddEsportsProfilePage'

function App() {
  const [userData, setUserData] = useState(null);
  const [uid, setUid] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        // busca dados do Firestore
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUserData(snap.data());
        }
      } else {
        setUid(null);
        setUserData(null);
      }
    });
    return () => unsub();
  }, []);

  async function handleUpdateProfile({ fullName, address, cpf, interests, events, products }) {
    const updatedData = {
      ...userData,
      fullName,
      address,
      cpf,
      interests,
      events,
      products,
      validated: true
    }

    setUserData(updatedData);

    if (uid) {
      try {
        await setDoc(doc(db, "users", uid), updatedData, { merge: true });
        console.log("Perfil salvo com sucesso no Firestore");
      } catch (err) {
        console.error("Erro ao salvar perfil:", err);
      }
    }
  }

  console.log("uid app: ", uid)

  function addSocialLink(newLink, updateExisting = false) {
    setUserData(prev => {
      const filteredLinks = (prev.socialLinks || []).filter(link => link !== undefined);

      const updatedSocialLinks = updateExisting
        ? filteredLinks.map(item =>
            item.link === newLink.link ? { ...item, status: newLink.status } : item
          )
        : [...filteredLinks, newLink];

      return {
        ...prev,
        socialLinks: updatedSocialLinks
      };
    });
  }

  function updateFanLevel(newLevel) {
    setUserData(prev => ({
      ...prev,
      fanLevel: newLevel,
    }));
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/cadastro" element={<CadastroPage setUserData={setUserData} updateProfile={handleUpdateProfile} />} />
      <Route path="/upload-documento" element={<UploadDocumentoPage />} />
      <Route path="/conectar-redes" element={<ConectarRedesPage userData={userData} setUserData={setUserData} />} />
      <Route path="/hub" element={<HubPage uid={uid} userData={userData} addSocialLink={addSocialLink} updateFanLevel={updateFanLevel} />} />
      <Route path="/perfil" element={<PerfilPage userData={userData} />} />
      <Route path="/editar-perfil" element={<EditProfilePage userData={userData} setUserData={setUserData} />} />
      <Route path="/ganhar-pontos" element={<EarnPointsPage />} />
      <Route path="/callback" element={<CallbackPage setUserData={setUserData} />} />
      <Route path="/add-esports-profile" element={<AddEsportsProfilePage userData={userData} setUserData={setUserData} />} />
    </Routes>
  )
}

export default App
