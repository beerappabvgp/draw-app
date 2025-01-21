import { useCallback, useEffect, useRef } from "react";

export const useWebSocket = (url: string, onMessage: (data: any) => void) => {
    const wsRef = useRef<WebSocket | null>(null);
    const sendMessage = useCallback((message: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket is not open ... ");
        }
    }, []);

    // establish the ws connection 
    useEffect(() => {
        const ws = new WebSocket(url);
        wsRef.current = ws;
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (error) {
                console.error("Error parsing the websocket message ... ", error);
            }
        }
        ws.onerror = (error) => {
            console.error("Websocket error : ", error);
        }

        ws.onclose = () => {
            console.log("Web socket connection closed ...");
        }

        return () => {
            ws.close();
        }
    }, [url]);
    return { sendMessage}
}