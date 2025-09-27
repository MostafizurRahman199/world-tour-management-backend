import { Request, Response } from "express";

import { StatsService } from "./stats.service";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  
    const result = await StatsService.getDashboardStats();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Dashboard stats retrieved successfully",
    data: result,
  });
});


export const StatsController ={
getDashboardStats
}