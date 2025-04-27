import { useState } from 'react'
import { Container, Heading, VStack, FormControl, FormLabel, Input, Button, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

function UploadDocumentoPage() {
  const [file, setFile] = useState(null)
  const [validationStatus, setValidationStatus] = useState('')
  
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleValidate = () => {
    if (file) {
      // Aqui futuramente entraria a "validação via AI"
      setValidationStatus('Documento validado com sucesso! ✅')
      setTimeout(() => {
            navigate('/conectar-redes')
        }, 1000)
    } else {
      setValidationStatus('Por favor, selecione um documento para validar.')
    }
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6}>
        <Heading as="h2" size="xl" textAlign="center">
          Upload de Documento 📄
        </Heading>

        <FormControl isRequired>
          <FormLabel>Escolha um documento (frente e verso, se possível)</FormLabel>
          <Input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
        </FormControl>

        <Button colorScheme="yellow" size="lg" w="full" onClick={handleValidate}>
          Validar Documento
        </Button>

        {validationStatus && (
          <Text fontSize="lg" color="green.500" textAlign="center">
            {validationStatus}
          </Text>
        )}
      </VStack>
    </Container>
  )
}

export default UploadDocumentoPage
