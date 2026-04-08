import { Request, Response } from "express";
import Application from "../../models/application.model.js";
import { formatZodError } from "../../utils/formatZodError.js";
import {
  createApplicationSchema,
  updateApplicationSchema,
} from "./application.validation.js";

interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
  };
}

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validation = createApplicationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors: formatZodError(validation.error),
      });
    }

    const application = await Application.create({
      ...validation.data,
      userId,
    });

    return res.status(201).json({
      message: "Application created successfully",
      application,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const applications = await Application.find({ userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const application = await Application.findOne({ _id: id, userId });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json({ application });
  } catch (error) {
    console.error("Error fetching application:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateApplication = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validation = updateApplicationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors: formatZodError(validation.error),
      });
    }

    const application = await Application.findOneAndUpdate(
      { _id: id, userId },
      { $set: validation.data },
      { returnDocument: "after", runValidators: true },
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json({
      message: "Application updated successfully",
      application,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteApplication = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const application = await Application.findOneAndDelete({ _id: id, userId });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res
      .status(200)
      .json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
