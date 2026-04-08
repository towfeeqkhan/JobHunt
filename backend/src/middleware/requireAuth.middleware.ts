import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
  };
}

async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access token is missing" });
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      _id: string;
      name: string;
      tokenVersion: number;
    };

    const user = await User.findById(payload._id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    req.user = {
      _id: user._id.toString(),
      name: user.name,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}

export default requireAuth;
