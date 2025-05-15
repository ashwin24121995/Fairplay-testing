const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.use('/proxy', createProxyMiddleware({
  target: 'https://api.uvwin2024.co',
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    // Forward original headers FairPlay expects
    proxyReq.setHeader('origin', 'https://www.fairplay.live');
    proxyReq.setHeader('referer', 'https://www.fairplay.live/');
    if (!req.body || Object.keys(req.body).length === 0) {
      proxyReq.setHeader('Content-Length', '0');
    }
  }
}));

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`✅ Proxy running on port ${PORT}`);
});
