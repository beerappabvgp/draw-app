import express from "express";
import { signInSchema, signUpSchema } from "../schema/user";
import { signIn, signUp } from "../controllers/userController";
import { validateSchema } from "../middlewares/validateSchema";

const router = express.Router();

router.post("/signup", validateSchema(signUpSchema), signUp);
router.post("/signin", validateSchema(signInSchema), signIn);

export default router;
