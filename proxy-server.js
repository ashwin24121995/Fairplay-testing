const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Generic proxy that forwards to FairPlay backend
app.use('/proxy', async (req, res) => {
  const targetUrl = 'https://api.uvwin2024.co' + req.url.replace('/proxy', '');
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        ...req.headers,
        origin: 'https://www.fairplay.live',
        referer: 'https://www.fairplay.live'
      },
      data: req.body
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).send(error.response?.data || 'Proxy error');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on port ${PORT}`);
});
