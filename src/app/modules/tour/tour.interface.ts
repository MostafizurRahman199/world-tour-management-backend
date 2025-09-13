// src/app/modules/tour/tour.interface.ts

import { Types } from "mongoose";



export interface ITour {
  title: string;
  slug?: string;
  description?: string;
  images?: string[];
  location?: string;
  costFrom?: number;
  startDate?: Date;
  endDate?: Date;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: string[];
  maxGuest?: number;
  minAge?: number;
  division: Types.ObjectId; // Reference to Division ID
  tourType: Types.ObjectId; // Reference to TourType ID
}
