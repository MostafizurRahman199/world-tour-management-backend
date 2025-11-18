import { Schema, model } from "mongoose";
import { IGuideApplication, GUIDE_STATUS } from "./guide.interface";

const guideSchema = new Schema<IGuideApplication>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one application per user
    },
    nidPhoto: {
      type: String,
      required: true,
    },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(GUIDE_STATUS),
      default: GUIDE_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const GuideApplication = model<IGuideApplication>(
  "GuideApplication",
  guideSchema
);
