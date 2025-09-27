import { AppError } from "../../../errors";
import { uploadPDFToCloudinary } from "../../config/cloudinary.config";
import { sendEmail } from "../../config/nodemailer";
import { generatePDF, InvoiceData } from "../../utils/invoiceGenerator";



import { BOOKING_STATUS } from "../booking/booking.interface";
import { BookingModel } from "../booking/booking.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { PaymentModel } from "./payment.model";






export const successPayment = async (query: Record<string, string>) => {
  const session = await BookingModel.startSession();
  session.startTransaction();

  try {

    // 1. Update payment
    const payment = await PaymentModel.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { new: true, runValidators: true, session }
    );
    if (!payment) throw new AppError("Payment record not found");

    // 2. Update booking
    const booking = await BookingModel.findById(payment.booking)
      .populate("user", "name email phone address")
      .populate("tour", "title")
      .session(session);
    if (!booking) throw new AppError("Booking not found");

    booking.status = BOOKING_STATUS.COMPLETE;
    await booking.save({ session });

    // 3. Prepare invoice data
    const invoiceData: InvoiceData = {
      transactionId: payment.transactionId,
      amount: payment.amount,
      bookingId: booking._id.toString(),
      tourTitle: (booking.tour as any)?.title || "N/A",
      guestCount: (booking as any).guestCount || 1,
      date: booking.createdAt as Date,
      user: {
        name: (booking.user as any).name,
        email: (booking.user as any).email,
        phone: (booking.user as any).phone,
        address: (booking.user as any).address,
      },
    };

    // 4. Generate PDF
    const pdfBuffer = await generatePDF(invoiceData);

    // 5. Upload PDF to Cloudinary using separate function
    const uploaded = await uploadPDFToCloudinary(pdfBuffer, payment.transactionId);
    
    payment.invoiceUrl = uploaded.secure_url;
    await payment.save({ session });

    // 6. Send invoice email with EJS template and PDF attachment
    await sendEmail({
      to: invoiceData.user.email,
      subject: `Invoice for Booking ${invoiceData.bookingId}`,
      template: "invoiceTemplate",
      templateData: invoiceData,
      attachments: [
        {
          filename: `invoice-${invoiceData.transactionId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf"
        },
      ],
    });

    // 7. Commit transaction
    await session.commitTransaction();
    session.endSession();

    return { 
      success: true, 
      message: "Payment Successful", 
      invoiceUrl: payment.invoiceUrl 
    };

  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    
    // Log the error for debugging
    console.error("Payment success error:", error);
    
    throw new AppError(
      "Payment success update failed", 
      error?.message || error
    );
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


const getInvoice = async (paymentId: string) => {

  const payment = await PaymentModel.findById(paymentId).lean();

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  if (!payment.invoiceUrl) {
    throw new AppError("Invoice not generated for this payment", 404);
  }

  return {
    paymentId: payment._id,
    transactionId: payment.transactionId,
    invoiceUrl: payment.invoiceUrl,
  };
};


export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  getInvoice,
};







