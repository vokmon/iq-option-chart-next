# WebSocket Proxy Server

A simple development WebSocket proxy server that forwards connections from `ws://localhost:3001/proxy/ws` to `wss://iqoption.com`.

## Usage

```bash
# Start the proxy server
npm run proxy

# In another terminal, start your Next.js app
npm run dev
```

## Configuration

The proxy server runs on port 3001 and forwards all WebSocket connections to `wss://iqoption.com`.

## Features

- ✅ TypeScript support
- ✅ Automatic reconnection
- ✅ Message forwarding (bidirectional)
- ✅ Error handling
- ✅ Development-only solution

## Client Usage

In your React/Next.js app, connect to:

```typescript
const ws = new WebSocket("ws://localhost:3001/proxy/ws");
```

This is equivalent to the Vite proxy configuration:

```javascript
"/proxy/ws": {
  target: "wss://iqoption.com",
  ws: true,
  changeOrigin: true,
  rewriteWsOrigin: true,
  rewrite: (path) => path.replace(/^\/proxy\/ws/, ""),
}
```
