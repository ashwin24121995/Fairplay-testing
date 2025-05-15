const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.use('/proxy', createProxyMiddleware({
  target: 'https://api.uvwin2024.co',
  changeOrigin: true,
  secure: true,
  pathRewrite: {
    '^/proxy': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('origin', 'https://www.fairplay.live');
    proxyReq.setHeader('referer', 'https://www.fairplay.live/');
    if (!req.body || Object.keys(req.body).length === 0) {
      proxyReq.setHeader('Content-Length', '0');
    }
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.writeHead(502, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({ error: 'Bad Gateway', message: err.message }));
  }
}));

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on port ${PORT}`);
});
