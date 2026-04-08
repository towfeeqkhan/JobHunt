import { Request, Response } from "express";
import { parseJobDescription } from "../../services/openai.service.js";

interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
  };
}

export const parseDescription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { jobDescriptionRaw } = req.body;

    if (!jobDescriptionRaw || typeof jobDescriptionRaw !== "string") {
      return res
        .status(400)
        .json({ message: "jobDescriptionRaw is required" });
    }

    if (jobDescriptionRaw.trim().length < 20) {
      return res.status(400).json({
        message:
          "Job description is too short. Paste the full job posting for best results.",
      });
    }

    const parsed = await parseJobDescription(jobDescriptionRaw);

    return res.status(200).json({ parsed });
  } catch (error: any) {
    console.error("Error parsing job description:", error);

    if (error?.status === 401 || error?.code === "invalid_api_key") {
      return res
        .status(500)
        .json({ message: "OpenAI API key is invalid or missing" });
    }

    if (error?.status === 429) {
      return res
        .status(429)
        .json({ message: "Rate limit reached. Please try again shortly." });
    }

    return res.status(500).json({ message: "Failed to parse job description" });
  }
};
