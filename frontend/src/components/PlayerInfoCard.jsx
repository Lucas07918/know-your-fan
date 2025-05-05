import { useEffect, useState, memo } from "react";
import {
  Box,
  Text,
  Spinner,
  Link,
  Grid,
  GridItem,
  Icon,
} from "@chakra-ui/react";
import { StarIcon, SunIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import axios from "axios";

const PANDASCORE_API_KEY = import.meta.env.VITE_PANDASCORE_TOKEN;
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300?text=Player";

const TEAM_PLAYER_MAP = {
  FURIA: {
    teamId: 124530,
    image: "https://cdn.pandascore.co/images/team/image/124530/8297.png",
    players: {
      FALLEN: {
        id: 17497,
        role: "AWPer/IGL",
        hltvId: 2023,
        realName: "Gabriel Toledo",
        nationality: "BR",
        stats: {
          majors: "2x Major (MLG Columbus 2016, ESL One Cologne 2016)",
          hltvRankings: "#2 (2016), #6 (2017), #18 (2018)",
          winnings: "~$1.2M USD",
        },
      },
      CHELO: { id: 17729, role: "Rifler", hltvId: 11219, nationality: "BR" },
      YEKINDAR: { id: 18732, role: "Entry Fragger", hltvId: 13915, nationality: "LV" },
      YUURIH: { id: 19664, role: "Rifler", hltvId: 12516, nationality: "BR" },
      KSCERATO: { id: 19667, role: "Rifler", hltvId: 15631, nationality: "BR" },
      SKULLZ: { id: 23618, role: "Rifler", hltvId: 20026, nationality: "BR" },
      GUERRI: { id: 36730, role: "Coach", hltvId: null, nationality: "BR" },
      MOLODOY: { id: 55593, role: "Analyst", hltvId: null, nationality: "BR" },
    },
  },
  G2: {
    teamId: 3210,
    image: "https://cdn.pandascore.co/images/team/image/3210/5995.png",
    players: {
      SNAX: { id: 17502, role: "Rifler", hltvId: 2553, nationality: "PL" },
      HUNTER: { id: 17958, role: "Rifler", hltvId: 13238, nationality: "BA" },
      MALBSMD: { id: 21433, role: "AWPer", hltvId: 18720, nationality: "GT" },
      HADES: { id: 23117, role: "AWPer", hltvId: 17144, nationality: "PL" },
      HEAVYGOD: { id: 30794, role: "Rifler", hltvId: 21371, nationality: "IL" },
    },
  },
  PAIN: {
    teamId: 125751,
    image: "https://cdn.pandascore.co/images/team/image/125751/pain-gaming-farnhu45.png",
    players: {
      BIGUZERA: { id: 20370, role: "Rifler", hltvId: 18144, nationality: "BR" },
      NQZ: { id: 25471, role: "AWPer", hltvId: 20322, nationality: "BR" },
      DAV1DEUS: { id: 25589, role: "Rifler", hltvId: 20678, nationality: "BR" },
      KAUEZ: { id: 28003, role: "Rifler", hltvId: 20677, nationality: "BR" },
      DGT: { id: 34000, role: "Rifler", hltvId: 19165, nationality: "UY" },
      SNOWZIN: { id: 39422, role: "Rifler", hltvId: null, nationality: "BR" },
    },
  },
};

function PlayerInfoCard({ playerName = "", interests = [] }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug render
  console.log("PlayerInfoCard rendered:", { playerName, interests });

  useEffect(() => {
    async function fetchPlayerData() {
      try {
        let selectedPlayerId = null;
        let selectedPlayerName = playerName.toUpperCase();
        let playerInfo = null;
        let teamImage = PLACEHOLDER_IMAGE;

        // Check TEAM_PLAYER_MAP
        for (const team of Object.keys(TEAM_PLAYER_MAP)) {
          if (selectedPlayerName && TEAM_PLAYER_MAP[team].players[selectedPlayerName]) {
            selectedPlayerId = TEAM_PLAYER_MAP[team].players[selectedPlayerName].id;
            playerInfo = TEAM_PLAYER_MAP[team].players[selectedPlayerName];
            teamImage = TEAM_PLAYER_MAP[team].image;
            break;
          }
        }

        // If no playerName, select from interests
        if (!selectedPlayerId && interests.length > 0) {
          const team = interests.find(t => TEAM_PLAYER_MAP[t]);
          if (team) {
            const players = Object.keys(TEAM_PLAYER_MAP[team].players);
            selectedPlayerName = players[0] || "FALLEN";
            selectedPlayerId = TEAM_PLAYER_MAP[team].players[selectedPlayerName].id;
            playerInfo = TEAM_PLAYER_MAP[team].players[selectedPlayerName];
            teamImage = TEAM_PLAYER_MAP[team].image;
          }
        }

        // Default to FalleN if no player found
        if (!selectedPlayerId) {
          selectedPlayerName = "FALLEN";
          selectedPlayerId = TEAM_PLAYER_MAP.FURIA.players.FALLEN.id;
          playerInfo = TEAM_PLAYER_MAP.FURIA.players.FALLEN;
          teamImage = TEAM_PLAYER_MAP.FURIA.image;
        }

        // Fetch player details from PandaScore
        console.log(`Fetching player: ${selectedPlayerName} (ID: ${selectedPlayerId})`);
        const playerResponse = await axios.get(
          `https://api.pandascore.co/players/${selectedPlayerId}`,
          {
            headers: { Authorization: `Bearer ${PANDASCORE_API_KEY}` },
          }
        );

        console.log("PandaScore player response:", playerResponse.data);
        if (playerResponse.data) {
          setPlayer({ ...playerResponse.data, teamImage, playerInfo });
        } else {
          setError("Jogador não encontrado...");
        }
      } catch (err) {
        setError("Erro ao carregar jogador: " + err.message);
        console.error("Erro ao buscar dados do PandaScore:", err);
      } finally {
        setLoading(false);
      }
    }

    if (PANDASCORE_API_KEY) {
      fetchPlayerData();
    } else {
      setError("Chave da PandaScore API não configurada.");
      setLoading(false);
    }
  }, [playerName, interests.join(",")]);

  if (loading) {
    return (
      <Box
        bg="rgba(0,0,0,0.7)"
        backdropFilter="blur(5px)"
        borderRadius="2xl"
        height="100%"
        maxHeight="100%"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
        fontWeight="bold"
        transition="all 0.3s ease"
        boxShadow="0 4px 12px rgba(0,0,0,0.9)"
        _hover={{
          transform: "scale(1.02)",
          boxShadow: "0 0 15px #FFD700",
        }}
        p={4}
      >
        <Spinner color="gold" size="lg" />
      </Box>
    );
  }

  if (error || !player) {
    return (
      <Box
        bg="rgba(0,0,0,0.7)"
        backdropFilter="blur(5px)"
        borderRadius="2xl"
        height="100%"
        maxHeight="100%"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
        fontWeight="bold"
        transition="all 0.3s ease"
        boxShadow="0 4px 12px rgba(0,0,0,0.9)"
        _hover={{
          transform: "scale(1.02)",
          boxShadow: "0 0 15px #FFD700",
        }}
        p={4}
        textAlign="center"
      >
        <Text fontSize="sm">{error || "Jogador não disponível."}</Text>
      </Box>
    );
  }

  const normalizedPlayerName = (player.name || playerName || "FalleN").toLowerCase();
  const playerInfo = player.playerInfo || {};
  const imageUrl = player.teamImage || player.image_url || PLACEHOLDER_IMAGE;
  const hltvUrl = playerInfo.hltvId
    ? `https://www.hltv.org/player/${playerInfo.hltvId}/${normalizedPlayerName}`
    : "https://www.hltv.org";

  return (
    <Box
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      bg={imageUrl ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.7)"}
      backgroundImage={imageUrl ? `url(${imageUrl})` : "none"}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backdropFilter="blur(5px)"
      borderRadius="2xl"
      height="100%"
      maxHeight="100%"
      overflow="hidden"
      position="relative"
      boxShadow="0 4px 12px rgba(0,0,0,0.9)"
      _hover={{
        transform: "scale(1.02)",
        boxShadow: "0 0 15px #FFD700",
      }}
    >
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        bgGradient="linear(to-t, rgba(0,0,0,0.9), rgba(0,0,0,0.6))"
        p={3}
        borderBottomRadius="2xl"
      >
        <Text
          fontSize="lg"
          fontWeight="extrabold"
          color="gold"
          textShadow="0 0 6px rgba(0,0,0,0.8)"
          mb={2}
        >
          {player.name || playerName || "FalleN"}
        </Text>
        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
          <GridItem>
            <Text
              fontSize="sm"
              color="white"
              textShadow="0 0 4px rgba(0,0,0,0.8)"
            >
              Nome: {playerInfo.realName ||
                (player.first_name && player.last_name
                  ? `${player.first_name} ${player.last_name}`
                  : "Não disponível")}
            </Text>
            <Text
              fontSize="sm"
              color="white"
              textShadow="0 0 4px rgba(0,0,0,0.8)"
            >
              Time: {player.current_team?.name || "Sem time"}
            </Text>
            <Text
              fontSize="sm"
              color="white"
              textShadow="0 0 4px rgba(0,0,0,0.8)"
            >
              Nacionalidade: {playerInfo.nationality || player.nationality || "Desconhecida"}
            </Text>
            <Text
              fontSize="sm"
              color="white"
              textShadow="0 0 4px rgba(0,0,0,0.8)"
            >
              Função: {playerInfo.role || player.role || "Desconhecida"}
            </Text>
          </GridItem>
          <GridItem>
            {playerInfo.stats && (
              <>
                <Text
                  fontSize="xs"
                  color="gray.300"
                  textShadow="0 0 4px rgba(0,0,0,0.8)"
                >
                  <Icon as={StarIcon} color="gold" mr={1} />
                  Conquistas: {playerInfo.stats.majors || "Nenhuma"}
                </Text>
                <Text
                  fontSize="xs"
                  color="gray.300"
                  textShadow="0 0 4px rgba(0,0,0,0.8)"
                >
                  <Icon as={StarIcon} color="gold" mr={1} />
                  HLTV Top 20: {playerInfo.stats.hltvRankings || "Nenhum"}
                </Text>
              </>
            )}
          </GridItem>
        </Grid>
        <Link
          href={hltvUrl}
          isExternal
          fontSize="sm"
          color="gold"
          textShadow="0 0 4px rgba(0,0,0,0.8)"
          _hover={{ textDecoration: "underline", color: "#FFEA00" }}
          transition="color 0.2s ease"
          mt={2}
          display="block"
        >
          Ver perfil no HLTV
        </Link>
      </Box>
    </Box>
  );
}

export default memo(PlayerInfoCard);