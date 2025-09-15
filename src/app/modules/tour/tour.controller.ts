import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TourServices } from "./tour.service";





// Create tour
 const createTour = catchAsync(async (req: Request, res: Response) => {
  const result = await TourServices.createTourService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Tour created successfully",
    data: result,
  });
});





//get all tours 
 const getAllTour = catchAsync(async(req:Request, res:Response)=>{


  const query = req.query;

    const result = await TourServices.getAllToursService(query as Record<string, string>);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Tours retrieved successfully",
        data: result,
      });
})





//update tourType 
const updateTour = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourServices.updateTourService(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Tour updated successfully",
    data: result,
  });
});




// delete tour 

const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourServices.deleteTourService(id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Tour deleted successfully",
        data: result,
      });
});



// get single tour using slug 

const getSingleTour = catchAsync(async (req: Request, res: Response) => {
 
    const { slug } = req.params;

    const result = await TourServices.getSingleTourService(slug);

    if (!result) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Tour not found",
      });
    }


    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Tour get successfully",
        data: result,
      });
});




export const TourController = {
    createTour,
    getAllTour,
    updateTour,
    deleteTour,
    getSingleTour,
};
