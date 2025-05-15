const express = require('express');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.use('/proxy', createProxyMiddleware({
  target: 'https://api.uvwin2024.co',
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': '', // strip /proxy from the start
  },
  onProxyReq: (proxyReq, req, res) => {
    // Make sure empty POST bodies are allowed
    if (!req.body || Object.keys(req.body).length === 0) {
      proxyReq.setHeader('Content-Length', '0');
    }
  }
}));

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
