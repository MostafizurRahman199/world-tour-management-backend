//User -> Booking(Pending) -> payment (Unpaid) -> SSL commerce -> Booking update -> confirm -> Payment update = paid 

import { Types } from "mongoose";
import { IUser } from "../user/user.interface";
import { ITour } from "../tour/tour.interface";


export enum BOOKING_STATUS{
    PENDING = "PENDING",
    CANCEL = "CANCEL",
    COMPLETE = "COMPLETE",
    FAILED = "FAILED",
}

export interface IBooking {
    user: Types.ObjectId | IUser,
    tour:Types.ObjectId | ITour,
    payment?:Types.ObjectId,
    guestCount: number,
    status: BOOKING_STATUS, 
    createdAt?:Date
}