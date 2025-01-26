import  { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";
import redisClient from "../utils/redisClient";
export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name, userId } = req.body; 
    const room = await prismaClient.room.create({
      data: { name, createdById: userId },
    });

    // publish the event to redis 
    const eventPayload = JSON.stringify({ roomId: room.id, name: room.name });
    await redisClient.publish("room-events", eventPayload);
    console.log("room created event published successfully ... ");
    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};  