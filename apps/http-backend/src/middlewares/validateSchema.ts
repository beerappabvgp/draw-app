import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateSchema =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("req.body = ", req.body);
      schema.parse(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({ error: error.errors });
    }
  };
