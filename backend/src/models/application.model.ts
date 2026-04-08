import mongoose, { InferSchemaType } from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobDescriptionRaw: {
      type: String,
      required: true,
    },

    jobTitle: {
      type: String,
      default: "Unspecified",
      trim: true,
    },

    company: {
      type: String,
      default: "Unspecified",
      trim: true,
    },

    location: {
      type: String,
      default: "Not specified",
      trim: true,
    },

    salaryRange: {
      type: String,
      default: "Not disclosed",
      trim: true,
    },

    jobDescriptionSummary: {
      type: String,
      default: "Not generated",
    },

    resumeBulletSuggestions: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["Applied", "Phone Screen", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
  },
  {
    timestamps: true,
  },
);

type ApplicationType = InferSchemaType<typeof ApplicationSchema>;

const Application = mongoose.model<ApplicationType>(
  "Application",
  ApplicationSchema,
);

export default Application;
