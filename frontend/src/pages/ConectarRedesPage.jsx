import { useState } from 'react';
import { Button, Container, VStack, Text, HStack, useToast } from '@chakra-ui/react';
import { loginWithGoogle, loginWithTwitter } from '../firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { BsTwitterX } from 'react-icons/bs';

function ConectarRedesPage({ setUserData }) {
  const [twitterLoading, setTwitterLoading] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const toast = useToast();

  const handleConnectGoogle = async () => {
    try {
      const { user } = await loginWithGoogle();
      setUserData((prev) => ({
        ...prev,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        socialLinks: [...(prev.socialLinks || []), {
          link: `https://instagram.com/${user.displayName.replace(/\s+/g, '')}`,
          status: 'pendente',
        }],
      }));
      setGoogleConnected(true);
      toast({
        title: 'Sucesso!',
        description: 'Conta Google conectada com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        bg: 'yellow.400',
        color: '#121212',
      });
    } catch (error) {
      console.error('Erro ao conectar com Google:', error);
      alert('Não foi possível conectar com o Google. Tente novamente.');
      if (typeof setUserData !== 'function') {
        console.error('setUserData não foi passado corretamente!');
        return;
      }
    }
  };

  const handleConnectTwitter = async () => {
    setTwitterLoading(true);
    try {
      const { user } = await loginWithTwitter();
      console.log('Usuário autenticado com Twitter:', user);
      setUserData((prev) => ({
        ...prev,
        twitter: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
      }));
      setTwitterConnected(true);
      toast({
        title: 'Sucesso!',
        description: 'Conta X conectada com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        bg: 'yellow.400',
        color: '#121212',
      });
    } catch (error) {
      console.error('Erro ao conectar com Twitter:', {
        code: error.code,
        message: error.message,
        details: error,
      });
      alert(`Não foi possível conectar com o Twitter: ${error.message}`);
    } finally {
      setTwitterLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={0}>
      <VStack spacing={6}>
        <Text textAlign="center" fontSize="lg" color="white">
          Conecte suas redes sociais
        </Text>
        <HStack spacing={4}>
          <Button
            onClick={handleConnectGoogle}
            w="60px"
            h="60px"
            p={0}
            variant="outline"
            borderColor="yellow.400"
            borderRadius="md"
            bg={googleConnected ? 'yellow.400' : 'transparent'}
            color={googleConnected ? '#121212' : 'white'}
            _hover={{ bg: 'yellow.400', color: '#121212' }}
            isDisabled={googleConnected}
          >
            <FcGoogle size="24px" />
          </Button>
          <Button
            w="60px"
            h="60px"
            p={0}
            variant="outline"
            borderColor="yellow.400"
            borderRadius="md"
            bg={twitterConnected ? 'yellow.400' : 'transparent'}
            color={twitterConnected ? '#121212' : 'white'}
            _hover={{ bg: 'yellow.400', color: '#121212' }}
            onClick={handleConnectTwitter}
            isLoading={twitterLoading}
            isDisabled={twitterConnected}
          >
            <BsTwitterX size="24px" />
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
}

export default ConectarRedesPage;


