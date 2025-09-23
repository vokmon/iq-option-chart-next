import { createServer } from "http";
import { WebSocketServer } from "ws";
import WebSocket from "ws";

const PORT = 3001; // Different port from Next.js

// Create HTTP server for health check
const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket Proxy Server Running");
});

// Create WebSocket server
const wss = new WebSocketServer({
  server,
  path: "/proxy/ws",
});

console.log(`🚀 WebSocket proxy server starting on port ${PORT}`);
console.log(`📡 Proxy endpoint: ws://localhost:${PORT}/proxy/ws`);
console.log(`🎯 Target: wss://iqoption.com`);

wss.on("connection", (clientWs: WebSocket) => {
  console.log("✅ Client connected to proxy");

  // Target WebSocket URL
  const targetUrl = "wss://iqoption.com/echo/websocket";
  let targetWs: WebSocket | null = null;

  // Connect to target WebSocket
  const connectToTarget = (): void => {
    console.log(`🔗 Connecting to target: ${targetUrl}`);
    targetWs = new WebSocket(targetUrl);

    targetWs.on("open", () => {
      console.log("✅ Connected to target WebSocket");
    });

    targetWs.on("message", (data: WebSocket.Data) => {
      // Forward messages from target to client as JSON
      if (clientWs.readyState === WebSocket.OPEN) {
        try {
          // Convert data to string first, then parse as JSON and stringify again
          const dataString = data.toString();
          const jsonData = JSON.parse(dataString);
          clientWs.send(JSON.stringify(jsonData));
        } catch {
          // If it's not valid JSON, send as string
          console.log(
            "📨 Forwarding non-JSON data as string:",
            data.toString()
          );
          clientWs.send(data.toString());
        }
      }
    });

    targetWs.on("close", (code: number, reason: Buffer) => {
      console.log(`❌ Target WebSocket closed: ${code} ${reason.toString()}`);
      // Reconnect after 3 seconds
      setTimeout(connectToTarget, 3000);
    });

    targetWs.on("error", (error: Error) => {
      console.error("❌ Target WebSocket error:", error.message);
    });
  };

  // Handle messages from client
  clientWs.on("message", (data: WebSocket.Data) => {
    // Forward messages from client to target as JSON
    if (targetWs && targetWs.readyState === WebSocket.OPEN) {
      try {
        // Convert data to string first, then parse as JSON and stringify again
        const dataString = data.toString();
        const jsonData = JSON.parse(dataString);
        targetWs.send(JSON.stringify(jsonData));
      } catch {
        // If it's not valid JSON, send as string
        console.log("📤 Forwarding non-JSON data as string:", data.toString());
        targetWs.send(data.toString());
      }
    }
  });

  clientWs.on("close", () => {
    console.log("👋 Client disconnected");
    if (targetWs) {
      targetWs.close();
    }
  });

  clientWs.on("error", (error: Error) => {
    console.error("❌ Client WebSocket error:", error.message);
  });

  // Start connection to target
  connectToTarget();
});

server.listen(PORT, () => {
  console.log(`🎉 Proxy server running on http://localhost:${PORT}`);
});
