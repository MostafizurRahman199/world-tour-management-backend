import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TourTypeServices } from "./tourType.service";


// Create tour
 const createTourType = catchAsync(async (req: Request, res: Response) => {
  const result = await TourTypeServices.createTourTypeService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Tour created successfully",
    data: result,
  });
});



//get all tour types
const getAllTourTypes = catchAsync(async(req:Request, res:Response)=>{

    const result = await TourTypeServices.getAllTourTypesService();
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "All tour types retrieved successfully",
      data: result,
    });
});



//update tourType
const updateTourType = catchAsync(async (req: Request, res: Response) => {
    
    const { id } = req.params;
    const result = await TourTypeServices.updateTourTypeService(id, req.body);
  
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Tour type updated successfully",
        data: result,
        }); 
    });




//delete tourType
const deleteTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TourTypeServices.deleteTourTypeService(id);

    sendResponse(res, {
        success: result.success,
        statusCode: result.success ? 200 : 400,
        message: result.message,
        data: result.data,
    });
});



export const TourTypeController = {
    createTourType,
    getAllTourTypes,
    updateTourType,
    deleteTourType

}