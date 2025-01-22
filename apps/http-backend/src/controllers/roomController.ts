import { prisma } from "../utils/prisma";
import { Request, Response } from "express";

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name, userId } = req.body; 
    const room = await prisma.room.create({
      data: { name, createdById: userId },
    });
    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};