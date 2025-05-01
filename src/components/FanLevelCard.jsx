import { Box, Flex, Text, CircularProgress, CircularProgressLabel, VStack, HStack, Button, Icon } from "@chakra-ui/react";
import { FaMedal } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Função para pegar título baseado no nível
const getLevelTitle = (level) => {
  const titles = ["Novato", "Torcedor Casual", "Super Fã", "Fã Insano", "Lendário"];
  return titles[level - 1] || "Lendário";
};

export default function FanLevelCard({ fanLevel = 0, name = "Usuário", medals = [true, false, false, true, false] }) {
  const navigate = useNavigate();
  
  // Calcular o nível atual
  const level = Math.min(5, Math.floor(fanLevel / 100) + 1);
  const nextLevelProgress = Math.min(100, fanLevel % 100);

  const isMaxLevel = level === 5;

  return (
    <Box
      bg="rgba(0, 0, 0, 0.7)"
      backdropFilter="blur(5px)"
      borderRadius="2xl"
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
      color="white"
      fontWeight="bold"
      transition="all 0.3s ease"
      boxShadow="0 2px 10px rgba(0, 0, 0, 0.9)" // sombra fixa adicionada aqui
      _hover={{
        transform: "scale(1.02)",
        boxShadow: "0 0 10px #FFD700", // sombra dourada
      }}
      cursor="pointer"
      textAlign="center"
      p={4}
    >
      <Flex w="100%" h="100%" gap={6} alignItems="center">
        {/* Lado esquerdo */}
        <VStack flex="1" spacing={4}>
          <CircularProgress value={isMaxLevel ? 100 : nextLevelProgress} size="120px" thickness="10px" color="gold" capIsRound="true">
            <CircularProgressLabel fontSize="2xl">{level}</CircularProgressLabel>
          </CircularProgress>
          <Text fontSize="sm" color="gray.400">Fan Level</Text>
          <Text fontSize="lg" fontWeight="bold">{getLevelTitle(level)}</Text>
        </VStack>

        {/* Lado direito */}
        <VStack flex="2" alignItems="flex-start" spacing={4}>
          <Text fontSize="xl" fontWeight="bold">{name}</Text>
          <HStack spacing={3}>
            {medals.map((earned, index) => (
              <Icon
                key={index}
                as={FaMedal}
                boxSize={6}
                color={earned ? "gold" : "gray.500"}
              />
            ))}
          </HStack>

          {!isMaxLevel && (
            <Button
              mt={4}
              colorScheme="yellow"
              bg="gold"
              color="black"
              size="sm"
              _hover={{ bg: "yellow.400" }}
              onClick={() => navigate("/ganhar-pontos")}
            >
              Ganhe mais pontos
            </Button>
          )}
        </VStack>
      </Flex>
    </Box>
  );
}
