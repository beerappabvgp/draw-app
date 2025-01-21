import { WebSocket, WebSocketServer } from "ws";
import dotenv from 'dotenv';
dotenv.config();

const wss = new WebSocketServer({ port: Number(process.env.PORT) || 4000 });

console.log(`websocket server running on ws://localhost:${Number(process.env.PORT)}`);

const clients = new Set<WebSocket>();

wss.on("connection", (ws) => {
    console.log("New Client connected ... ");
    clients.add(ws);
    const broadcast = (data: string) => {
        for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        }
    };
    ws.on("message", (message) => {
        console.log("message received : ", message.toString());
        broadcast(message.toString());
    });

    ws.on("close", () => {
        console.log("client disconnected ... ");
        clients.delete(ws);
    });
});