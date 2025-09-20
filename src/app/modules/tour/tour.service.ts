import { AppError } from "../../../errors";
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
  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new Error("Tour title already exists");
  }

  const result = await Tour.create(payload);
  return result;
};





// const getAllToursService = async (query: Record<string, any>) => {
//   let {
//     page = 1,
//     limit = 10,
//     sort = "-createdAt",
//     fields,
//     search,
//     ...filters
//   } = query;

//   page = Number(page);
//   limit = Number(limit);
//   const skip = (page - 1) * limit;

//   // Build search query (only if search exists)
//   const searchQuery = search
//     ? {
//         $or: TOUR_SEARCHABLE_FIELDS.map((field) => ({
//           [field]: { $regex: search, $options: "i" },
//         })),
//       }
//     : {};

//   // Convert filters (case-insensitive for strings)
//   const processedFilters = Object.fromEntries(
//     Object.entries(filters).map(([key, value]) => [
//       key,
//       typeof value === "string" ? { $regex: value, $options: "i" } : value,
//     ])
//   );

//   // Final query object
//   const queryObj = { ...searchQuery, ...processedFilters };

//   // Count + Query in parallel (faster)
//   const [total, tours] = await Promise.all([
//     Tour.countDocuments(queryObj),
//     Tour.find(queryObj)
//       .sort(sort)
//       .select(fields ? fields.split(",").join(" ") : "")
//       .skip(skip)
//       .limit(limit),
//   ]);

//   return {
//     meta: {
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     },
//     data: tours,
//   };
// };




const getAllToursService = async (query: Record<string, any>) => {

  const tourQueryBuilderObj = new QueryBuilder(Tour, query);
  const tours = await tourQueryBuilderObj.execute(TOUR_SEARCHABLE_FIELDS);

  return {
    tours,
  };
};





// Update Tour
const updateTourService = async (id: string, payload: ITour) => {
  // 1. Check if tour exists
  const existingTour = await Tour.findById(id);
  if (!existingTour) {
    throw new Error("Tour not found");
  }

  // 2. Check for duplicate title (excluding current tour)
  if (payload.title) {
    const duplicate = await Tour.findOne({
      title: payload.title,
      _id: { $ne: id }, // exclude current tour
    });

    if (duplicate) {
      throw new Error("Tour title already exists");
    }
  }

  // 3. Update tour
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
