// src/app/modules/booking/booking.validation.ts

import { z } from "zod";
import { BOOKING_STATUS } from "./booking.interface";
import { validateRequest } from "../../../middleware/validateRequest";



// ✅ Create Booking Validation Schema
 const createBookingSchema = z.object({
    tour: z.string(),
    guestCount : z.number().int().positive()
});

// ✅ Update Booking Validation Schema
 const updateBookingSchema = z.object({
    status: z.enum(Object.values(BOOKING_STATUS) as [string])
});


export const createBookingValidation = validateRequest(createBookingSchema);
export const updateBookingValidation = validateRequest(updateBookingSchema)
