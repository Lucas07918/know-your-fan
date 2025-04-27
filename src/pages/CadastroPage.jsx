import { useState } from 'react'
import { Container, Heading, VStack, FormControl, FormLabel, Input, Textarea, Button, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'



function CadastroPage({ setUserData }) {
  // 🎯 Estados para cada campo
  const [fullName, setFullName] = useState('')
  const [address, setAddress] = useState('')
  const [cpf, setCpf] = useState('')
  const [interests, setInterests] = useState('')
  const [activities, setActivities] = useState('')
  
  const navigate = useNavigate()
  
  const toast = useToast()  
  

  const handleSubmit = (e) => {
    e.preventDefault()

    // 🎯 Dados reunidos
    setUserData({
      fullName,
      address,
      cpf,
      interests,
      activities,
    })
    
    
    toast({
        title: 'Cadastro enviado!',
        description: 'Agora vamos validar seu documento 📄',
        status: 'success',
        duration: 3000,
        isClosable: true,
    })

    // Espera 1 segundo pra deixar o usuário ver o toast
    setTimeout(() => {
        navigate('/upload-documento')
    }, 1000)

    // depois a gente pode salvar isso num backend ou localStorage
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
        <Heading as="h2" size="xl" textAlign="center">
          Cadastro de Fã 🎮
        </Heading>

        <FormControl isRequired>
          <FormLabel>Nome completo</FormLabel>
          <Input
            placeholder="Seu nome"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Endereço</FormLabel>
          <Input
            placeholder="Rua, número, cidade"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>CPF</FormLabel>
          <Input
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Interesses em e-sports</FormLabel>
          <Textarea
            placeholder="Quais jogos, times ou eventos você gosta?"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Atividades/Compras no último ano</FormLabel>
          <Textarea
            placeholder="Eventos que participou, produtos que comprou..."
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
          />
        </FormControl>

        <Button type="submit" colorScheme="yellow" size="lg" w="full">
          Continuar
        </Button>
      </VStack>
    </Container>
  )
}

export default CadastroPage
