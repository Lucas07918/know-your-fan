import { useState, useEffect } from "react";
import TwitchLiveCard from "../components/TwitchLiveCard";
import FanLevelCard from "../components/FanLevelCard";
import { Box, Flex, SimpleGrid, Grid, GridItem } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import RecommendedProductCard from "../components/RecommendedProductCard";
import UpcomingMatchCard from "../components/UpcomingMatchCard";
import EsportsNewsCard from "../components/EsportsNewsCard";
import axios from "axios";
import PlayerInfoCard from "../components/PlayerInfoCard";

const NEWSAPI_KEY = import.meta.env.VITE_NEWSAPI_KEY;

export default function HubPage({ uid, userData }) {
  const [twitchData, setTwitchData] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);

  useEffect(() => {
    async function loadUserData() {
      if (!userData) {
        console.log("Usuário ainda não carregado.");
        return;
      }
      if (!uid) {
        console.log("UID ainda não disponível.");
        return;
      }

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
    }

    async function fetchNewsArticles() {
      try {
        const response = await axios.get(
          "https://newsapi.org/v2/everything",
          {
            params: {
              q: "esports OR e-sports",
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
  }, [uid, userData]);

  return (
    <Flex
      gap={6}
      backgroundImage="url('https://pbs.twimg.com/media/F98rnl8XwAAnrpY?format=jpg&name=large')"
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
          <SimpleGrid h="25%" columns={3} gap={4}>
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
              {/* <CardItem title="Card 4" height="100%" /> */}
              <PlayerInfoCard interests={userData?.interests || []} playerName="FalleN" />
            </GridItem>
            <GridItem colSpan={3}>
              <UpcomingMatchCard />
            </GridItem>
          </Grid>

          <SimpleGrid h="25%" columns={2} gap={4}>
            {twitchData ? (
              <CardItem title="Ao vivo na Twitch" height="100%" />
            ) : (
              <CardItem title="Ao vivo na Twitch" height="100%" />
            )}
            <CardItem title="Card 6" height="100%" />
          </SimpleGrid>
        </Box>

        <Box width="15%" display="flex" flexDirection="column" gap={4} h="100%">
          {/* <CardItem title="Vertical 1" height="100%" /> */}
          <RecommendedProductCard interests={userData?.interests} />
        </Box>
      </Box>
    </Flex>
  );
}

function CardItem({ title, height = "150px" }) {
  return (
    <Box
      bg="rgba(0,0,0,0.7)"
      backdropFilter="blur(5px)"
      borderRadius="2xl"
      display="flex"
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
    >
      {title}
    </Box>
  );
}