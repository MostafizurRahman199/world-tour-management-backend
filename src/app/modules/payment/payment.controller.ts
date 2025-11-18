// src/modules/payment/controller
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import { ENV } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";
import { SSLService } from "../sslCommerz/sslCommerz.service";




const successPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const result = await PaymentService.successPayment(query);

  const redirectUrl = `${ENV.SSL_FRONTEND_SUCCESS_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=success&message=${result.message}`;

  if (result.success) {
    return res.redirect(redirectUrl);
  }
  res.redirect(`${ENV.SSL_FRONTEND_FAIL_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=fail`);
});





const initPayment = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  const result = await PaymentService.initPayment(bookingId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment initialized successfully",
    data: result, // Contains GatewayPageURL for frontend redirect
  });
});




const failPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const result = await PaymentService.failPayment(query);

  const redirectUrl = `${ENV.SSL_FRONTEND_FAIL_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=fail&message=${result.message}`;

  return res.redirect(redirectUrl);
});





const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const result = await PaymentService.cancelPayment(query);

  const redirectUrl = `${ENV.SSL_FRONTEND_CANCEL_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=cancel&message=${result.message}`;

  if (result.success) {
    return res.redirect(redirectUrl);
  }
  res.redirect(`${ENV.SSL_FRONTEND_FAIL_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=fail`);
});




const getInvoice = catchAsync(async (req: Request, res: Response) => {
  const { paymentId } = req.params;
  const result = await PaymentService.getInvoice(paymentId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Invoice retrieved successfully",
    data: result,
  });
});




const validatePayment = catchAsync(async (req: Request, res: Response) => {
  
  const payload = req.body; // ✅ SSLCommerz will send val_id, tran_id, etc.

  const result = await SSLService.validatePayment(payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment validated successfully",
    data: result,
  });
});


export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  getInvoice,
  validatePayment,
};







