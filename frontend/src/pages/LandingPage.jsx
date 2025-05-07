import { Box, Container, Heading, Text, Button, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/cadastro')
  }

  return (
    <Box bg="gray.900" minH="100vh" color="white" py={20}>
      <Container maxW="container.md" centerContent>
        <VStack spacing={6}>
          <Heading as="h1" size="2xl" textAlign="center" color="yellow.400">
            Conheça seu fã interior 🎮
          </Heading>
          <Text fontSize="lg" textAlign="center" color="gray.300">
            Ajude a FURIA a criar experiências épicas conhecendo mais sobre você!
          </Text>
          <Button 
            bg="yellow.400" 
            color="black"
            _hover={{ bg: 'yellow.300' }}
            size="lg" 
            onClick={handleStart}
          >
            Começar
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}

export default LandingPage
