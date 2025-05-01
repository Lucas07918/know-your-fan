import { Box, Text, VStack, Heading, HStack, Avatar, Tooltip, Icon, Badge, Link, Stack } from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";

const mockProfiles = {
  instagram: [
    { name: "@furia", url: "https://instagram.com/furia", img: "https://via.placeholder.com/80", followed: true },
    { name: "@furiaacademy", url: "https://instagram.com/furiaacademy", img: "https://via.placeholder.com/80", followed: false },
  ],
  twitter: [
    { name: "@FURIA", url: "https://twitter.com/furia", img: "https://via.placeholder.com/80", followed: true },
  ],
  tiktok: [
    { name: "@furia.gg", url: "https://tiktok.com/@furia.gg", img: "https://via.placeholder.com/80", followed: false },
  ],
};

function ProfileAvatar({ profile }) {
  return (
    <Link href={profile.url} isExternal _hover={{ textDecoration: "none" }}>
      <VStack spacing={1}>
        <Tooltip label={profile.name}>
          <Avatar name={profile.name} src={profile.img} cursor="pointer"  />
        </Tooltip>
        <Badge
          colorScheme={profile.followed ? "green" : "gray"}
          fontSize="0.7rem"
          px={2}
          borderRadius="full"
        >
          {profile.followed ? "Seguindo" : "Seguir"}
        </Badge>
      </VStack>
    </Link>
  );
}

export default function EarnPointsPage() {
  return (
    <Box px={"10%"} py={10} color="white" bg="black">
      <Heading mb={4}>Ganhe mais pontos de fã</Heading>
      <Text mb={8} color="gray.400">
        Complete ações para subir de nível e desbloquear medalhas exclusivas.
      </Text>

      <VStack align="start" spacing={10}>
        {/* Instagram */}
        <Box>
          <HStack mb={4}>
            <Icon as={FaInstagram} boxSize={6} color="#E1306C" />
            <Text fontSize="xl" fontWeight="bold">Instagram</Text>
          </HStack>
          <HStack spacing={8}>
            {mockProfiles.instagram.map((profile, idx) => (
              <ProfileAvatar key={idx} profile={profile} />
            ))}
          </HStack>
        </Box>

        {/* Twitter */}
        <Box>
          <HStack mb={4}>
            <Icon as={FaTwitter} boxSize={6} color="#1DA1F2" />
            <Text fontSize="xl" fontWeight="bold">Twitter / X</Text>
          </HStack>
          <HStack spacing={8}>
            {mockProfiles.twitter.map((profile, idx) => (
              <ProfileAvatar key={idx} profile={profile} />
            ))}
          </HStack>
        </Box>

        {/* TikTok */}
        <Box>
          <HStack mb={4}>
            <Icon as={FaTiktok} boxSize={6} color="white" />
            <Text fontSize="xl" fontWeight="bold">TikTok</Text>
          </HStack>
          <HStack spacing={8}>
            {mockProfiles.tiktok.map((profile, idx) => (
              <ProfileAvatar key={idx} profile={profile} />
            ))}
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}
