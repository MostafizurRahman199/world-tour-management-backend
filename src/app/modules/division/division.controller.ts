// src/app/modules/division/division.controller.ts

import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DivisionServices } from "./division.service";





// Create division controller
export const createDivision = catchAsync(async (req: Request, res: Response) => {

  // multerUpload.single("file") দিয়ে আসা file info
  const thumbnailUrl = (req.file as any)?.path; // Cloudinary file URL

  const payload = {
    ...req.body,
    thumbnail: thumbnailUrl, // add uploaded file
  };

  const result = await DivisionServices.createDivisionService(payload);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Division created successfully",
    data: result,
  });

});






// Update division
export const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DivisionServices.updateDivisionService(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Division updated successfully",
    data: result,
  });
});






// Delete division (soft delete or hard delete depending on service)
export const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DivisionServices.deleteDivisionService(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Division deleted successfully",
    data: result,
  });
});






// Get all divisions
export const getAllDivisions = catchAsync(async (req: Request, res: Response) => {

  const query = req.query;

  const result = await DivisionServices.getAllDivisionsService(query as Record<string, string>);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Divisions retrieved successfully",
    data: result,
  });
});






export const getSingleDivision = catchAsync( async (req: Request, res: Response) => {
    
    const { slug } = req.params;

    const result = await DivisionServices.getSingleDivisionService(slug);

    if (!result) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Division not found",
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Division retrieved successfully",
      data: result,
    });
  }
);




