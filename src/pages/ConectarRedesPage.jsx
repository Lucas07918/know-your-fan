// import { Button, Container, Heading, VStack, Text, HStack, Image } from '@chakra-ui/react'
// import { useNavigate } from 'react-router-dom'
// import { loginWithGoogle } from '../firebase/auth'
// import { FcGoogle } from "react-icons/fc";
// import { BsTwitterX } from "react-icons/bs";
// import { REDIRECT_URI } from '../config/env';


// function ConectarRedesPage({ setUserData }) {
//   const navigate = useNavigate()

//   const handleConnectGoogle = async () => {
//     try {
//       const { user } = await loginWithGoogle()

//       // Atualiza o userData com os dados do usuário logado
//       setUserData(prev => ({
//         ...prev,
//         name: user.displayName,
//         email: user.email,
//         photoURL: user.photoURL,
//         socialLinks: [...(prev.socialLinks || []), {
//           link: `https://instagram.com/${user.displayName.replace(/\s+/g, '')}`,
//           status: 'pendente'
//         }]
//       }))
//       console.log('Usuário logado:', user)

//       setTimeout(() => {
//         navigate('/hub')
//       }, 300)
//  // só redireciona depois do login com sucesso
//     } catch (error) {
//       console.error('Erro ao conectar com Google:', error)
//       alert('Não foi possível conectar com o Google. Tente novamente.')
//     }
//   }

//   const handleConnectTwitter = () => {
//     const TWITTER_CLIENT_ID = import.meta.env.VITE_TWITTER_CLIENT_ID;
//     const redirectUri = REDIRECT_URI;
//     const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=tweet.read users.read offline.access&state=state123&code_challenge=challenge&code_challenge_method=plain`;
//     window.location.href = authUrl;
//   };

//   return (
//     <Container maxW="container.md" py={10}>
//       <VStack spacing={6}>
//         <Heading as="h2" size="xl" textAlign="center">
//           Conectar Conta Google 🎮
//         </Heading>

//         <Text textAlign="center" fontSize="lg" color="gray.500">
//           Faça login com sua conta Google para continuar
//         </Text>

//         <Button onClick={handleConnectGoogle} size="lg" w="full" variant="outline">
//           <HStack justify="center" w="full">
//             <FcGoogle />
//             <Text>Entrar com Google</Text>
//           </HStack>
//         </Button>
//         <Button colorScheme="blue" size="lg" w="full" onClick={handleConnectTwitter}>
//           <HStack justify="center" w="full">
//             <BsTwitterX />
//             <Text>Conectar com o Twitter</Text>
//           </HStack>
//         </Button>
//       </VStack>
//     </Container>
//   )
// }

// export default ConectarRedesPage


import { Button, Container, Heading, VStack, Text, HStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { loginWithGoogle } from '../firebase/auth'
import { FcGoogle } from "react-icons/fc";
import { BsTwitterX } from "react-icons/bs";

function ConectarRedesPage({ setUserData }) {
  const navigate = useNavigate();

  const handleConnectGoogle = async () => {
    try {
      const { user } = await loginWithGoogle();

      setUserData(prev => ({
        ...prev,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        socialLinks: [...(prev.socialLinks || []), {
          link: `https://instagram.com/${user.displayName.replace(/\s+/g, '')}`,
          status: 'pendente'
        }]
      }));

      console.log('Usuário logado:', user);
      setTimeout(() => navigate('/hub'), 300);
    } catch (error) {
      console.error('Erro ao conectar com Google:', error);
      alert('Não foi possível conectar com o Google. Tente novamente.');
    }
  };

  const base64urlEncode = buffer => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const generateCodeVerifierAndChallenge = async () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const codeVerifier = base64urlEncode(array);

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const codeChallenge = base64urlEncode(digest);

    return { codeVerifier, codeChallenge };
  };

  const handleConnectTwitter = async () => {
    const client_id = "UURwTVh3WlBfRzkwaHQzUEtxeTY6MTpjaQ";
    const redirect_uri = "http://localhost:5173/callback";
    const state = crypto.randomUUID();

    const { codeVerifier, codeChallenge } = await generateCodeVerifierAndChallenge();
    localStorage.setItem("twitter_code_verifier", codeVerifier);

    const twitterAuthUrl = `https://x.com/i/oauth2/authorize?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=tweet.read users.read offline.access&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    window.location.href = twitterAuthUrl;
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6}>
        <Heading as="h2" size="xl" textAlign="center">
          Conectar Conta Google 🎮
        </Heading>

        <Text textAlign="center" fontSize="lg" color="gray.500">
          Faça login com sua conta Google para continuar
        </Text>

        <Button onClick={handleConnectGoogle} size="lg" w="full" variant="outline">
          <HStack justify="center" w="full">
            <FcGoogle />
            <Text>Entrar com Google</Text>
          </HStack>
        </Button>

        <Button colorScheme="blue" size="lg" w="full" onClick={handleConnectTwitter}>
          <HStack justify="center" w="full">
            <BsTwitterX />
            <Text>Conectar com o Twitter</Text>
          </HStack>
        </Button>
      </VStack>
    </Container>
  );
}

export default ConectarRedesPage;


