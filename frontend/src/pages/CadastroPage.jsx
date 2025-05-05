import { useState } from 'react';
import {
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  SimpleGrid,
  Image,
  Box,
  Text,
} from '@chakra-ui/react';
import { Card } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import UploadDocumentoPage from './UploadDocumentoPage';
import ConectarRedesPage from './ConectarRedesPage';

function CadastroPage({ setUserData, updateProfile }) {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [cpf, setCpf] = useState('');
  const [interestsInput, setInterestsInput] = useState('');
  const [interests, setInterests] = useState([]);
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [twitterData, setTwitterData] = useState(null);

  const navigate = useNavigate();
  const toast = useToast();

  const userData = {
    fullName,
    address,
    cpf,
    interests,
    events,
    products,
    twitter: twitterData,
  };

  const handleAddInterest = () => {
    if (interestsInput.trim() !== '') {
      setInterests([...interests, interestsInput.trim()]);
      setInterestsInput('');
    }
  };

  const handleRemoveInterest = (index) => {
    const newInterests = [...interests];
    newInterests.splice(index, 1);
    setInterests(newInterests);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateProfile({
      fullName,
      address,
      cpf,
      interests,
      events,
      products,
      twitter: twitterData,
      validated: true,
    });

    toast({
      title: 'Cadastro enviado!',
      description: 'Cadastro Concluído!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setTimeout(() => {
      navigate('/hub');
    }, 1000);
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
        <Heading as="h2" size="xl" textAlign="center">
          Cadastro de Fã 🎮
        </Heading>

        {step === 1 && (
          <>
            <FormControl isRequired>
              <FormLabel>Nome completo</FormLabel>
              <Input
                placeholder="Seu nome"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Endereço</FormLabel>
              <Input
                placeholder="Rua, número, cidade"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>CPF</FormLabel>
              <Input
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </FormControl>

            <Button colorScheme="yellow" w="full" onClick={() => setStep(2)}>
              Próximo
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <FormControl>
              <FormLabel>Selecione seus interesses em e-sports</FormLabel>
              <Box maxH="140px" overflowY="auto" border="1px solid #E2E8F0" borderRadius="md" p={2}>
                <Wrap>
                  {[
                    'CS:GO', 'Counter-Strike 2', 'Valorant', 'League of Legends', 'Wild Rift', 'TFT',
                    'Dota 2', 'PUBG Mobile', 'Free Fire', 'Rainbow Six', 'Rocket League', 'Fortnite',
                    'Apex Legends', 'Overwatch 2', 'Call of Duty', 'Mobile Games',
                    'FURIA', 'LOUD', 'MIBR', 'paiN Gaming', 'INTZ', 'RED Canids', 'Fluxo',
                    'G2 Esports', 'NAVI', 'FaZe Clan', '100 Thieves', 'TSM', 'Team Liquid',
                    'Cloud9', 'Evil Geniuses', 'SK Gaming',
                    'CBLOL', 'Competitivo', 'Watch Parties', 'Streamers', 'Skins',
                    'Pro Player', 'IGL', 'Sniper', 'Entry Fragger', 'Coach', 'Analista',
                    'Caster', 'Narrador', 'Influencer',
                    'FPS', 'MOBA', 'Tier 1', 'Tier 2', 'Setup Gamer', 'Aim Training',
                    'Clips e Highlights', 'Montagens', 'Fantasy League',
                    'Custom HUDs', 'Estratégias', 'Fanbase', 'Cosplay', 'Comunidade', 'Editor de clipes',
                  ].map((item, index) => (
                    <WrapItem key={index}>
                      <Tag
                        size="lg"
                        variant={interests.includes(item) ? 'solid' : 'subtle'}
                        colorScheme="yellow"
                        cursor="pointer"
                        onClick={() => {
                          if (interests.includes(item)) {
                            setInterests(interests.filter((i) => i !== item));
                          } else {
                            setInterests([...interests, item]);
                          }
                        }}
                      >
                        {item}
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Outro interesse? Digite abaixo</FormLabel>
              <HStack>
                <Input
                  placeholder="Ex: Fortnite"
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                />
                <Button onClick={handleAddInterest}>Adicionar</Button>
              </HStack>
            </FormControl>

            <Wrap mt={3}>
              {interests
                .filter((item) =>
                  !['CS:GO', 'Valorant', 'League of Legends', 'CBLOL', 'FURIA', 'Skins', 'Streamers', 'Watch Parties', 'Competitivo', 'Mobile Games'].includes(item)
                )
                .map((interest, index) => (
                  <WrapItem key={index}>
                    <Tag colorScheme="yellow">
                      <TagLabel>{interest}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveInterest(index)} />
                    </Tag>
                  </WrapItem>
                ))}
            </Wrap>

            <HStack w="full" justify="space-between" mt={4}>
              <Button onClick={() => setStep(1)}>Voltar</Button>
              <Button colorScheme="yellow" onClick={() => setStep(3)}>
                Próximo
              </Button>
            </HStack>
          </>
        )}

        {step === 3 && (
          <>
            <FormControl>
              <FormLabel>Quais eventos você acompanhou em 2024?</FormLabel>
              <Wrap>
                {[
                  'CBLOL 2024',
                  'IEM Katowice',
                  'VCT Americas',
                  'Major de CS:GO',
                  'Mundial de LoL',
                  'Copa Rakin',
                  'Game Changers',
                  'Final da LBFF',
                  'FURIA na ESL',
                  'BGS 2024',
                ].map((event, index) => (
                  <WrapItem key={index}>
                    <Tag
                      size="lg"
                      variant={events.includes(event) ? 'solid' : 'subtle'}
                      colorScheme="yellow"
                      cursor="pointer"
                      onClick={() => {
                        if (events.includes(event)) {
                          setEvents(events.filter((e) => e !== event));
                        } else {
                          setEvents([...events, event]);
                        }
                      }}
                    >
                      {event}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </FormControl>

            <HStack w="full" justify="space-between" mt={4}>
              <Button onClick={() => setStep(2)}>Voltar</Button>
              <Button colorScheme="yellow" onClick={() => setStep(4)}>
                Próximo
              </Button>
            </HStack>
          </>
        )}

        {step === 4 && (
          <>
            <FormControl>
              <FormLabel>Você tem algum desses produtos de e-sports?</FormLabel>
              <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                {[
                  {
                    name: 'Bonés',
                    image: 'https://img.freepik.com/fotos-gratis/boné-de-beisebol-isolado-em-fundo-branco_93675-130297.jpg',
                  },
                  {
                    name: 'Camisetas',
                    image: 'https://img.freepik.com/fotos-premium/camisa-preta-simples-isolada-no-fundo-branco_927015-389.jpg',
                  },
                  {
                    name: 'Coleções temáticas',
                    image: 'https://img.freepik.com/fotos-gratis/fones-de-ouvido-com-luzes-neon-no-escuro_23-2149911176.jpg',
                  },
                  {
                    name: 'Acessórios',
                    image: 'https://img.freepik.com/fotos-gratis/fones-de-ouvido-sobre-fundo-branco_53876-96804.jpg',
                  },
                  {
                    name: 'Roupas esportivas',
                    image: 'https://img.freepik.com/fotos-gratis/moletom-preto-isolado-no-fundo-branco_93675-130317.jpg',
                  },
                ].map((item, index) => (
                  <Card
                    key={index}
                    borderWidth="2px"
                    borderColor={products.includes(item.name) ? 'yellow.400' : 'gray.200'}
                    borderRadius="xl"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => {
                      if (products.includes(item.name)) {
                        setProducts(products.filter((p) => p !== item.name));
                      } else {
                        setProducts([...products, item.name]);
                      }
                    }}
                  >
                    <Image src={item.image} alt={item.name} objectFit="cover" boxSize="100%" />
                    <Box p={2}>
                      <Text fontWeight="bold" textAlign="center">{item.name}</Text>
                    </Box>
                  </Card>
                ))}
              </SimpleGrid>
            </FormControl>

            <HStack w="full" justify="space-between" mt={4}>
              <Button onClick={() => setStep(3)}>Voltar</Button>
              <Button colorScheme="yellow" onClick={() => setStep(5)}>
                Próximo
              </Button>
            </HStack>
          </>
        )}

        {step === 5 && (
          <>
            <FormControl>
              <UploadDocumentoPage userData={userData} setUserData={setUserData} />
            </FormControl>

            <HStack w="full" justify="space-between" mt={4}>
              <Button onClick={() => setStep(4)}>Voltar</Button>
              <Button colorScheme="yellow" onClick={() => setStep(6)}>
                Próximo
              </Button>
            </HStack>
          </>
        )}

        {step === 6 && (
          <>
            <FormControl>
              <ConectarRedesPage
                setUserData={(data) =>
                  setUserData((prev) => {
                    setTwitterData(data.twitter);
                    return { ...prev, twitter: data.twitter };
                  })
                }
                userData={userData}
              />
            </FormControl>

            <HStack w="full" justify="space-between" mt={4}>
              <Button onClick={() => setStep(5)}>Voltar</Button>
              <Button colorScheme="yellow" type="submit">
                Finalizar Cadastro
              </Button>
            </HStack>
          </>
        )}
      </VStack>
    </Container>
  );
}

export default CadastroPage;