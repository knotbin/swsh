const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

// Proxy middleware configuration
const proxyOptions = {
  target: 'http://localhost:3001',
  changeOrigin: true,
}

// Proxy all API requests with subpaths
app.use(
  '/xrpc',
  createProxyMiddleware({ ...proxyOptions, pathRewrite: undefined }),
)
app.use(
  '/oauth',
  createProxyMiddleware({ ...proxyOptions, pathRewrite: undefined }),
)
app.use(
  '/client-metadata.json',
  createProxyMiddleware({ ...proxyOptions, pathRewrite: undefined }),
)
app.use(
  '/oauth-client-metadata.json',
  createProxyMiddleware({ ...proxyOptions, pathRewrite: undefined }),
)
app.use(
  '/resolve',
  createProxyMiddleware({ ...proxyOptions, pathRewrite: undefined }),
)
app.use(
  '/.well-known',
  createProxyMiddleware({ ...proxyOptions, pathRewrite: undefined }),
)
app.use('/api', createProxyMiddleware(proxyOptions))
// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')))

// Handle SPA routing - send all other requests to index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port, () => {
  console.log(`Production server running at http://localhost:${port}`)
})
