// src/app/modules/division/division.controller.ts

import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DivisionServices } from "./division.service";


// Create division
export const createDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionServices.createDivisionService(req.body);

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
  const result = await DivisionServices.getAllDivisionsService();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Divisions retrieved successfully",
    data: result,
  });
});
