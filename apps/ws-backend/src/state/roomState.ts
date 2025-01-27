import { WebSocket } from "ws";

type RoomData = {
  name: string;
  clients: Set<WebSocket>;
};

// Store rooms in a Map
const rooms: Map<string, RoomData> = new Map();

// Add a new room
export const addRoom = (roomId: string, name: string) => {
  const normalizedRoomId = String(roomId); // Normalize to string
  if (!rooms.has(normalizedRoomId)) {
    rooms.set(normalizedRoomId, { name, clients: new Set() });
    console.log(`Room ${normalizedRoomId} added: ${name}`);
  } else {
    console.warn(`Room ${normalizedRoomId} already exists.`);
  }
};

// Add a client (WebSocket) to a room
export const addClientToRoom = (roomId: string, ws: WebSocket) => {
  const normalizedRoomId = String(roomId); // Normalize to string
  const room = rooms.get(normalizedRoomId);

  if (room) {
    room.clients.add(ws);
    console.log(
      `Client added to room ${normalizedRoomId}. Total clients: ${room.clients.size}`
    );
  } else {
    console.error(`Room ${normalizedRoomId} does not exist.`);
  }
};

// Remove a client (WebSocket) from a specific room
export const removeClientFromRoom = (roomId: string, ws: WebSocket) => {
  const normalizedRoomId = String(roomId); // Normalize to string
  const room = rooms.get(normalizedRoomId);
  if (room) {
    room.clients.delete(ws);
    console.log(
      `Client removed from room ${normalizedRoomId}. Remaining clients: ${room.clients.size}`
    );

    if (room.clients.size === 0) {
      rooms.delete(normalizedRoomId);
      console.log(`Room ${normalizedRoomId} removed (no clients left).`);
    }
  } else {
    console.error(`Room ${normalizedRoomId} does not exist.`);
  }
};

// Get all rooms
export const getRooms = (): [string, RoomData][] => Array.from(rooms.entries());

// Send a message to all clients in a room
export const broadcastToRoom = (roomId: string, message: string) => {
  const normalizedRoomId = String(roomId); // Normalize to string
  const room = rooms.get(normalizedRoomId);
  if (room) {
    for (const client of room.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
        console.log("message sent to the client ...", client);
      }
    }
    console.log(`Broadcast message to room ${normalizedRoomId}: "${message}"`);
  } else {
    console.error(`Room ${normalizedRoomId} does not exist.`);
  }
};

// Remove a client from all rooms they belong to
export const removeClientFromAllRooms = (ws: WebSocket) => {
  for (const [roomId, room] of getRooms()) {
    if (room.clients.has(ws)) {
      removeClientFromRoom(roomId, ws);
      broadcastToRoom(roomId, `A user has left the room!`);
    }
  }
};

// Ensure the room exists before adding a client
export const ensureRoomExistsAndAddClient = (
  roomId: string,
  name: string,
  ws: WebSocket
) => {
  const normalizedRoomId = String(roomId); // Normalize to string
  if (!rooms.has(normalizedRoomId)) {
    addRoom(normalizedRoomId, name); // Add the room if it doesn't exist
    console.log(`Room ${normalizedRoomId} ensured to exist.`);
  }
  addClientToRoom(normalizedRoomId, ws); // Add the client to the room
};

// Example WebSocket message handling (integrated example)
export const handleWebSocketMessage = (ws: WebSocket, message: string) => {
  const parsedMessage = JSON.parse(message);
  const normalizedRoomId = String(parsedMessage.roomId); // Normalize to string
  console.log("parsedMessage.type: ", parsedMessage.type);
  switch (parsedMessage.type) {
    case "join-room":
      console.log(`Joining room ${normalizedRoomId}...`);
      ensureRoomExistsAndAddClient(normalizedRoomId, "default-room-name", ws);
      break;
    case "draw":
      console.log(`Received draw action in room ${normalizedRoomId}.`);
      // Broadcast the draw action to all clients in the room
      broadcastToRoom(
        normalizedRoomId,
        JSON.stringify({
          type: "draw",
          data: parsedMessage.data, // Drawing data (e.g., coordinates, color, etc.)
        })
      );
      console.log("broadcasted to room .... ");
      break;
    default:
      console.error("Unknown message type:", parsedMessage.type);
  }
};

// Debug helper to log all rooms
export const logRooms = () => {
  console.log("Current rooms map:", Array.from(rooms.entries()));
};
