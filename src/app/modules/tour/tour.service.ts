import { AppError } from "../../../errors";
import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";


// Create Tour
const createTourService = async (payload: ITour) => {
  const result = await Tour.create(payload);
  return result;
};


// Get All Tours
const getAllToursService = async () => {
    const result = await Tour.find().sort({ createdAt: -1 });
    return result;
};


//update tour
const updateTourService = async(id:string, payload:ITour)=>{
    const result = await Tour.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });
      return result;
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


export const TourServices = {
    createTourService,
    getAllToursService,
    updateTourService,
    deleteTourService
}