import { AppError } from "../../../errors";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { BookingModel } from "../booking/booking.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { PaymentModel } from "./payment.model";




const successPayment = async (query: Record<string, string>) => {
  const session = await BookingModel.startSession();
  session.startTransaction();

  try {
    // Update Payment
    const updatedPayment = await PaymentModel.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { new: true, runValidators: true, session }
    );

    if (!updatedPayment) throw new AppError("Payment record not found");

    // Update Booking
    await BookingModel.findOneAndUpdate(
      updatedPayment.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: true, message:"Payment Successful" };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError("Payment success update failed", error);
  }
};




const initPayment = async (bookingId: string) => {
    
  // 1. Find booking
  const booking = await BookingModel.findById(bookingId)
    .populate("user", "name email phone address")
    .lean();

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  // 2. Find payment record
  let payment = await PaymentModel.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError("Payment not found for this booking", 404);
  }

  // 3. Reset status if previously cancelled or failed
  if (payment.status === PAYMENT_STATUS.CANCELED || payment.status === PAYMENT_STATUS.FAILED) {
    payment.status = PAYMENT_STATUS.UNPAID;
    await payment.save();
  }

  // 4. Prepare SSLCommerz payload
  const transactionId = payment.transactionId; // reuse same transactionId
  const amount = payment.amount;

  const sslPayment = await SSLService.sslPaymentInit({
    amount,
    transactionId,
    name: (booking.user as any).name,
    email: (booking.user as any).email,
    phone: (booking.user as any).phone,
    address: (booking.user as any).address,
  });

  // 5. Return Gateway URL for frontend
  return {
    booking,
    paymentUrl: sslPayment.GatewayPageURL,
  };
};






const failPayment = async (query: Record<string, string>) => {
  const session = await BookingModel.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await PaymentModel.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { new: true, runValidators: true, session }
    );

    if (updatedPayment?.booking) {
      await BookingModel.findOneAndUpdate(
        updatedPayment.booking,
        { status: BOOKING_STATUS.FAILED },
        { new: true, runValidators: true, session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return { success: true, message:"Payment Failed" };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError("Payment fail update failed", error);
  }
};




const cancelPayment = async (query: Record<string, string>) => {
  const session = await BookingModel.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await PaymentModel.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.CANCELED },
      { new: true, runValidators: true, session }
    );

    if (updatedPayment?.booking) {
      await BookingModel.findOneAndUpdate(
        updatedPayment.booking,
        { status: BOOKING_STATUS.CANCEL },
        { new: true, runValidators: true, session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return { success: true, message:"Payment Cancelled" };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError("Payment cancel update failed", error);
  }
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};
