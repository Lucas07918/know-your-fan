import { useState } from 'react';
import { Box, Button, Input, Text, VStack, useToast, Progress, Container, HStack } from '@chakra-ui/react';

export default function AddEsportsProfilePage() {
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const toast = useToast();

  const COHERE_API_KEY = import.meta.env.COHERE_API_KEY; // Replace if invalid
  const COHERE_MODEL_ID = import.meta.env.COHERE_MODEL_ID; // Your fine-tuned model ID

  const isValidURL = (str) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const keywordBasedFallback = (rawText, profileName, isEsportsProfile) => {
    const esportsKeywords = [
      'cs:go', 'counter-strike', 'esports', 'player', 'profile', 'tournament',
      'team', 'hltv', 'liquipedia', 'furia', 'fallen', 'kscerato'
    ];
    const textLower = rawText.toLowerCase();
    const isRelevant = esportsKeywords.some(keyword => textLower.includes(keyword));

    let comment = '';
    if (isRelevant) {
      comment = `Este conteúdo parece relevante para esports, pois contém termos como ${
        profileName ? `${profileName} e/ou ` : ''
      }jogos competitivos. (Classificação baseada em palavras-chave devido a falha na API.)`;
    } else {
      comment = `Este conteúdo não parece relevante para esports, pois não contém informações sobre jogos competitivos, jogadores ou equipes. (Classificação baseada em palavras-chave devido a falha na API.)`;
    }

    if (!isEsportsProfile && isRelevant) {
      comment += ' No entanto, o conteúdo pode não ser um perfil de esports específico.';
    } else if (isEsportsProfile && !isRelevant) {
      comment += ' Apesar de parecer um perfil de esports, o conteúdo não foi classificado como relevante.';
    }

    return {
      label: isRelevant ? 'relevante' : 'nao-relevante',
      confidence: 0.75, // Simulated confidence
      comment
    };
  };

  const handleCheckRelevance = async () => {
    if (!link || !isValidURL(link)) {
      toast({
        title: 'Link inválido',
        description: 'Insira uma URL válida (ex: https://www.hltv.org/player/12345/nickname)',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setProgress(10);
    setResult(null);

    // Initialize variables to avoid undefined errors
    let rawText = '';
    let profileName = '';
    let isEsportsProfile = false;

    try {
      // Normalize URL
      const url = new URL(link.startsWith('http') ? link : `https://${link}`);
      console.log('Processing URL:', url.href);

      // Scrape content
      try {
        const scrapeRes = await fetch(
          `https://api.allorigins.win/get?url=${encodeURIComponent(url.href)}`
        );
        setProgress(30);
        const scrapeJson = await scrapeRes.json();
        console.log('Scrape response:', scrapeJson);

        if (scrapeJson.status.http_code !== 200) {
          throw new Error(`Falha ao obter conteúdo: HTTP ${scrapeJson.status.http_code}`);
        }

        rawText = scrapeJson.contents
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 2000);

        // Extract profile name from content
        const titleMatch = scrapeJson.contents.match(/<h1[^>]*>([^<]+)</i);
        profileName = titleMatch ? titleMatch[1].toLowerCase().trim() : '';

        isEsportsProfile = rawText.toLowerCase().includes('profile') ||
                          rawText.toLowerCase().includes('player') ||
                          rawText.toLowerCase().includes('cs:go') ||
                          rawText.toLowerCase().includes('counter-strike') ||
                          rawText.toLowerCase().includes('esports');

        console.log('Scraped rawText:', rawText.substring(0, 100) + '...');
      } catch (scrapeError) {
        console.error('Scraping error:', scrapeError);
        // Fallback: Check URL for esports keywords
        const urlLower = url.href.toLowerCase();
        isEsportsProfile = urlLower.includes('player') ||
                          urlLower.includes('profile') ||
                          urlLower.includes('csgo') ||
                          urlLower.includes('counter-strike') ||
                          urlLower.includes('esports') ||
                          urlLower.includes('liquipedia') ||
                          urlLower.includes('hltv');
        profileName = url.pathname.split('/').pop() || 'desconhecido';
        rawText = `Conteúdo do link ${url.href}`;
        setProgress(60);
      }

      if (!rawText) {
        throw new Error('Não foi possível obter conteúdo do link');
      }

      // Send to Cohere
      setProgress(60);
      const cohereRes = await fetch('https://api.cohere.ai/v1/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${COHERE_API_KEY}`,
        },
        body: JSON.stringify({
          model: COHERE_MODEL_ID,
          inputs: [rawText]
        }),
      });

      setProgress(85);
      const cohereJson = await cohereRes.json();
      console.log('Cohere response:', JSON.stringify(cohereJson, null, 2));

      if (!cohereRes.ok) {
        throw new Error(cohereJson.message || 'Erro na API do Cohere');
      }

      const prediction = cohereJson.classifications?.[0];
      if (!prediction) {
        throw new Error('Nenhuma predição retornada pelo Cohere');
      }

      const isRelevant = prediction.prediction === 'relevante';
      let comment = '';
      if (isRelevant) {
        comment = `Este conteúdo é relevante para esports, pois parece discutir ${
          profileName ? `o jogador ou equipe ${profileName}` : 'temas relacionados a jogos competitivos como CS:GO'
        }. A confiança da classificação é ${(prediction.confidence * 100).toFixed(2)}%.`;
      } else {
        comment = `Este conteúdo não parece relevante para esports, pois não contém informações sobre jogos competitivos, jogadores ou equipes. A confiança da classificação é ${(prediction.confidence * 100).toFixed(2)}%.`;
      }

      if (!isEsportsProfile && isRelevant) {
        comment += ' No entanto, o conteúdo pode não ser um perfil de esports específico.';
      } else if (isEsportsProfile && !isRelevant) {
        comment += ' Apesar de parecer um perfil de esports, o conteúdo não foi classificado como relevante.';
      }

      setResult({
        label: prediction.prediction,
        confidence: prediction.confidence,
        comment,
      });
      setProgress(100);
    } catch (err) {
      console.error('Validation error:', err);
      // Fallback to keyword-based classification
      try {
        const fallbackResult = keywordBasedFallback(
          rawText || `Conteúdo do link ${link}`,
          profileName || 'desconhecido',
          isEsportsProfile
        );
        setResult(fallbackResult);
        setProgress(100);
        toast({
          title: 'Aviso',
          description: 'Classificação feita com palavras-chave devido a erro na API do Cohere: ' + err.message,
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      } catch (fallbackErr) {
        toast({
          title: 'Erro ao validar link',
          description: err.message || 'Tente novamente mais tarde',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error('Fallback error:', fallbackErr);
      }
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6}>
        <Text fontSize="2xl" fontWeight="bold">
          Adicionar Perfil de E-sports
        </Text>
        <Box w="full">
          <Text mb={2}>Insira o link do seu perfil de e-sports</Text>
          <Input
            placeholder="https://www.hltv.org/player/12345/nickname"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            isDisabled={loading}
          />
        </Box>

        {progress > 0 && (
          <Progress value={progress} size="sm" colorScheme="green" borderRadius="md" w="full" />
        )}

        {result && (
          <Box mt={4} p={4} borderWidth="1px" borderRadius="md" w="full">
            <Text fontWeight="bold" color={result.label === 'relevante' ? 'green.500' : 'red.500'}>
              {result.label === 'relevante' ? 'Conteúdo relevante!' : 'Conteúdo não relevante'}
            </Text>
            <Text mt={2}>
              Confiança: {(result.confidence * 100).toFixed(2)}%
            </Text>
            <Text mt={2} fontStyle="italic" fontWeight="bold">
              Comentário: {result.comment}
            </Text>
          </Box>
        )}

        <HStack spacing={4} mt={6}>
          <Button
            colorScheme="yellow"
            isLoading={loading}
            onClick={handleCheckRelevance}
            isDisabled={loading || !link}
          >
            {loading ? 'Validando...' : 'Validar Link'}
          </Button>
          <Button
            variant="outline"
            colorScheme="white"
            onClick={() => setLink('')}
            isDisabled={loading}
          >
            Limpar
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
}