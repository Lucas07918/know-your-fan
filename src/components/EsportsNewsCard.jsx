import { Box, Text, VStack, Link, Spinner } from "@chakra-ui/react";

export default function EsportsNewsCard({ article, index, isLoading, error }) {
  if (isLoading) {
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
        boxShadow="0 2px 10px rgba(0,0,0,0.9)"
        _hover={{
          transform: "scale(1.02)",
          boxShadow: "0 0 10px #FFD700",
        }}
        p={4}
      >
        <Spinner color="gold" />
      </Box>
    );
  }

  if (error || !article) {
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
        boxShadow="0 2px 10px rgba(0,0,0,0.9)"
        _hover={{
          transform: "scale(1.02)",
          boxShadow: "0 0 10px #FFD700",
        }}
        p={4}
        textAlign="center"
      >
        <Text fontSize="sm">
          {error || `Nenhuma notícia disponível (Card ${index + 1}).`}
        </Text>
      </Box>
    );
  }

  const publishedAt = article.publishedAt
    ? new Date(article.publishedAt).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "Data não disponível";

  return (
    <Box
      bg={article.urlToImage ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.7)"}
      backgroundImage={article.urlToImage ? `url(${article.urlToImage})` : "none"}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backdropFilter={article.urlToImage ? "blur(2px)" : "blur(5px)"}
      borderRadius="2xl"
      height="100%"
      maxHeight="100%"
      overflow="hidden"
      position="relative"
      transition="all 0.3s ease"
      boxShadow="0 2px 10px rgba(0,0,0,0.9)"
      _hover={{
        transform: "scale(1.02)",
        boxShadow: "0 0 10px #FFD700",
      }}
    >
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        bg="rgba(0,0,0,0.6)"
        p={2}
        borderBottomRadius="2xl"
      >
        <VStack alignItems="flex-start" spacing={1}>
          <Link href={article.url || "#"} isExternal>
            <Text
              fontSize="sm"
              fontWeight="bold"
              noOfLines={1}
              textShadow="0 0 4px rgba(0,0,0,0.8)"
              color="white"
            >
              {article.title || "Título não disponível"}
            </Text>
          </Link>
          <Text
            fontSize="xs"
            color="gray.300"
            textShadow="0 0 4px rgba(0,0,0,0.8)"
          >
            {article.source?.name || "Fonte desconhecida"} • {publishedAt}
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}