import { useState } from "react";
import { Button, Input, Textarea, Box, FormControl, FormLabel } from "@chakra-ui/react";

const EditProfilePage = ({ userData, setUserData }) => {
  // Estado para armazenar as edições
  const [name, setName] = useState(userData.name);
  const [interests, setInterests] = useState(userData.interests);
  const [socialLinks, setSocialLinks] = useState(userData.socialLinks);
  console.log("nome: ",userData.name)

  // Função para salvar as alterações
  const handleSave = () => {
    setUserData({
      ...userData,
      name,
      interests,
      socialLinks,
    });
    alert("Perfil atualizado!");
  };

  return (
      <Box p={4}>
      <FormControl>
        <FormLabel>Nome</FormLabel>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite seu nome"
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Interesses</FormLabel>
        <Textarea
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="Quais são seus interesses em e-sports?"
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Links de Redes Sociais</FormLabel>
        <Input
          value={socialLinks}
          onChange={(e) => setSocialLinks(e.target.value)}
          placeholder="Insira links das suas redes sociais"
        />
      </FormControl>
      <Button mt={6} colorScheme="teal" onClick={handleSave}>
        Salvar
      </Button>
    </Box>
  );
};

export default EditProfilePage;
