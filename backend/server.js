const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { RekognitionClient, DetectTextCommand, CompareFacesCommand } = require('@aws-sdk/client-rekognition');
const multer = require('multer');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Validate AWS credentials
const awsCredentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};
if (!awsCredentials.accessKeyId || !awsCredentials.secretAccessKey) {
  console.error('AWS credentials missing:', {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ? 'Present' : 'Missing',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? 'Present' : 'Missing',
  });
  throw new Error('AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set in .env');
}

// Configure AWS Rekognition Client
const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: awsCredentials,
});

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Static mapping of players to teams (for HLTV and fallback)
const playerTeamMap = {
  'fallen': ['furia'],
  'kscerato': ['furia'],
  'yuurih': ['furia'],
  'chelo': ['furia'],
  'furia': ['furia'],
  'loud': ['loud'],
};

// Proxy for PandaScore API
app.get('/api/pandascore/:game/*', async (req, res) => {
  const { game, 0: path } = req.params;
  const PANDASCORE_API_KEY = process.env.PANDASCORE_TOKEN;
  if (!PANDASCORE_API_KEY) {
    return res.status(500).json({ error: 'PandaScore API key not configured' });
  }

  try {
    const response = await axios.get(`https://api.pandascore.co/${game}/${path}`, {
      headers: {
        Authorization: `Bearer ${PANDASCORE_API_KEY}`,
      },
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    console.error('PandaScore proxy error:', error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.post('/validate-link', async (req, res) => {
  const { link, nickname = '', fullName = '', interests = [] } = req.body;

  if (!link) {
    return res.status(400).json({
      isValid: false,
      details: 'Link é obrigatório.',
      comment: 'Por favor, forneça um link válido.',
    });
  }

  let url;
  try {
    url = new URL(link.startsWith('http') ? link : `https://${link}`);
  } catch (error) {
    console.error('Invalid URL format:', link, error);
    return res.status(400).json({
      isValid: false,
      details: 'Formato de URL inválido.',
      comment: 'Por favor, insira um URL válido (ex: https://www.hltv.org/player/12345/nickname).',
    });
  }

  const validDomains = ['liquipedia.net', 'hltv.org', 'faceit.com', 'steamcommunity.com'];
  if (!validDomains.some((domain) => url.hostname.includes(domain))) {
    console.log('Invalid domain:', url.hostname);
    return res.json({
      isValid: false,
      details: 'Link não pertence a um site de e-sports suportado.',
      comment: 'Por favor, envie um link de Liquipedia, HLTV, FACEIT ou Steam.',
    });
  }

  const userInterests = Array.isArray(interests) ? interests.map((i) => i.toLowerCase()) : [];

  if (url.hostname.includes('hltv.org')) {
    console.log('HLTV link detected:', link);
    const urlParts = url.pathname.split('/');
    const profileName = urlParts[urlParts.length - 1]?.toLowerCase() || '';

    const isEsportsProfile = url.pathname.includes('/player/') && profileName;

    if (!isEsportsProfile) {
      console.log('Not an HLTV player profile');
      return res.json({
        isValid: false,
        details: 'O link não é um perfil de jogador válido no HLTV.',
        comment: 'O link deve ser um perfil de jogador HLTV (ex: https://www.hltv.org/player/12345/nickname).',
      });
    }

    const associatedTeams = playerTeamMap[profileName] || [];
    const isRelevant = userInterests.length === 0 || userInterests.some((interest) =>
      associatedTeams.includes(interest) ||
      ['cs:go', 'cs2', 'counter-strike'].includes(interest) ||
      interest === profileName
    );

    let comment = '';
    if (isRelevant) {
      const matchingTeams = associatedTeams.filter((team) => userInterests.includes(team));
      if (matchingTeams.length > 0) {
        comment = `Ótimo! Este perfil HLTV para ${profileName} é relevante, pois ${profileName} joga pela ${matchingTeams.join(' e ')}, que está nos seus interesses.`;
      } else {
        comment = `Ótimo! Este perfil HLTV para ${profileName} é relevante, pois está relacionado ao CS:GO, que está nos seus interesses.`;
      }
    } else {
      comment = `Este perfil HLTV para ${profileName} é válido, mas não corresponde aos seus interesses em ${userInterests.join(' e ')}.`;
    }

    console.log('HLTV validation:', { profileName, associatedTeams, isRelevant });

    return res.json({
      isValid: isRelevant,
      details: isRelevant ? 'Perfil HLTV válido e relevante!' : 'Perfil HLTV válido, mas não relevante.',
      comment,
    });
  }

  try {
    console.log('Fetching URL:', link);
    const response = await axios.get(link, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 10000,
    });

    if (!response.headers['content-type'].includes('text/html')) {
      console.log('Non-HTML response:', response.headers['content-type']);
      return res.json({
        isValid: false,
        details: 'O link não retornou uma página HTML válida.',
        comment: 'O conteúdo não é um perfil de e-sports. Tente outro link.',
      });
    }

    if (response.status === 403 && response.data.includes('cdn-cgi/challenge-platform')) {
      console.log('Cloudflare challenge detected:', link);
      const urlParts = url.pathname.split('/');
      const profileName = urlParts[urlParts.length - 1]?.toLowerCase() || '';
      const isEsportsProfile = profileName && (url.pathname.includes('profile') || url.pathname.includes('player'));

      if (!isEsportsProfile) {
        return res.json({
          isValid: false,
          details: 'O link não parece ser um perfil de e-sports.',
          comment: 'O link deve ser um perfil de jogador (ex: Liquipedia, FACEIT, Steam).',
        });
      }

      const associatedTeams = playerTeamMap[profileName] || [];
      const isRelevant = userInterests.length === 0 || userInterests.some((interest) =>
        associatedTeams.includes(interest) ||
        ['cs:go', 'cs2', 'counter-strike'].includes(interest) ||
        interest === profileName
      );

      let comment = '';
      if (isRelevant) {
        const matchingTeams = associatedTeams.filter((team) => userInterests.includes(team));
        if (matchingTeams.length > 0) {
          comment = `Ótimo! Este perfil para ${profileName} é relevante, pois ${profileName} joga pela ${matchingTeams.join(' e ')}, que está nos seus interesses.`;
        } else {
          comment = `Ótimo! Este perfil para ${profileName} è relevante, pois está relacionado ao CS:GO, que está nos seus interesses.`;
        }
      } else {
        comment = `Este perfil para ${profileName} é válido, mas não corresponde aos seus interesses em ${userInterests.join(' e ')}.`;
      }

      console.log('Cloudflare fallback validation:', { profileName, associatedTeams, isRelevant });

      return res.json({
        isValid: isRelevant,
        details: isRelevant ? 'Perfil válido e relevante!' : 'Perfil válido, mas não relevante.',
        comment,
      });
    }

    const $ = cheerio.load(response.data);

    const profileTitle = ($('h1').text() || '').toLowerCase();
    const profileNickname = ($('.profile-name, .player-nickname, h1, .username').first().text() || '').toLowerCase();
    const gameMentions = ($('.game-title, .stats-section, .match-history').text() || '').toLowerCase();
    const teamMentions = ($('.team-name, .clan-tag').text() || '').toLowerCase();
    const hasStats = $('.stats-section, .elo-rating, .match-history').length > 0;

    console.log('Scraped data:', { profileNickname, gameMentions, teamMentions, hasStats });

    const isEsportsProfile = profileTitle.includes('profile') || hasStats || 
      ['counter-strike', 'cs:go', 'cs2'].some((game) => gameMentions.includes(game));

    if (!isEsportsProfile) {
      console.log('Not an esports profile');
      return res.json({
        isValid: false,
        details: 'O link não é um perfil de e-sports válido.',
        comment: 'O conteúdo não parece ser um perfil de e-sports. Tente um link de Liquipedia, HLTV, FACEIT ou Steam.',
      });
    }

    const associatedTeams = playerTeamMap[profileNickname] || [];
    const isRelevant = userInterests.length === 0 || userInterests.some((interest) =>
      associatedTeams.includes(interest) ||
      gameMentions.includes(interest) ||
      teamMentions.includes(interest) ||
      interest === profileNickname
    );

    const siteName = validDomains.find((domain) => url.hostname.includes(domain)).split('.')[0];
    let comment = '';
    if (isRelevant) {
      const matchingTeams = associatedTeams.filter((team) => userInterests.includes(team));
      if (matchingTeams.length > 0) {
        comment = `Ótimo! Este perfil ${siteName} para ${profileNickname} é relevante, pois ${profileNickname} joga pela ${matchingTeams.join(' e ')}, que está nos seus interesses.`;
      } else {
        comment = `Ótimo! Este perfil ${siteName} para ${profileNickname} é relevante, pois está relacionado a ${userInterests.join(' ou ')}.`;
      }
    } else {
      comment = `Este perfil ${siteName} para ${profileNickname} é válido, mas não corresponde aos seus interesses em ${userInterests.join(' e ')}.`;
    }

    console.log('Validation:', { profileNickname, associatedTeams, isRelevant });

    res.json({
      isValid: isRelevant,
      details: isRelevant ? 'Perfil válido e relevante!' : 'Perfil válido, mas não relevante.',
      comment,
    });
  } catch (error) {
    console.error('Link validation error:', error.message, error.stack);
    res.status(500).json({
      isValid: false,
      details: `Erro ao validar link: ${error.message}`,
      comment: 'Houve um problema ao processar o link. Tente novamente.',
    });
  }
});

app.post('/validate-document', upload.fields([{ name: 'document' }, { name: 'selfie' }]), async (req, res) => {
  try {
    const documentFile = req.files['document']?.[0];
    const selfieFile = req.files['selfie']?.[0];
    const fullName = req.body.fullName || '';

    if (!documentFile) {
      return res.status(400).json({ isValid: false, details: 'Document file is required.' });
    }

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(documentFile.mimetype) || (selfieFile && !validTypes.includes(selfieFile.mimetype))) {
      return res.status(400).json({ isValid: false, details: 'Invalid file format. Use JPEG or PNG.' });
    }

    const detectTextCommand = new DetectTextCommand({
      Image: { Bytes: documentFile.buffer },
    });
    const textResult = await rekognitionClient.send(detectTextCommand);
    const detectedText = textResult.TextDetections.map((detection) => detection.DetectedText.toLowerCase());

    const idKeywords = ['cpf', 'rg', 'identidade', 'id', 'carteira', fullName.toLowerCase()].filter(Boolean);
    const hasValidText = detectedText.some((text) => idKeywords.some((keyword) => text.includes(keyword)));

    let faceMatch = true;
    if (selfieFile) {
      const compareFacesCommand = new CompareFacesCommand({
        SourceImage: { Bytes: documentFile.buffer },
        TargetImage: { Bytes: selfieFile.buffer },
        SimilarityThreshold: 80,
      });
      const faceResult = await rekognitionClient.send(compareFacesCommand);
      faceMatch = faceResult.FaceMatches.length > 0 && faceResult.FaceMatches[0].Similarity >= 80;
    }

    const isValid = hasValidText && faceMatch;
    const details = isValid
      ? 'Document validated with matching text and face (if provided).'
      : `Validation failed: ${!hasValidText ? 'No ID-related text detected' : ''}${!faceMatch ? ' Face mismatch' : ''}`;

    res.json({ isValid, details });
  } catch (error) {
    console.error('Document validation error:', {
      message: error.message,
      code: error.code,
      requestId: error.requestId,
      stack: error.stack,
    });
    let details = 'Error validating document';
    if (error.message.includes('Resolved credential object is not valid')) {
      details = 'Invalid AWS credentials. Check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env.';
    } else if (error.code === 'AccessDeniedException') {
      details = 'AWS credentials lack Rekognition permissions.';
    } else if (error.code === 'InvalidImageFormatException') {
      details = 'Invalid image format. Use JPEG or PNG.';
    } else if (error.code === 'LimitExceededException') {
      details = 'AWS Rekognition rate limit exceeded.';
    } else {
      details = error.message;
    }
    res.status(500).json({ isValid: false, details, code: error.code || 'Unknown' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});