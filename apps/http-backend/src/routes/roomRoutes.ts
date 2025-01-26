import express from "express";
import { createRoom } from "../controllers/roomController";
import { validateSchema } from "../middlewares/validateSchema";
import { createRoomSchema } from "../schema/user";
import { authenticate } from "../middlewares/authenticate";
const router: express.Router = express.Router();

router.post("/create", authenticate, validateSchema(createRoomSchema), createRoom);

export default router;
