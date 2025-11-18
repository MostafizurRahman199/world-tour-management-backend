import { Types } from "mongoose";

export enum GUIDE_STATUS {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IGuideApplication {
  _id?: Types.ObjectId;
  user: Types.ObjectId;      // Reference to User
  nidPhoto: string;          // NID photo url
  division: Types.ObjectId;  // Reference to Division
  status: GUIDE_STATUS;
  createdAt?: Date;
  updatedAt?: Date;
}
