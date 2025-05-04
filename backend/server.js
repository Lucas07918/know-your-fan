const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for frontend origin
app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());

// Proxy endpoint for Twitter API requests
app.get('/twitter-api/:endpoint', async (req, res) => {
  const endpoint = req.params.endpoint || 'unknown'; // Ensure endpoint is defined
  const { accessToken, userId } = req.query;

  try {
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token is required' });
    }

    console.log('Twitter API request:', {
      endpoint,
      userId,
      accessToken: accessToken.slice(0, 10) + '...',
      url: req.originalUrl,
    });

    // Map endpoint to Twitter API URL
    const endpointMap = {
      'users-me': 'https://api.twitter.com/2/users/me',
      'following': `https://api.twitter.com/2/users/${userId}/following?max_results=100`,
      'tweets': `https://api.twitter.com/2/users/${userId}/tweets?max_results=20&tweet.fields=created_at,entities`,
    };

    const url = endpointMap[endpoint];
    if (!url) {
      return res.status(400).json({ error: `Invalid endpoint: ${endpoint}` });
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Twitter API response:', {
      endpoint,
      status: response.status,
      data: response.data,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Twitter API proxy error:', {
      endpoint,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch Twitter data',
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});