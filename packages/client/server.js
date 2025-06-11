const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Proxy middleware configuration
const proxyOptions = {
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // remove /api prefix when forwarding
  },
};

// Proxy all API requests
app.use('/xrpc', createProxyMiddleware(proxyOptions));
app.use('/oauth', createProxyMiddleware(proxyOptions));
app.use('/client-metadata.json', createProxyMiddleware(proxyOptions));
app.use('/resolve', createProxyMiddleware(proxyOptions));
app.use('/api', createProxyMiddleware(proxyOptions));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - send all other requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Production server running at http://localhost:${port}`);
}); 