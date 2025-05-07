import { useState, useEffect, useMemo } from "react";
import TwitchLiveCard from "../components/TwitchLiveCard";
import { Box, Flex, SimpleGrid, Grid, GridItem, Text } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import RecommendedProductCard from "../components/RecommendedProductCard";
import UpcomingMatchCard from "../components/UpcomingMatchCard";
import EsportsNewsCard from "../components/EsportsNewsCard";
import axios from "axios";
import PlayerInfoCard from "../components/PlayerInfoCard";
import { useNavigate } from "react-router-dom";
import esportsTags from "../datas/esports_news_tags.json";

const NEWSAPI_KEY = import.meta.env.VITE_NEWSAPI_KEY;

export default function HubPage({ uid, userData }) {
  const [twitchData, setTwitchData] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);
  const navigate = useNavigate();

  // Memoize interests to prevent reference changes
  const memoizedInterests = useMemo(() => userData?.interests || [], [userData?.interests]);

  // Debug render count
  console.log('HubPage rendered:', { uid, interests: memoizedInterests });

  useEffect(() => {
    async function loadUserData() {
      if (!userData || !uid) {
        console.log('Missing userData or uid:', { userData, uid });
        return;
      }

      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          console.log("Usuário não encontrado no Firestore.");
          return;
        }
        const data = userSnap.data();

        const interests = Array.isArray(data.interests) ? data.interests : [];
        const twitchMap = { furia: "furiatv", loud: "loud", "pai n": "painlive", "g2 esports": "g2esports" };
        const twitchChannels = interests.map(i => twitchMap[i.toLowerCase()]).filter(Boolean);
        console.log("Canais Twitch mapeados:", twitchChannels);
        setTwitchData(twitchChannels);
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
      }
    }

    async function fetchNewsArticles() {
      try {
        const query = esportsTags.tags.slice(0, 20).join(" OR ");
        console.log("Fetching news with query:", query);
        const response = await axios.get(
          "https://newsapi.org/v2/everything",
          {
            params: {
              q: "valorant",
              domains: "ign.com",
              sortBy: "publishedAt",
              apiKey: NEWSAPI_KEY,
              pageSize: 3,
            },
          }
        );

        if (response.data.articles.length > 0) {
          setNewsArticles(response.data.articles);
        } else {
          setNewsError("Nenhuma notícia sobre e-sports encontrada.");
        }
      } catch (err) {
        setNewsError("Erro ao buscar notícias: " + err.message);
        console.error("Erro ao buscar notícias da NewsAPI:", err);
      } finally {
        setNewsLoading(false);
      }
    }

    loadUserData();
    if (NEWSAPI_KEY) {
      fetchNewsArticles();
    } else {
      setNewsError("Chave da NewsAPI não configurada.");
      setNewsLoading(false);
    }
  }, [uid, userData]); // Stable dependencies

  return (
    <Flex
      gap={6}
      backgroundImage="url('https://img.freepik.com/fotos-gratis/fundo-claro_24972-1415.jpg?semt=ais_hybrid&w=740')"
      backgroundColor="#272727"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      <Box
        flex="1"
        display="flex"
        flexDirection="row"
        gap={4}
        px="10%"
        py={10}
        h="100vh"
        backgroundColor="rgba(0, 0, 0, 0.6)"
      >
        <Box flex="3" display="flex" flexDirection="column" gap={4} h="100%">
          <SimpleGrid h="25%" columns={3} spacing={4}>
            <EsportsNewsCard
              article={newsArticles[0]}
              index={0}
              isLoading={newsLoading}
              error={newsError}
            />
            <EsportsNewsCard
              article={newsArticles[1]}
              index={1}
              isLoading={newsLoading}
              error={newsError}
            />
            <EsportsNewsCard
              article={newsArticles[2]}
              index={2}
              isLoading={newsLoading}
              error={newsError}
            />
          </SimpleGrid>

          <Grid h="50%" templateRows="repeat(1, 1fr)" templateColumns="repeat(4, 1fr)" gap={4}>
            <GridItem colSpan={1}>
              <PlayerInfoCard interests={memoizedInterests} playerName="FalleN" />
            </GridItem>
            <GridItem colSpan={3}>
              <UpcomingMatchCard interests={memoizedInterests} />
            </GridItem>
          </Grid>

          <SimpleGrid h="25%" columns={2} spacing={4}>
            {twitchData ? (
              <TwitchLiveCard canais={twitchData} />
            ) : (
              <CardItem title="Ao vivo na Twitch" height="100%" />
            )}
            <CardItem
              title="Perfis de E-sports"
              subtitle="Adicione seus perfis de e-sports para mostrar suas conquistas"
              height="100%"
              onClick={() => navigate('/add-esports-profile')}
            />
          </SimpleGrid>
        </Box>

        <Box width="15%" display="flex" flexDirection="column" gap={4} h="100%">
          <RecommendedProductCard interests={memoizedInterests} />
        </Box>
      </Box>
    </Flex>
  );
}

function CardItem({ title, subtitle, height = "150px", onClick }) {
  return (
    <Box
      bg="linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(51, 51, 51, 0.3) 100%)"
      backdropFilter="blur(5px)"
      borderRadius="2xl"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={height}
      color="white"
      fontWeight="bold"
      transition="all 0.3s ease"
      boxShadow="0 2px 10px rgba(0,0,0,0.9)"
      _hover={{
        transform: "scale(1.02)",
        boxShadow: "0 0 10px #FFD700",
      }}
      cursor="pointer"
      textAlign="center"
      p={4}
      onClick={onClick}
    >
      <Text fontSize="lg">{title}</Text>
      {subtitle && (
        <Text fontSize="sm" fontWeight="normal" mt={2}>
          {subtitle}
        </Text>
      )}
    </Box>
  );
}