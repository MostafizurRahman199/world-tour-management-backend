import { AppError } from "../../../errors";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { PaymentModel } from "../payment/payment.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { BookingModel } from "./booking.model";




const getTransactionId = ()=>{
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}





// // Create booking
// const createBookingService = async (payload:Partial<IBooking>, userId:string) => {

//     const transactionId = getTransactionId();
  
//     const session = await BookingModel.startSession();
//     session.startTransaction();

//     try {
      
//         const user = await User.findById(userId, session);

//         if(!user?.phone || !user.address){
//             throw new AppError("Please update your profile")
//         }

//         const tour = await Tour.findById(payload.tour, session).select("costFrom");

//         if(!tour?.costFrom){
//             throw new AppError("No tour cost found");
//         }


//         const amount = Number(tour.costFrom) * Number(payload.guestCount!) ;

//         const booking = await BookingModel.create([{
//             user:userId,
//             status : BOOKING_STATUS.PENDING,
//             ...payload
//         }] , {session : session})


//         const payment =  await PaymentModel.create([{
//             booking : booking[0]._id,
//             status : PAYMENT_STATUS.UNPAID,
//             transactionId: transactionId,
//             amount:amount
//         }], {session : session})

//         const updatedBooking = await BookingModel.findByIdAndUpdate(
//             booking[0]._id, 
//             {payment : payment[0]._id},
//             {new:true, runValidators:true, session:session}
        
//         ).populate("user", "name email phone address")
//         .populate("tour", "title costForm")
//         .populate("payment")


        


//         await session.commitTransaction(); //transaction
//         session.endSession();

//         return updatedBooking;

//     } catch (error:any) {
//         await session.abortTransaction(); //rollback
//         session.endSession();
//         throw error;
//     }

// };



// Create booking
const createBookingService = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();
  const session = await BookingModel.startSession();
  session.startTransaction();

  try {
    // 1. Find user
    const user = await User.findById(userId, null, { session });
    if (!user?.phone || !user.address) {
      throw new AppError("Please update your profile before booking");
    }

    // 2. Find tour
    const tour = await Tour.findById(payload.tour, null, { session }).select("costFrom");
    if (!tour?.costFrom) {
      throw new AppError("No tour cost found");
    }

    // 3. Calculate total amount
    const amount = Number(tour.costFrom) * Number(payload.guestCount!);

    // 4. Create booking
    const [booking] = await BookingModel.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );

    // 5. Create payment
    const [payment] = await PaymentModel.create(
      [
        {
          booking: booking._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId,
          amount,
        },
      ],
      { session }
    );

    // 6. Link payment with booking
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      booking._id,
      { $set: { payment: payment._id } },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment")
      .lean();;

    if (!updatedBooking) {
      throw new AppError("Booking update failed");
    }

    // 7. Initialize SSLCommerz payment
    const sslPayment = await SSLService.sslPaymentInit({
      amount,
      transactionId,
      name: (updatedBooking.user as any).name,
      email: (updatedBooking.user as any).email,
      phone: (updatedBooking.user as any).phone,
      address: (updatedBooking.user as any).address,
    });


    // 8. Commit transaction
    await session.commitTransaction();

    return {
      booking: updatedBooking,
      paymentUrl: sslPayment.GatewayPageURL, // frontend should redirect to this
    };

    
  } catch (error: any) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};



// SSL commerz payment
//frontend -> user - tour - Book - Payment(unpaid) -> SSL Commerz Page -> Payment Complete -> Backend -> API -> Update payment(paid) and Booking(confirmed) -> Redirect to frontend -> User Frontend (payment success page)

//frontend -> user - tour - Book - Payment(unpaid) -> SSL Commerz Page -> Payment Complete -> Backend -> API -> Update payment(fail/cancel) and Booking(fail/cancel) -> Redirect to frontend -> User Frontend (payment failure/cancel page)



// Get all bookings
const getAllBookingService = async () => {
  return await BookingModel.find({})
    .populate("user")
    .populate("tour")
    .populate("payment");
};

// Get single booking by ID
const getSingleBookingService = async (bookingId: string) => {
  return await BookingModel.findById(bookingId)
    .populate("user")
    .populate("tour")
    .populate("payment");
};

// Get bookings of a specific user
const getBookingsByUserService = async (userId: string) => {
  return await BookingModel.find({ user: userId })
    .populate("tour")
    .populate("payment");
};

// Update booking
const updateBookingService = async (bookingId: string, payload: Partial<IBooking>) => {
  return await BookingModel.findByIdAndUpdate(bookingId, payload, {
    new: true,
    runValidators: true,
  });
};

// Delete booking
const deleteBookingService = async (bookingId: string) => {
  return await BookingModel.findByIdAndDelete(bookingId);
};

export const BookingService = {
  createBookingService,
  getAllBookingService,
  getSingleBookingService,
  getBookingsByUserService,
  updateBookingService,
  deleteBookingService,
};
