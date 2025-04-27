import { Container, VStack, Heading, Button, Input, Box, Text, Progress } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function HubPage({ userData, setUserData }) {
  const navigate = useNavigate()
  const [newLink, setNewLink] = useState('')  // Controlar input do novo link

  const handleAddLink = () => {
    if (newLink) {
      const isValid = newLink.toLowerCase().includes('furia') || newLink.toLowerCase().includes('esports')

      if (isValid) {
        setUserData(prev => ({
          ...prev,
          socialLinks: [...prev.socialLinks, newLink],
          fanLevel: prev.fanLevel + 10,  // Aumenta o nível de fã também no userData
        }))
      } else {
        alert('Link inválido. Insira um link de perfil de e-sports válido.')
      }

      setNewLink('')
    }
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="stretch">
        <Heading as="h2" size="xl" textAlign="center">
          Hub de E-sports 🎮
        </Heading>

        {/* Mostrar nível de fã com uma barra de progresso */}
        <Box w="full" textAlign="center">
          <Text fontSize="lg" fontWeight="bold">Nível de Fã</Text>
          <Progress value={userData.fanLevel} size="lg" colorScheme="green" hasStripe isAnimated />
          <Text fontSize="xl">{userData.fanLevel}% - Você é um fã em crescimento! 🚀</Text>
        </Box>

        {/* Campo para adicionar novo link de perfil */}
        <Box w="full" textAlign="center">
          <Input
            placeholder="Adicione um link de perfil de e-sports"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            mb={3}
          />
          <Button onClick={handleAddLink} colorScheme="teal" size="lg" w="full">
            Adicionar Link
          </Button>
        </Box>

        {/* Exibir links de perfis conectados */}
        <Box w="full">
          <Text fontSize="lg" fontWeight="bold">Perfis Conectados:</Text>
          {userData.socialLinks.length > 0 ? (
            <VStack spacing={3}>
              {userData.socialLinks.map((link, index) => (
                <Box key={index} p={3} borderWidth={1} borderRadius="md" w="full" textAlign="center">
                  <Text>{link}</Text>
                  <Text fontSize="sm" color="gray.500">Status: Validando...</Text>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text color="gray.500">Nenhum link de perfil adicionado ainda.</Text>
          )}
        </Box>

        {/* Botão para navegar para o perfil */}
        <Button colorScheme="blue" onClick={() => navigate('/perfil')} w="full">
          Ver Perfil
        </Button>
      </VStack>
    </Container>
  )
}

export default HubPage
