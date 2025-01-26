import { WebSocket } from "ws";
import { addClientToRoom, broadcastToRoom } from "../state/roomState";

// Handle incoming WebSocket messages
export const handleMessage = (message: string, ws: WebSocket) => {
  const parsedMessage = JSON.parse(message);
  const { type, roomId, data } = parsedMessage;

  if (type === "join-room") {
    addClientToRoom(roomId, ws); // Add client to the room
    broadcastToRoom(roomId, `A new user has joined the room!`);
  } else if (type === "send-message") {
    broadcastToRoom(roomId, data); // Broadcast message to all clients in the room
  } else if (type === "draw") {
    broadcastToRoom(roomId, JSON.stringify({ type: "draw", data })); // Forward drawing data to all clients in the room
  }

  console.log(`Message received: ${message}`);
};
