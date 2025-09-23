import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TourServices } from "./tour.service";
import { ITour } from "./tour.interface";





// // Create tour
//  const createTour = catchAsync(async (req: Request, res: Response) => {
//   const result = await TourServices.createTourService(req.body);

//   sendResponse(res, {
//     success: true,
//     statusCode: 201,
//     message: "Tour created successfully",
//     data: result,
//   });
// });



const createTour = catchAsync(async (req: Request, res: Response) => {
  // Multer files info
  const images = (req.files as Express.Multer.File[])?.map(file => file.path) || [];

  const payload = {
    ...req.body,
    images, // array of Cloudinary URLs
  };

  const result = await TourServices.createTourService(payload);

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





// //update tourType  controller
// const updateTour = catchAsync(async (req: Request, res: Response) => {

//   const { id } = req.params;


//     // Multer files info
//   const images = (req.files as Express.Multer.File[])?.map(file => file.path) || [];

//   const payload = {
//     ...req.body,
//     images, // array of Cloudinary URLs
//   };

//   const result = await TourServices.updateTourService(id, payload);

//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "Tour updated successfully",
//     data: result,
//   });
// });




// delete tour 



// const updateTour = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;

//   // Multer → new uploaded images (Cloudinary URLs)
//   const newImages = (req.files as Express.Multer.File[])?.map(file => file.path) || [];

//   // Parse text inputs properly
//   const payload = {
//     ...req.body,
//     newImages,
//     imagesToDelete: req.body.imagesToDelete ? JSON.parse(req.body.imagesToDelete) : [],
//     clearImages: req.body.clearImages === "true", // convert "true"/"false" string to boolean
//   };




//   const result = await TourServices.updateTourService(id, payload);

//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "Tour updated successfully",
//     data: result,
//   });
// });

const updateTour = catchAsync(async (req: Request, res: Response) => {
  
  const { id } = req.params;

const newImages = (req.files as Express.Multer.File[])?.map(file => file.path) || [];

  const payload = {
    ...req.body, 
    newImages: newImages,
  };

  console.log(payload);

  const result = await TourServices.updateTourService(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Tour updated successfully",
    data: result,
  });
});







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
