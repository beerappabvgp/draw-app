"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";

type WebSocketContextType = {
  sendMessage: (message: any) => void;
  addMessageHandler: (handler: (data: any) => void) => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ url: string; children: React.ReactNode }> = ({
  url,
  children,
}) => {
  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<((data: any) => void)[]>([]);

  useEffect(() => {
    let isUnmounted = false;

    const connectWebSocket = () => {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => console.log("WebSocket connection established.");
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handlersRef.current.forEach((handler) => handler(data));
      };

      ws.onerror = (error) => console.error("WebSocket error:", error);

      ws.onclose = () => {
        console.log("WebSocket connection closed.");
        if (!isUnmounted) {
          console.log("Reconnecting WebSocket...");
          setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
        }
      };
    };

    connectWebSocket();

    return () => {
      isUnmounted = true;
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open.");
    }
  };

  const addMessageHandler = (handler: (data: any) => void) => {
    handlersRef.current.push(handler);
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, addMessageHandler }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider");
  }
  return context;
};
