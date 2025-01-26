import { WebSocket } from "ws";

type RoomData = {
  name: string;
  clients: Set<WebSocket>;
};

const rooms: Map<string, RoomData> = new Map();

// Add a new room
export const addRoom = (roomId: string, name: string) => {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, { name, clients: new Set() });
  }
};

// Add a client (WebSocket) to a room
export const addClientToRoom = (roomId: string, ws: WebSocket) => {
  const room = rooms.get(roomId);
  if (room) {
    room.clients.add(ws);
    console.log(`Client added to room ${roomId}`);
  } else {
    console.error(`Room ${roomId} does not exist`);
  }
};

// Remove a client (WebSocket) from a specific room
export const removeClientFromRoom = (roomId: string, ws: WebSocket) => {
  const room = rooms.get(roomId);
  if (room) {
    room.clients.delete(ws);
    if (room.clients.size === 0) {
      rooms.delete(roomId); // Remove the room if it's empty
      console.log(`Room ${roomId} removed (no clients left)`);
    } else {
      console.log(`Client removed from room ${roomId}`);
    }
  } else {
    console.error(`Room ${roomId} does not exist`);
  }
};

// Get all rooms
export const getRooms = () => Array.from(rooms.entries());

// Send a message to all clients in a room
export const broadcastToRoom = (roomId: string, message: string) => {
  const room = rooms.get(roomId);
  if (room) {
    for (const client of room.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
};

// Remove a client from all rooms they belong to
export const removeClientFromAllRooms = (ws: WebSocket) => {
  for (const [roomId, room] of getRooms()) {
    if (room.clients.has(ws)) {
      removeClientFromRoom(roomId, ws); // Remove client from the room
      broadcastToRoom(roomId, `A user has left the room!`); // Broadcast message to all remaining clients
    }
  }
};
