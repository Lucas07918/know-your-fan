import { Container, Heading, Text, Button, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/cadastro')
  }

  return (
    <Container maxW="container.md" centerContent py={20}>
      <VStack spacing={6}>
        <Heading as="h1" size="2xl" textAlign="center">
          Conheça seu fãn interior 🎮
        </Heading>
        <Text fontSize="lg" textAlign="center">
          Ajude a FURIA a criar experiências épicas conhecendo mais sobre você!
        </Text>
        <Button 
          colorScheme="yellow" 
          size="lg" 
          onClick={handleStart}
        >
          Começar
        </Button>
      </VStack>
    </Container>
  )
}

export default LandingPage
