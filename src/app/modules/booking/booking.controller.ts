import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

// Create Booking
const createBooking = catchAsync(async (req: Request, res: Response) => {

const decodedToken = req.user as JwtPayload;

const result = await BookingService.createBookingService(req.body, decodedToken.userId);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Booking created successfully",
    data: result,
  });
});



// Get all bookings
const getAllBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.getAllBookingService();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All bookings fetched successfully",
    data: result,
  });
});



// Get single booking by bookingId
const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const result = await BookingService.getSingleBookingService(bookingId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking fetched successfully",
    data: result,
  });
});



// Get bookings of logged-in user
const getMyBookings = catchAsync(async (req: Request, res: Response) => {

  const decodedToken = req.user as JwtPayload; // assuming req.user added by checkAuth middleware
  const userId = decodedToken.userId;

 
  const result = await BookingService.getBookingsByUserService(userId);
 
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User bookings fetched successfully",
    data: result,
  });


});



// Update booking status
const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const result = await BookingService.updateBookingStatusService(bookingId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking updated successfully",
    data: result,
  });
});



// Delete booking
const deleteBooking = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const result = await BookingService.deleteBookingService(bookingId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking deleted successfully",
    data: result,
  });
});



export const BookingController = {
  createBooking,
  getAllBooking,
  getSingleBooking,
  getMyBookings,
  updateBookingStatus,
  deleteBooking,
  
};
