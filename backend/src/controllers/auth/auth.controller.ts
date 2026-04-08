import { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.validation.js";
import User from "../../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/generateToken.js";
import ms from "ms";
import { formatZodError } from "../../utils/formatZodError.js";
import { getCookieOptions } from "../../utils/cookieOptions.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors: formatZodError(validation.error),
      });
    }

    const { name, email, password } = validation.data;

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(409).json({
        message:
          "Email Id already exist, please try again with a different email id",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      email,
      password: passwordHash,
      name,
    });

    const { accessToken, refreshToken } = generateToken(
      newUser._id.toString(),
      newUser.name,
      newUser.tokenVersion,
    );

    res.cookie("refreshToken", refreshToken, getCookieOptions());

    return res.status(201).json({
      message: "User registered",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      accessToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors: formatZodError(validation.error),
      });
    }

    const { email, password } = validation.data;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateToken(
      user._id.toString(),
      user.name,
      user.tokenVersion,
    );

    res.cookie("refreshToken", refreshToken, getCookieOptions());

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const { maxAge, ...clearOptions } = getCookieOptions();

    res.clearCookie("refreshToken", clearOptions);

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const refreshHandler = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is missing" });
    }

    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as {
      _id: string;
      tokenVersion: number;
    };

    const user = await User.findById(payload._id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ message: "Invalid refresh session" });
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      generateToken(user._id.toString(), user.name, user.tokenVersion);

    res.cookie("refreshToken", newRefreshToken, getCookieOptions());

    return res.status(200).json({
      message: "Token refreshed",
      accessToken: newAccessToken,
    });
  } catch (err) {
    const { maxAge, ...clearOptions } = getCookieOptions();
    res.clearCookie("refreshToken", clearOptions);
    return res.status(401).json({ message: "Session expired" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    const user = await User.findById(userId).select("-password -tokenVersion");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
