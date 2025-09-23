# IQ Option Chart

An application for IQ Option chart integration with real-time WebSocket connections.

## Getting Started

This project uses **bun** as the package manager and runtime.

### Prerequisites

Due to CORS restrictions, the IQ Option WebSocket and API endpoints don't work directly from localhost. This project includes a proxy server to handle these connections.

### Development Setup

1. **Start the proxy server** (required for IQ Option connections):

```bash
bun run proxy
```

2. **In a separate terminal, start the development server**:

```bash
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Important Notes

- **Proxy Server**: The `bun run proxy` command starts a proxy server that handles IQ Option WebSocket connections and API calls, bypassing CORS issues.
- **Server Actions**: Login functionality uses Next.js server actions to avoid CORS problems with the IQ Option API.
- **Development Workflow**: Always run both the proxy server and the Next.js dev server for full functionality.
