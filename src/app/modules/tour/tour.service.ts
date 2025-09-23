import { AppError } from "../../../errors";
import mongoose from "mongoose";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import { makeSlug } from "../../utils/makeSlug";
import QueryBuilder from "../../utils/queryBuilder";
import { TOUR_SEARCHABLE_FIELDS } from "./tour.constant";
import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";




// // Create Tour
// const createTourService = async (payload: ITour) => {
//   // 1. Check for duplicate title
//   const existingTour = await Tour.findOne({ title: payload.title });
//   if (existingTour) {
//     throw new Error("Tour title already exists");
//   }

//   // 2. Create new tour with slug
//   const result = await Tour.create(payload);

//   return result;
// };



// create tour service
const createTourService = async (payload: ITour) => {
  
  // throw new Error("Tour title already exists");

  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new Error("Tour title already exists");
  }

  const result = await Tour.create(payload);
  return result;
};








const getAllToursService = async (query: Record<string, any>) => {

  const tourQueryBuilderObj = new QueryBuilder(Tour, query);
  const tours = await tourQueryBuilderObj.execute(TOUR_SEARCHABLE_FIELDS);

  return {
    tours,
  };
};





// // Update Tour service
// const updateTourService = async (id: string, payload: ITour) => {
//   // 1. Check if tour exists
//   const existingTour = await Tour.findById(id);
//   if (!existingTour) {
//     throw new Error("Tour not found");
//   }

//   // 2. Check for duplicate title (excluding current tour)
//   if (payload.title) {
//     const duplicate = await Tour.findOne({
//       title: payload.title,
//       _id: { $ne: id }, // exclude current tour
//     });

//     if (duplicate) {
//       throw new Error("Tour title already exists");
//     }
//   }

//   // 3. Update tour
//   const result = await Tour.findByIdAndUpdate(id, payload, {
//     new: true,
//     runValidators: true,
//   });

//   return result;
// };








export const updateTourService = async (id: string, payload: Partial<ITour>) => {
 
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Check if tour exists
    const existingTour = await Tour.findById(id).session(session);

    if (!existingTour) {
      throw new Error("Tour not found");
    }

    // 2. Check for duplicate title
    if (payload.title) {
      const duplicate = await Tour.findOne({
        title: payload.title,
        _id: { $ne: id },
      }).session(session);

      if (duplicate) {
        throw new Error("Tour title already exists");
      }
    }

    let updatedImages: string[] = [];

    if(existingTour.images && existingTour.images.length){

      updatedImages = [...existingTour.images]; // start with current images
    }
    // 🖼️ Image handling logic

    // Case 5: Clear all images
    if (payload.clearImages && existingTour.images?.length) {
      for (const img of existingTour.images) {
        await deleteImageFromCLoudinary(img);
      }
      updatedImages = [];
    }


    // Case 3: Remove selected images
    if (payload.imagesToDelete && payload.imagesToDelete.length > 0) {
      for (const img of payload.imagesToDelete) {
        if (updatedImages.includes(img)) {
          await deleteImageFromCLoudinary(img);
          updatedImages = updatedImages.filter(i => i !== img);
        }
      }
    }

    
    // Case 1: Add new images
    if (payload.newImages && payload.newImages.length > 0) {
      updatedImages = [...updatedImages, ...payload.newImages];
    }


    // Case 2: Replace all images (clear old + set new)
    if (payload.newImages && payload.clearImages) {
      // already handled above: clear + then add new
      updatedImages = [...payload.newImages];
    }


    // 4. Update tour with final images array
    const result = await Tour.findByIdAndUpdate(
      id,
      { ...payload, images: updatedImages },
      { new: true, runValidators: true, session }
    );

    // ✅ Commit transaction
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    // ❌ Rollback
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};





// Delete Tour
const deleteTourService = async (id: string) => {
  // #todo
  // Check if the tour has bookings or related data that prevent deletion.

  // const hasBookings = await Booking.exists({ tour: id });
  // if (hasBookings) {
  //   throw new AppError("Tour has bookings and cannot be deleted", 400);
  // }

  const result = await Tour.findByIdAndDelete(id);
  return result;
};


const getSingleTourService = async (slug: string) => {
  const result = await Tour.findOne({ slug }); 
  return result;
};



export const TourServices = {
  createTourService,
  getAllToursService,
  updateTourService,
  deleteTourService,
  getSingleTourService,
};
