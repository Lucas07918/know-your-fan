// import { useEffect, useState } from "react";
import { Avatar, AvatarBadge, Badge, Box, Text, VStack } from "@chakra-ui/react";
import { useTwitchLiveStatus } from "../hooks/useTwitchLiveStatus";

export default function TwitchLiveCard({ canais }) {
  const randomIndex = Math.floor(Math.random() * canais.length);

  const twitchInfo = useTwitchLiveStatus(canais[randomIndex]);
  console.log("twitchInfo: ", twitchInfo)

  const isLive = twitchInfo?.isLive;
  const profileImage = twitchInfo?.profileImage;
  const displayName = twitchInfo?.displayName || canais[randomIndex] || "Canal";

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
        boxShadow: "0 0 10px #9146FF",
      }}
      cursor="pointer"
      textAlign="center"
      p={4}
      as="a"
      href={`https://www.twitch.tv/${displayName.toLowerCase()}`}
      target="_blank"
    >
      <VStack spacing={2}>
        <Avatar src={profileImage}>
          <AvatarBadge borderColor="papayawhip" bg={isLive ? "red" : "gray"} boxSize="1em" />
        </Avatar>
        <Badge colorScheme={isLive ? "red" : "gray"}>
          {isLive ? "AO VIVO" : "Offline"}
        </Badge>
        <Text fontSize="sm">Canal {displayName} na Twitch</Text>
      </VStack>
    </Box>
  );
}
