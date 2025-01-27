"use client";

import React, { useEffect, useRef, useState } from "react";
import { useWebSocketContext } from "../hooks/webSocketHook";
import { useRoomContext } from "../hooks/useRoomContext";

type Point = { x: number; y: number };
type DrawAction = { type: "draw"; points: Point[]; color: string };

export const Canvas = () => {
  const { roomId } = useRoomContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [color, setColor] = useState("#000000");
  const { sendMessage, addMessageHandler } = useWebSocketContext();

  useEffect(() => {
    const handleMessage = (data: DrawAction) => {
      if (data.type === "draw" && canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx && data.points.length > 1) {
          ctx.beginPath();
          data.points.forEach((point, index) => {
            if (index > 0) {
              ctx.moveTo(data.points[index - 1].x, data.points[index - 1].y);
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.strokeStyle = data.color;
          ctx.stroke();
        }
      }
    };

    addMessageHandler(handleMessage);
  }, [addMessageHandler]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setCurrentStroke([{ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY }]);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const newPoint = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
    setCurrentStroke((prev) => [...prev, newPoint]);

    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(currentStroke[currentStroke.length - 1]?.x ?? 0, currentStroke[currentStroke.length - 1]?.y ?? 0);
      ctx.lineTo(newPoint.x, newPoint.y);
      ctx.strokeStyle = color;
      ctx.stroke();
    }

    sendMessage({ type: "draw", roomId: roomId, data: [...currentStroke, newPoint], color });
  };

  const handleMouseUp = () => setIsDrawing(false);
  const handleMouseLeave = () => setIsDrawing(false);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="bg-white"
        style={{ border: "1px solid black" }}
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="mt-4 bg-white"
      />
    </div>
  );
};
