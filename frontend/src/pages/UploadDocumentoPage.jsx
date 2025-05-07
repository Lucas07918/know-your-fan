import { useState } from 'react';
import { VStack, FormControl, FormLabel, Input, Button, useToast, Box, Text } from '@chakra-ui/react';
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
          bg: 'yellow.400',
          color: '#121212',
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
    <VStack spacing={6} w="full">
      <FormControl isRequired>
        <FormLabel color="white" fontWeight="bold">Selecione o documento de identidade</FormLabel>
        <Box
          border="2px dashed"
          borderColor="yellow.400"
          borderRadius="md"
          p={4}
          bg="whiteAlpha.100"
          textAlign="center"
          _hover={{ bg: 'whiteAlpha.200' }}
          transition="background 0.2s ease"
          position="relative"
        >
          <Input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleDocumentChange}
            opacity={0}
            position="absolute"
            w="full"
            h="full"
            cursor="pointer"
          />
          <Text color="white" mb={2}>
            {document ? document.name : 'Arraste ou clique para selecionar o documento'}
          </Text>
        </Box>
      </FormControl>

      <FormControl>
        <FormLabel color="white" fontWeight="bold">Selfie (opcional, para validação facial)</FormLabel>
        <Box
          border="2px dashed"
          borderColor="yellow.400"
          borderRadius="md"
          p={4}
          bg="whiteAlpha.100"
          textAlign="center"
          _hover={{ bg: 'whiteAlpha.200' }}
          transition="background 0.2s ease"
          position="relative"
        >
          <Input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleSelfieChange}
            opacity={0}
            position="absolute"
            w="full"
            h="full"
            cursor="pointer"
          />
          <Text color="white" mb={2}>
            {selfie ? selfie.name : 'Arraste ou clique para selecionar a selfie'}
          </Text>
        </Box>
      </FormControl>

      {isUploading && (
        <Box mt={4}>
          <Text color="yellow.400">{loadingMessage}</Text>
        </Box>
      )}

      {isValid !== null && (
        <Box mt={4}>
          <Text color={isValid ? 'yellow.400' : 'red.500'}>
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
        w="full"
        _hover={{ bg: 'yellow.500' }}
      >
        {isUploading ? 'Validando...' : 'Enviar Documento'}
      </Button>
    </VStack>
  );
}

export default UploadDocumentoPage;
