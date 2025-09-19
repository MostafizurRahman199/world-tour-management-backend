import { Types } from "mongoose";
import { AppError } from "../../../errors";
import { Tour } from "../tour/tour.model";
import { TourType } from "./tourType.model";



const createTourTypeService = async (tourType: { name: string }) => {
  // Check if the tour type already exists
  const existingTourType = await TourType.findOne({ name: tourType.name });
  if (existingTourType) {
    throw new AppError("Tour type already exists", 409); // 409 Conflict status code
  }

  const newTourType = new TourType(tourType);
  await newTourType.save();

  return newTourType;
};


const getAllTourTypesService = async () => {
    const tourTypes = await TourType.find().sort({ createdAt: -1 });
    return tourTypes;
}


const updateTourTypeService = async(id:string, payload:{name:string})=>{
    const result = await TourType.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });
      return result;
}



const deleteTourTypeService = async (id: string) => {
  // 1. Check if this tourType is used in any Tour
  const isUsed = await Tour.findOne({ tourType: new Types.ObjectId(id) });

  if (isUsed) {
    return {
      success: false,
      message: "Cannot delete: This tour type is linked with existing tours.",
      data: null,
    };
  }

  // 2. Delete the tourType if not used
  const result = await TourType.findByIdAndDelete(id);

  if (!result) {
    return {
      success: false,
      message: "Tour type not found or already deleted.",
      data: null,
    };
  }

  return {
    success: true,
    message: "Tour type deleted successfully.",
    data: result,
  };
};



export const TourTypeServices = {
    createTourTypeService,
    getAllTourTypesService,
    updateTourTypeService,
    deleteTourTypeService
};