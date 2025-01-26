import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";
import { connectRedis } from "./redis/redisClient";
import { subscribeToRoomEvents } from "./redis/redisSubscriber";
import { removeClientFromAllRooms } from "./state/roomState";
import { handleMessage } from "./messages/messageHandler";

dotenv.config();

const wss = new WebSocketServer({ port: Number(process.env.PORT) || 4000 });

console.log(`WebSocket server running on ws://localhost:${Number(process.env.PORT)}`);

(async () => {
  await connectRedis();
  console.log("WebSocket server connected to Redis ...");

  // Subscribe to Redis events
  await subscribeToRoomEvents();
})();

// When a client connects to the WebSocket server
wss.on("connection", (ws) => {
  console.log("New client connected ...");

  ws.on("message", (message) => {
    handleMessage(message.toString(), ws); 
  });

  // When a client disconnects from the WebSocket server
  ws.on("close", () => {
    console.log("Client disconnected ...");

    // Remove client from all rooms
    removeClientFromAllRooms(ws);
  });

  // Handle any error that occurs with the WebSocket connection
  ws.on("error", (error) => {
    console.error(`WebSocket error: ${error}`);
  });
});
