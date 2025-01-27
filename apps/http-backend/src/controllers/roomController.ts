import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";
import redisClient from "../utils/redisClient";

// Function to generate a random unique roomId
const generateUniqueRoomId = async () => {
  let roomId;
  let roomExists = true;
  
  // Ensure unique roomId by checking existence in the database
  while (roomExists) {
    roomId = Math.floor(Math.random() * 9000) + 1000; // Generates a random 4-digit number
    const existingRoom = await prismaClient.room.findFirst({
      where: { roomId }, // Check for existing roomId
    });

    if (!existingRoom) {
      roomExists = false; // If the roomId does not exist, break the loop
    }
  }

  return roomId;
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name, userId } = req.body; 

    // Generate a unique roomId
    const roomId = await generateUniqueRoomId();

    // Create the room with the unique roomId
    const room = await prismaClient.room.create({
      data: { 
        name, 
        createdById: userId, 
        roomId, // Add the generated roomId
      },
    });

    // Publish the event to Redis
    const eventPayload = JSON.stringify({ roomId: room.roomId, name: room.name });
    await redisClient.publish("room-events", eventPayload);
    console.log("Room created event published successfully...");

    // Respond with the created room data
    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
