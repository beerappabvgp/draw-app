'use client';

import React, { useRef, useState } from "react";
import { useWebSocket } from "../hooks/webSocketHook";

type Point = { x: number; y: number };
type DrawAction = {
    type: "DRAW",
    points: Point[];
    color: string;
}


export const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
    const [color, setColor] = useState<string>("#000000");

    // Function to handle incoming web socket connections
    const onMessage = (data: DrawAction) => {
        if (data.type === "DRAW" && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            
            if (!data.points || data.points.length < 2) {
                return;
            }

            if (ctx) {
                ctx.beginPath();
                for (let i = 1; i < data.points.length; i++) {
                    ctx.moveTo(data.points[i - 1]?.x ?? 0, data.points[i - 1]?.y ?? 0);
                    ctx.lineTo(data.points[i]?.x ?? 0, data.points[i]?.y ?? 0);
                }
                ctx.strokeStyle = data.color;
                ctx.stroke();
            }
        }
    };


    // websocket hook for handling connection and sending messages

    const { sendMessage } = useWebSocket("ws://localhost:5000/", onMessage);
    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        setCurrentStroke([{ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY }]);
    }

    // handle mouse move event
    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !canvasRef.current) {
            return;
        }
        const newPoint = { x:event.nativeEvent.offsetX, y:event.nativeEvent.offsetY };
        setCurrentStroke((prev) => [...prev, newPoint]);
        // send to all other clients '
        sendMessage({
            type: "DRAW",
            points: [...currentStroke, newPoint],
            color: color,
        });
        // drawing logic for the current stroke
        const ctx = canvasRef.current.getContext("2d");
        if(ctx) {
            ctx.beginPath();
            ctx.moveTo(currentStroke[currentStroke.length - 1]?.x ?? 0, currentStroke[currentStroke.length - 1]?.y ?? 0);
            ctx.lineTo(newPoint.x, newPoint.y);
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    }

    // handle mouse up event
    const handleMouseUp = () => {
        setIsDrawing(false);
    }

    // mouse leave 
    const handleMouseLeave = () => {
        setIsDrawing(false);
    }

    return (
        <div>
            <canvas
                ref = {canvasRef}
                width = {window.innerWidth}
                height= {window.innerHeight}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="bg-white"
                style = {{ border: "1px solid black" }}
            >
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-4 bg-white"/>
            </canvas>
        </div>
    );
}