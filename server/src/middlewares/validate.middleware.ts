
import { ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";

type Schema = ZodTypeAny;

export const validateMiddleware = (schema: Schema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten(),
      });
    }

    req.body = result.data;
    next();
  };