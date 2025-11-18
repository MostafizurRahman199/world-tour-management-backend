import { Request, Response } from "express";

import { GUIDE_STATUS } from "./guide.interface";
import catchAsync from "../../utils/catchAsync";
import { AppError } from "../../../errors";

import { sendResponse } from "../../utils/sendResponse";
import { GuideService } from "./guide.service";





export const applyGuide = catchAsync(async (req: Request, res: Response) => {

  const user = req.user as any;

  if (!user) throw new AppError("Authentication required", 401);
  if (!req.file) throw new AppError("NID photo is required", 400);

  // multerUpload.single("file") দিয়ে আসা file info
  const nidPhotoUrl = (req.file as any)?.path; // Cloudinary file URL
  const { divisionId } = req.body;

  const application = await GuideService.createGuideApplicationService(
    user._id,
    divisionId,
    nidPhotoUrl
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Guide application submitted successfully",
    data: application,
  });
});




export const approveGuide = catchAsync(async (req: Request, res: Response) => {
 
    const { id } = req.params;
  const { status } = req.body;

  const application = await GuideService.updateGuideApplicationStatusService(
    id,
    status as GUIDE_STATUS
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Guide application ${status.toLowerCase()}`,
    data: application,
  });
});

export const getApplications = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    ...req.query,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
  };

  const result = await GuideService.getGuideApplicationsService(filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Guide applications retrieved successfully",
    data: result,
  });
});




export const getSingleApplication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GuideService.getSingleGuideApplicationService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Guide application retrieved successfully",
    data: result,
  });
});
