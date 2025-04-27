import { Container, Heading, VStack, Text, Box, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

function PerfilPage({userData}) {
  const navigate = useNavigate()
  console.log(userData)

  const handleEditProfile = () => {
    // Redireciona para a página de edição de perfil, por exemplo
    navigate('/editar-perfil')
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6}>
        <Heading as="h2" size="xl" textAlign="center">
          Seu Perfil 🕹️
        </Heading>

        {/* Exibição das informações do usuário */}
        <Box p={6} borderWidth={1} borderRadius="md" w="full" textAlign="center">
          <Text fontSize="lg" fontWeight="bold">
            Nome: <span style={{ fontWeight: 'normal' }}>{ userData.fullName }</span>
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            Interesses: <span style={{ fontWeight: 'normal' }}>{ userData.interests }</span>
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            Atividades de E-sports: <span style={{ fontWeight: 'normal' }}>{ userData.activities }</span>
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            Twitter: <span style={{ fontWeight: 'normal' }}>Conectado ✅</span>
          </Text>
        </Box>

        <Button colorScheme="blue" onClick={handleEditProfile}>
          Editar Perfil
        </Button>
      </VStack>
    </Container>
  )
}

export default PerfilPage
