// src/app/modules/tour/tour.model.ts

import { model, Schema } from "mongoose";
import { ITour } from "./tour.interface";
import { makeSlug } from "../../utils/makeSlug";
import { IDivision } from "../division/division.interface";
import { Division } from "../division/division.model";





const tourSchema = new Schema<ITour>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
    },
    costFrom: {
      type: Number,
      min: 0,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    included: {
      type: [String],
    },
    excluded: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    tourPlan: {
      type: [String],
      default: [],
    },
    maxGuest: {
      type: Number,
      min: 1,
    },
    minAge: {
      type: Number,
      min: 0,
    },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
  },
  { timestamps: true }
);


// Pre-save middleware to generate unique slug

tourSchema.pre("save", async function (next) {
  if (this.isModified("title")) {   // ✅ FIXED condition
    let baseSlug = makeSlug(this.title);
    let slug = `${baseSlug}-tour`;

    let count = 0;
    while (await Tour.exists({ slug })) {
      count++;
      slug = `${baseSlug}-tour-${count}`;
    }
    this.slug = slug;
  }

  next();
});





// Pre-update middleware to handle slug on name change

tourSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Partial<ITour>;
  if (update.title) {
    let baseSlug = makeSlug(update.title);
    let slug = `${baseSlug}-tour`;
    let count = 0;
    while (await Tour.exists({ slug })) {
      count++;
      slug = `${baseSlug}-tour-${count}`;
    }
    update.slug = slug;
    this.setUpdate(update);
  }
  next();
});

export const Tour = model<ITour>("Tour", tourSchema);
