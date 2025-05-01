const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post('/twitter/token', async (req, res) => {
  const { code, codeVerifier, redirectUri } = req.body;

  const credentials = `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`;
  const basicAuth = Buffer.from(credentials).toString('base64');

  try {
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    const data = await response.json();
    console.log('Resposta do Twitter:', data);

    if (data.access_token) {
      res.status(200).json(data);
    } else {
      res.status(400).json({ error: 'Erro ao trocar o código.' });
    }
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
