import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createRoomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
});

