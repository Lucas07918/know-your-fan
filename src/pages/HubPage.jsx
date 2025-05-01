// import { Container, VStack, Heading, Button, Input, Box, Text, Progress, Spinner, Flex, useToast } from '@chakra-ui/react'
// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// function HubPage({ userData, addSocialLink, updateFanLevel }) {
//   const toast = useToast();

//   const navigate = useNavigate()
//   const [newLink, setNewLink] = useState('')

//   const handleAddLink = () => {
//     if (newLink) {
//       // Verifica se o link é válido
//       const isValid = newLink.toLowerCase().includes('furia') || newLink.toLowerCase().includes('esports');

//       if (isValid) {
//         // Verifica se o link já existe
//         const linkExists = userData.socialLinks.some(item => item.link === newLink);

//         if (linkExists) {
//           // Se o link já existe, não faz nada e exibe um aviso
//           toast({
//             title: 'Link já adicionado!',
//             description: 'Esse link de perfil já foi adicionado.',
//             status: 'warning',
//             duration: 4000,
//             isClosable: true,
//           });
//         } else {
//           const newSocialLink = { link: newLink, status: 'validando' };
          
//           // Adiciona o novo link com status "validando"
//           addSocialLink(newSocialLink);
          
//           // Atualiza o fanLevel
//           updateFanLevel(userData.fanLevel + 10);

//           // Depois de 2 segundos, atualiza o status do link para 'validado'
//           setTimeout(() => {
//             addSocialLink({ link: newLink, status: 'validado' }, true);
//           }, 2000);
//         }
//       } else {
//         toast({
//           title: 'Link inválido!',
//           description: 'Insira um link de perfil de e-sports válido contendo "furia" ou "esports".',
//           status: 'error',
//           duration: 4000,
//           isClosable: true,
//         });
//       }

//       setNewLink('');
//     }
//   };



  
//   return (
//     <Container maxW="container.md" py={10}>
//       <VStack spacing={6} align="stretch">
//         <Heading as="h2" size="xl" textAlign="center">
//           Hub de E-sports 🎮
//         </Heading>

//         {/* Mostrar nível de fã */}
//         <Box w="full" textAlign="center">
//           <Text fontSize="lg" fontWeight="bold">Nível de Fã</Text>
//           <Progress value={userData.fanLevel} size="lg" colorScheme="green" hasStripe isAnimated />
//           <Text fontSize="xl">{userData.fanLevel}% - Você é um fã em crescimento! 🚀</Text>
//         </Box>

//         {/* Campo pra adicionar novo link */}
//         <Box w="full" textAlign="center">
//           <Input
//             placeholder="Adicione um link de perfil de e-sports"
//             value={newLink}
//             onChange={(e) => setNewLink(e.target.value)}
//             mb={3}
//           />
//           <Button onClick={handleAddLink} colorScheme="teal" size="lg" w="full">
//             Adicionar Link
//           </Button>
//         </Box>

//         {/* Lista de perfis conectados */}
//         <Box w="full">
//           <Text fontSize="lg" fontWeight="bold">Perfis Conectados:</Text>
//           {userData.socialLinks && userData.socialLinks.length > 0 ? (
//             <VStack spacing={3}>
//               {userData.socialLinks.filter(link => link !== undefined).map((item, index) => (
//                 item.link && (
//                   <Box key={index} p={3} borderWidth={1} borderRadius="md" w="full" textAlign="center">
//                     <Text noOfLines={1} isTruncated>{item.link}</Text>
//                     {item.status === 'validado' ? (
//                       <Text fontSize="sm" color="green.500">
//                         Status: Validado ✅
//                       </Text>
//                     ) : (
//                       <Flex align="center" justify="center">
//                         <Text fontSize="sm" color="orange.400" mr={2}>
//                           Status: Validando...
//                         </Text>
//                         <Spinner size="xs" />
//                       </Flex>
//                     )}
//                   </Box>
//                 )
//               ))}
//             </VStack>
//           ) : (
//             <Text color="gray.500">Nenhum link de perfil adicionado ainda.</Text>
//           )}
//         </Box>

//         {/* Botão para ver o perfil */}
//         <Button colorScheme="blue" onClick={() => navigate('/perfil')} w="full">
//           Ver Perfil
//         </Button>
//       </VStack>
//     </Container>
//   )
// }

// export default HubPage


import TwitchLiveCard from "../components/TwitchLiveCard";
import FanLevelCard from "../components/FanLevelCard";
import { Box, Flex, SimpleGrid, Grid, GridItem } from "@chakra-ui/react";

export default function HubPage({ userData }) {
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
        backgroundColor="rgba(0, 0, 0, 0.6)" // Um overlay leve pra melhorar contraste
      >
        {/* Área principal */}
        <Box flex="3" display="flex" flexDirection="column" gap={4} h="100%">
          <SimpleGrid h="25%" columns={3} gap={4}>
            <CardItem title="Card 1" height="100%" />
            <CardItem title="Card 2" height="100%" />
            <CardItem title="Card 3" height="100%" />
          </SimpleGrid>

          <Grid
            h="50%"
            templateRows="repeat(1, 1fr)"
            templateColumns="repeat(4, 1fr)"
            gap={4}
          >
            <GridItem colSpan={1}>
              <CardItem title="Card 4" height="100%" />
            </GridItem>
            <GridItem colSpan={3}>
              {/* <CardItem title="Card nível de fã" height="100%" /> */}
              <FanLevelCard fanLevel={userData.fanLevel} name="Luc4ss1lv4" medals={[true, false, true, false, true]} />
            </GridItem>
          </Grid>

          <SimpleGrid h="25%" columns={2} gap={4}>
            {/* <CardItem title="Card 5" height="100%" /> */}
            <TwitchLiveCard />
            <CardItem title="Card 6" height="100%" />
          </SimpleGrid>
        </Box>

        {/* Área lateral */}
        <Box width="15%" display="flex" flexDirection="column" gap={4} h="100%">
          <CardItem title="Vertical 1" height="100%" />
          <CardItem title="Vertical 2" height="100%" />
        </Box>
      </Box>
    </Flex>
  );
}

function CardItem({ title, height = "150px" }) {
  return (
    <Box
      bg="rgba(0, 0, 0, 0.7)"
      backdropFilter="blur(5px)"
      borderRadius="2xl"
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={height}
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
      {title}
    </Box>
  );
}






