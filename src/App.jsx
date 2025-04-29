import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from "react"
import LandingPage from './pages/LandingPage'
import CadastroPage from './pages/CadastroPage'
import UploadDocumentoPage from './pages/UploadDocumentoPage'
import ConectarRedesPage from './pages/ConectarRedesPage'
import HubPage from './pages/HubPage'
import PerfilPage from './pages/PerfilPage'
import EditProfilePage from "./pages/EditProfilePage";

function App() {
  const [userData, setUserData] = useState({
    fullName: "indefinido",
    address: "indefinido",
    cpf: "indefinido",
    interests: "indefinido",
    activities: "indefinido",
    socialLinks: [],
    fanLevel: 0,
  });

  function updateProfile({ fullName, address, cpf, interests, activities }) {
    setUserData(prev => ({
      ...prev,
      fullName,
      address,
      cpf,
      interests,
      activities,
    }));
  }

  function addSocialLink(newLink, updateExisting = false) {
    setUserData(prev => {
      const filteredLinks = (prev.socialLinks || []).filter(link => link !== undefined);

      if (updateExisting) {
        // Atualiza o status do link existente sem duplicá-lo
        return {
          ...prev,
          socialLinks: filteredLinks.map(item =>
            item.link === newLink.link ? { ...item, status: newLink.status } : item
          )
        };
      } else {
        // Adiciona um novo link
        return {
          ...prev,
          socialLinks: [...filteredLinks, newLink]
        };
      }
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
      <Route path="/cadastro" element={<CadastroPage updateProfile={updateProfile} />} />
      <Route path="/upload-documento" element={<UploadDocumentoPage />} />
      <Route path="/conectar-redes" element={<ConectarRedesPage setUserData={setUserData} />} />
      <Route path="/hub" element={<HubPage userData={userData} addSocialLink={addSocialLink} updateFanLevel={updateFanLevel} />} />
      <Route path="/perfil" element={<PerfilPage userData={userData} />} />
      <Route path="/editar-perfil" element={<EditProfilePage userData={userData} setUserData={setUserData} />} />
    </Routes>
  )
}

export default App
