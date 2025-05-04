import { useState } from 'react'
import { Container, Heading, VStack, FormControl, FormLabel, Input, Button, useToast, Box, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

function UploadDocumentoPage() {
  const [document, setDocument] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isValid, setIsValid] = useState(null) // Para indicar se a validação foi bem-sucedida
  const [loadingMessage, setLoadingMessage] = useState('')
  
  const toast = useToast()
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setDocument(file)
    }
  }

  const handleUpload = async () => {
    if (!document) {
      toast({
        title: 'Erro!',
        description: 'Por favor, faça o upload de um documento.',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return
    }

    setIsUploading(true)
    setLoadingMessage('Validando documento...')

    // Simulação de chamada à API para validar o documento com AI
    // Exemplo de API que poderia ser usada: AWS Rekognition ou qualquer outra solução
    try {
      // Aqui você pode colocar a lógica de validação do documento, substituindo este tempo de espera
      await new Promise(resolve => setTimeout(resolve, 3000)) // Simulação de espera
      setIsValid(true) // Após validação com AI, isso seria atualizado conforme o resultado

      toast({
        title: 'Documento validado!',
        description: 'Sua identidade foi validada com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true
      })

      setTimeout(() => {
        navigate('/conectar-redes') // Redireciona para a página de sucesso ou próxima etapa
      }, 1000)
    } catch (error) {
      setIsValid(false)
      toast({
        title: 'Erro ao validar documento!',
        description: 'Houve um problema ao validar seu documento. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true
      }, error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Container maxW="container.md" >
      <VStack spacing={6}>
        <FormControl isRequired>
          <FormLabel>Selecione o documento de identidade</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </FormControl>

        {isUploading && (
          <Box mt={4}>
            <Text>{loadingMessage}</Text>
          </Box>
        )}

        {isValid !== null && (
          <Box mt={4}>
            <Text color={isValid ? 'green.500' : 'red.500'}>
              {isValid ? 'Documento validado com sucesso!' : 'Falha na validação do documento. Tente novamente.'}
            </Text>
          </Box>
        )}

        <Button
          colorScheme="yellow"
          isLoading={isUploading}
          onClick={handleUpload}
          disabled={isUploading || !document}
          mt={6}
        >
          {isUploading ? 'Validando...' : 'Enviar Documento'}
        </Button>
      </VStack>
    </Container>
  )
}

export default UploadDocumentoPage
