import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  try {
    const payload = (jwt.verify( token, process.env.JWT_SECRET);
    (req as any).user = payload
    next();
  } catch (err) {
    res.sendStatus(403);
  }
};
