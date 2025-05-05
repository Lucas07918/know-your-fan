import { useState } from 'react';
import { Button, Container, VStack, Text, HStack, Spinner } from '@chakra-ui/react';
import { loginWithGoogle, loginWithTwitter } from '../firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { BsTwitterX } from 'react-icons/bs';



function ConectarRedesPage({ setUserData }) {
  const [twitterLoading, setTwitterLoading] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);

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

      console.log('Usuário logado:', user);
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

      

      setTwitterConnected(true);
      alert('Conta Twitter conectada com sucesso!');
    } catch (error) {
      console.error('Erro ao conectar com Twitter:', {
        code: error.code,
        message: error.message,
        details: error
      });
      alert(`Não foi possível conectar com o Twitter: ${error.message}`);
    } finally {
      setTwitterLoading(false);
    }
  };

  

  return (
    <Container maxW="container.md" py={0}>
      <VStack spacing={6}>
        <Text textAlign="center" fontSize="lg" color="gray.500">
          Faça login com suas contas para continuar
        </Text>

        <Button onClick={handleConnectGoogle} size="lg" w="full" variant="outline">
          <HStack justify="center" w="full">
            <FcGoogle />
            <Text>Entrar com Google</Text>
          </HStack>
        </Button>

        <Button
          size="lg"
          w="full"
          variant="outline"
          onClick={handleConnectTwitter}
          isLoading={twitterLoading}
          isDisabled={twitterConnected}
        >
          <HStack justify="center" w="full">
            <BsTwitterX />
            <Text>{twitterConnected ? 'Twitter Conectado' : 'Entrar com Twitter'}</Text>
          </HStack>
        </Button>

        {twitterConnected && (
          <Text color="green.500" fontSize="sm">
            Conta Twitter conectada com sucesso!
          </Text>
        )}
      </VStack>
    </Container>
  );
}

export default ConectarRedesPage;


