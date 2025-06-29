const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const YT_API_KEY = process.env.YT_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing search query' });

  try {
    const resp = await axios.get(`${BASE_URL}/search`, {
      params: {
        key: YT_API_KEY,
        part: 'snippet',
        q,
        maxResults: 10,
        type: 'channel'
      }
    });

    const channels = resp.data.items.map(item => ({
      id: item.id.channelId,
      title: item.snippet.title,
      description: item.snippet.description
    }));

    res.json({ channels });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch data from YouTube API' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
