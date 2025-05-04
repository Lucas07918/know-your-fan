import { useState } from 'react';
import { Button, Container, VStack, Text, HStack, Spinner } from '@chakra-ui/react';
import { loginWithGoogle, loginWithTwitter } from '../firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { BsTwitterX } from 'react-icons/bs';
import { TwitterAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import axios from 'axios';
import { db } from '../firebase/config'; // Adjust path to your firebase.js

const esportsKeywords = [
  'CS:GO', 'Counter-Strike 2', 'Valorant', 'League of Legends', 'Wild Rift', 'TFT',
  'Dota 2', 'PUBG Mobile', 'Free Fire', 'Rainbow Six', 'Rocket League', 'Fortnite',
  'Apex Legends', 'Overwatch 2', 'Call of Duty', 'CBLOL', 'FURIA', 'LOUD', 'MIBR',
  'paiN Gaming', 'INTZ', 'RED Canids', 'Fluxo', 'G2 Esports', 'NAVI', 'FaZe Clan',
  '100 Thieves', 'TSM', 'Team Liquid', 'Cloud9', 'Evil Geniuses', 'SK Gaming',
  'Competitivo', 'Streamers', 'Skins', 'Watch Parties', 'Pro Player', 'IGL',
  'Sniper', 'Entry Fragger', 'Coach', 'Analista', 'Caster', 'Narrador', 'Influencer',
  'FPS', 'MOBA', 'Tier 1', 'Tier 2', 'Fantasy League', 'Clips e Highlights',
];

function ConectarRedesPage({ setUserData, userData }) {
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
      const { user, result } = await loginWithTwitter();
      console.log('Usuário autenticado com Twitter:', user);

      // Get Twitter credential
      const credential = TwitterAuthProvider.credentialFromResult(result);
      if (!credential) {
        throw new Error('Falha ao obter credenciais do Twitter');
      }
      const accessToken = credential.accessToken;
      console.log('Access token:', accessToken.slice(0, 10) + '...');

      // Fetch Twitter data via proxy
      const twitterData = await fetchTwitterData(accessToken, userData);
      console.log('Dados do Twitter obtidos:', twitterData);

      // Save to Firebase
      await saveToFirebase(user.uid, twitterData);
      console.log('Dados salvos no Firebase');

      // Update userData
      setUserData((prev) => ({
        ...prev,
        twitter: {
          id: twitterData.id,
          username: twitterData.username,
          following: twitterData.following,
          esportsTweets: twitterData.esportsTweets,
        },
      }));

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

  const fetchTwitterData = async (accessToken, userData) => {
    try {
      console.log('Fetching Twitter data with URLs:');
      console.log('- Users: http://localhost:3001/twitter-api/users-me');
      console.log('- Following: http://localhost:3001/twitter-api/following');
      console.log('- Tweets: http://localhost:3001/twitter-api/tweets');
      // Fetch user profile via proxy
      const userResponse = await axios.get('http://localhost:3001/twitter-api/users-me', {
        params: { accessToken },
      });
      const { id, username } = userResponse.data.data;

      // Fetch following via proxy
      const followingResponse = await axios.get('http://localhost:3001/twitter-api/following', {
        params: { accessToken, userId: id },
      });
      const following = followingResponse.data.data.map((f) => ({
        id: f.id,
        username: f.username,
        name: f.name,
      }));

      // Fetch recent tweets via proxy
      const tweetsResponse = await axios.get('http://localhost:3001/twitter-api/tweets', {
        params: { accessToken, userId: id },
      });
      const tweets = tweetsResponse.data.data || [];

      // Filter esports-related tweets
      const combinedKeywords = [
        ...esportsKeywords,
        ...(userData?.interests || []).map((i) => i.toLowerCase()),
      ];
      const esportsTweets = tweets
        .filter((tweet) => {
          const text = tweet.text.toLowerCase();
          const entities = tweet.entities || {};
          const hashtags = (entities.hashtags || []).map((h) => h.tag.toLowerCase());
          const mentions = (entities.mentions || []).map((m) => m.username.toLowerCase());
          return combinedKeywords.some((keyword) =>
            text.includes(keyword.toLowerCase()) ||
            hashtags.includes(keyword.toLowerCase()) ||
            mentions.includes(keyword.toLowerCase())
          );
        })
        .map((tweet) => ({
          id: tweet.id,
          text: tweet.text,
          created_at: tweet.created_at,
        }));

      return { id, username, following, esportsTweets };
    } catch (error) {
      console.error('Twitter API proxy error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error('Falha ao buscar dados do Twitter.');
    }
  };

  const saveToFirebase = async (uid, twitterData) => {
    try {
      await setDoc(doc(db, 'users', uid, 'social', 'twitter'), twitterData, { merge: true });
    } catch (error) {
      console.error('Firebase save error:', error);
      throw new Error('Falha ao salvar dados no Firebase.');
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