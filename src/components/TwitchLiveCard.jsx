import { Avatar, AvatarBadge, Badge, Box, Text, VStack } from "@chakra-ui/react";
import { useFuriaLiveStatus } from "../hooks/useFuriaLiveStatus";
// import { useTwitchLiveStatus } from "../hooks/useTwitchLiveStatus";

export default function TwitchLiveCard() {
//   const isLive = useTwitchLiveStatus("furiatv");
  const isLive = useFuriaLiveStatus();
  
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
      boxShadow="0 2px 10px rgba(0, 0, 0, 0.9)"
      _hover={{
        transform: "scale(1.02)",
        boxShadow: "0 0 10px #9146FF", // Twitch roxo
      }}
      cursor="pointer"
      textAlign="center"
      p={4}
      as="a"
      href="https://www.twitch.tv/furiatv"
      target="_blank"
    >
      <VStack spacing={2}>
        <Avatar
            src="https://static-cdn.jtvnw.net/jtv_user_pictures/27cebe1b-e7e5-46ad-a737-04d5a01684a9-profile_image-70x70.png"
        >
            <AvatarBadge borderColor='papayawhip' bg={isLive ? "red" : "gray"} boxSize='1em' />
        </Avatar>
        <Badge colorScheme={isLive ? "red" : "gray"}>
          {isLive ? "AO VIVO" : "Offline"}
        </Badge>
        <Text fontSize="sm">Canal FURIA na Twitch</Text>
      </VStack>
    </Box>
  );
}
