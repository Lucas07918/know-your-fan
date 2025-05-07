import { useEffect, useState, useMemo, memo } from "react";
import { Box, Text, Image, Flex, Spinner, VStack } from "@chakra-ui/react";

const API_TOKEN = import.meta.env.VITE_PANDASCORE_TOKEN;

// Team name to PandaScore ID mapping
const TEAM_IDS = {
  FURIA: 124530, // Counter-Strike
  G2: 3210, // Counter-Strike
  paiN: 125751, // Counter-Strike
  LOUD: 130338, // Valorant
};

function UpcomingMatchCard({ userInterests = [] }) {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memoize team selection
  const teamToQuery = useMemo(() => {
    const validInterests = userInterests.filter(team => TEAM_IDS[team]);
    return validInterests.length > 0
      ? validInterests[Math.floor(Math.random() * validInterests.length)]
      : "FURIA";
  }, [userInterests.join(",")]);

  // Define gradient background for specific teams
  const hasGradient = ["FURIA", "LOUD"].includes(teamToQuery);
  const cardBg = hasGradient
    ? "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(51, 51, 51, 0.3) 100%)"
    : "rgba(0,0,0,0.7)";

  // Debug render
  console.log("UpcomingMatchCard rendered:", { userInterests, teamToQuery });

  useEffect(() => {
    if (!API_TOKEN) {
      console.error("PandaScore API token missing");
      setMatch(null);
      setLoading(false);
      return;
    }

    async function fetchTeamMatch() {
      const teamId = TEAM_IDS[teamToQuery];
      try {
        console.log(`Fetching match for team: ${teamToQuery} (ID: ${teamId})`);
        const response = await fetch(
          `https://api.pandascore.co/teams/${teamId}/matches?filter[future]=true&filter[not_started]=true&sort=&page=1&per_page=1`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        console.log("PandaScore response:", data);
        setMatch(data[0] || null);
      } catch (error) {
        console.error(`Erro ao buscar partida da ${teamToQuery}:`, error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMatch();
  }, [teamToQuery]); // Stable dependency

  if (loading) {
    return (
      <Box
        bg={cardBg}
        backdropFilter="blur(5px)"
        borderRadius="2xl"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
        fontWeight="bold"
        transition="all 0.3s ease"
        boxShadow="0 2px 10px rgba(0,0,0,0.9)"
        _hover={{
          transform: "scale(1.02)",
          boxShadow: "0 0 10px #FFD700",
        }}
      >
        <Spinner color="yellow.400" />
      </Box>
    );
  }

  if (!match) {
    return (
      <Box
        bg={cardBg}
        backdropFilter="blur(5px)"
        borderRadius="2xl"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
        fontWeight="bold"
        transition="all 0.3s ease"
        boxShadow="0 2px 10px rgba(0,0,0,0.9)"
        _hover={{
          transform: "scale(1.02)",
          boxShadow: "0 0 10px #FFD700",
        }}
        p={4}
        textAlign="center"
      >
        <Text fontSize="sm">A {teamToQuery} não tem partidas futuras.</Text>
      </Box>
    );
  }

  const teamA = match.opponents?.[0]?.opponent;
  const teamB = match.opponents?.[1]?.opponent;
  const matchTime = new Date(match.begin_at).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <Box
      bg={cardBg}
      backdropFilter="blur(5px)"
      borderRadius="2xl"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      color="white"
      fontWeight="bold"
      transition="all 0.3s ease"
      boxShadow="0 2px 10px rgba(0,0,0,0.9)"
      _hover={{
        transform: "scale(1.02)",
        boxShadow: "0 0 10px #FFD700",
      }}
      p={4}
    >
      <VStack w="100%" h="100%" spacing={4} justify="center">
        <Flex w="100%" justify="space-between" align="center" gap={4}>
          <VStack align="center" flex="1">
            <Image src={teamA?.image_url} boxSize="60px" />
            <Text fontSize="md">{teamA?.name}</Text>
          </VStack>
          <Text fontSize="lg">vs</Text>
          <VStack align="center" flex="1">
            <Image src={teamB?.image_url} boxSize="60px" />
            <Text fontSize="md">{teamB?.name}</Text>
          </VStack>
        </Flex>
        <VStack spacing={2} align="center">
          <Text fontSize="lg" fontWeight="bold" color="yellow.400">{match.tournament?.name}</Text>
          <Text fontSize="sm" color="whiteAlpha.700">{matchTime}</Text>
        </VStack>
      </VStack>
    </Box>
  );
}

export default memo(UpcomingMatchCard);


