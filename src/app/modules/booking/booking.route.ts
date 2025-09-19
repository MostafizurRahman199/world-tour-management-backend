// src/app/modules/division/division.route.ts

import { Router } from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { BookingController } from "./booking.controller";
import { updateBookingValidation as validateUpdateBooking , createBookingValidation  as validateCreateBooking} from "./booking.validation";




const router = Router();


router.post(
  "/create",
  checkAuth(...Object.values(Role)),
  validateCreateBooking,
  BookingController.createBooking
);


router.get(
  "/all-bookings",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  BookingController.getAllBooking
);



router.get(
    "/my-Bookings",
    checkAuth(...Object.values(Role)),
    BookingController.getMyBookings
);


router.get(
  "/:bookingId",
  checkAuth(...Object.values(Role)),
  BookingController.getSingleBooking
);


router.patch(
  "/update-status/:bookingId",
  checkAuth(...Object.values(Role)),
  validateUpdateBooking,
  BookingController.updateBookingStatus
);


router.delete(
  "/delete/:bookingId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  BookingController.deleteBooking
);


export const BookingRouter = router;
