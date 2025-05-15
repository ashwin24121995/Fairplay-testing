const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files from "public"
app.use(express.static(path.join(__dirname, 'public')));

// Proxy register route
app.post('/register', async (req, res) => {
  try {
    const { username, password, phone } = req.body;

    const response = await axios.post('https://api.uvwin2024.co/account/v2/register', {
      username,
      password,
      phone
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Unknown error from API'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
