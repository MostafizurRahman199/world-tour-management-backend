import mongoose from "mongoose";
import { User } from "../user/user.model";
import { Division } from "../division/division.model";
import { AppError } from "../../../errors";
import { GuideApplication } from "./guide.model";
import { GUIDE_STATUS } from "./guide.interface";
import { Role } from "../user/user.interface";





// ✅ Create Guide Application

const createGuideApplicationService = async (
  userId: string,
  divisionId: string,
  file?: Express.Multer.File
) => {


  const division = await Division.findById(divisionId);
  if (!division) throw new AppError("Division not found", 404);

  const existing = await GuideApplication.findOne({ user: userId });
  if (existing) throw new AppError("You already applied for guide role", 400);

  // ✅ Handle uploaded NID/photo from multer (Cloudinary URL)
  const nidPhotoUrl = file ? (file as any).path : undefined;

  if (!nidPhotoUrl) {
    throw new AppError("NID photo is required", 400);
  }

  return await GuideApplication.create({
    user: userId,
    nidPhoto: nidPhotoUrl,
    division: divisionId,
  });
};







// ✅ Update Guide Application Status
const updateGuideApplicationStatusService = async (
  applicationId: string,
  status: GUIDE_STATUS
) => {


  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const application = await GuideApplication.findById(applicationId).session(session);
    if (!application) throw new AppError("Guide application not found", 404);

    if (application.status === status) {
      throw new AppError(`Application already ${status}`, 400);
    }

    if (application.status === GUIDE_STATUS.APPROVED && status === GUIDE_STATUS.REJECTED) {
      throw new AppError("Cannot reject an already approved application", 400);
    }

    application.status = status;
    await application.save({ session });

    // ✅ If approved → upgrade user role
    if (status === GUIDE_STATUS.APPROVED) {
      const user = await User.findById(application.user).session(session);
      if (!user) throw new AppError("Associated user not found", 404);

      user.role = Role.GUIDE;
      await user.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return await GuideApplication.findById(applicationId).populate("user division");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};





// ✅ Get All Guide Applications (with filters + pagination)
const getGuideApplicationsService = async (filters: {
  status?: string;
  division?: string;
  user?: string;
  page?: number;
  limit?: number;
}) => {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const skip = (page - 1) * limit;

  const query: any = {};
  if (filters.status) query.status = filters.status;
  if (filters.division) query.division = filters.division;
  if (filters.user) query.user = filters.user;

  const [total, data] = await Promise.all([
    GuideApplication.countDocuments(query),
    GuideApplication.find(query)
      .populate("user division")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};




// ✅ Get Single Guide Application
const getSingleGuideApplicationService = async (id: string) => {
  const application = await GuideApplication.findById(id).populate("user division");
  if (!application) throw new AppError("Guide application not found", 404);
  return application;
};




export const GuideService = {
  createGuideApplicationService,
  updateGuideApplicationStatusService,
  getGuideApplicationsService,
  getSingleGuideApplicationService,
};
