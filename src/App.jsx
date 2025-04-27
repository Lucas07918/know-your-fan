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

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/cadastro" element={<CadastroPage setUserData={setUserData} />} />
      <Route path="/upload-documento" element={<UploadDocumentoPage />} />
      <Route path="/conectar-redes" element={<ConectarRedesPage setUserData={setUserData} />} />
      <Route path="/hub" element={<HubPage userData={userData} setUserData={setUserData} />} />
      <Route path="/perfil" element={<PerfilPage userData={userData} />} />
      <Route path="/editar-perfil" element={<EditProfilePage userData={userData} setUserData={setUserData} />} />
    </Routes>
  )
}

export default App
