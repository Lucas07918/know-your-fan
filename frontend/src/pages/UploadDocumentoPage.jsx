import { useState } from 'react';
import { Container, VStack, FormControl, FormLabel, Input, Button, useToast, Box, Text } from '@chakra-ui/react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import axios from 'axios';

function UploadDocumentoPage({ userData, setUserData }) {
  const [document, setDocument] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  const toast = useToast();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  const validateFile = (file) => {
    const maxSize = 15 * 1024 * 1024; // 15MB
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return 'Formato inválido. Use JPEG ou PNG.';
    }
    if (file.size > maxSize) {
      return 'Arquivo muito grande. Máximo 15MB.';
    }
    return null;
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        toast({
          title: 'Erro!',
          description: error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      setDocument(file);
    }
  };

  const handleSelfieChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        toast({
          title: 'Erro!',
          description: error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      setSelfie(file);
    }
  };

  const handleUpload = async () => {
    if (!document) {
      toast({
        title: 'Erro!',
        description: 'Por favor, faça o upload de um documento.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast({
        title: 'Erro!',
        description: 'Usuário não autenticado. Faça login novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsUploading(false);
      return;
    }

    setIsUploading(true);
    setLoadingMessage('Validando documento...');

    try {
      const formData = new FormData();
      formData.append('document', document);
      if (selfie) {
        formData.append('selfie', selfie);
      }
      formData.append('fullName', userData.fullName || '');

      const response = await axios.post(`${BACKEND_URL}/validate-document`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { isValid, details } = response.data;

      setIsValid(isValid);

      if (isValid) {
        const updateData = {
          documentValidated: true,
          documentValidationDetails: details,
          documentValidatedAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', user.uid), updateData, { merge: true });

        setUserData((prev) => ({
          ...prev,
          ...updateData,
        }));

        toast({
          title: 'Documento validado!',
          description: 'Sua identidade foi validada com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Documento inválido!',
          description: details || 'O documento não pôde ser validado. Tente novamente.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      setIsValid(false);
      const errorDetails = error.response?.data?.details || error.message;
      const errorCode = error.response?.data?.code || 'Unknown';
      console.error('Document validation error:', { errorDetails, errorCode, stack: error.stack });
      toast({
        title: 'Erro ao validar documento!',
        description: `Erro: ${errorDetails} (Código: ${errorCode})`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6}>
        <FormControl isRequired>
          <FormLabel>Selecione o documento de identidade</FormLabel>
          <Input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleDocumentChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Selfie (opcional, para validação facial)</FormLabel>
          <Input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleSelfieChange}
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
          isDisabled={isUploading || !document}
          mt={6}
        >
          {isUploading ? 'Validando...' : 'Enviar Documento'}
        </Button>
      </VStack>
    </Container>
  );
}

export default UploadDocumentoPage;