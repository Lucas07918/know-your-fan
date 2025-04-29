import { Button, Container, Heading, VStack, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

function ConectarRedesPage({ setUserData }) {
  const navigate = useNavigate()

  const handleConnectTwitter = () => {
    console.log('Conectando com o Twitter...')

    // Atualizar o userData adicionando "Twitter" aos socialLinks
    setUserData(prev => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), { link: 'https://twitter.com/seuperfil', status: 'validado' }]
    }))


    setTimeout(() => {
      navigate('/hub')  // Agora vai direto pro hub!
    }, 500) // Pequeno delay pra ficar mais suave
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6}>
        <Heading as="h2" size="xl" textAlign="center">
          Conectar Redes Sociais 🎮
        </Heading>

        <Text textAlign="center" fontSize="lg" color="gray.500">
          Conecte suas redes sociais para melhorar sua experiência personalizada!
        </Text>

        <Button
          colorScheme="blue"
          size="lg"
          w="full"
          onClick={handleConnectTwitter}
        >
          Conectar com o Twitter
        </Button>

        {/* Depois podemos adicionar botões para Steam, Faceit, etc */}
      </VStack>
    </Container>
  )
}

export default ConectarRedesPage
