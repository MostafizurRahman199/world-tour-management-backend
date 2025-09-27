import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post("/success", PaymentController.successPayment);
router.post("/fail", PaymentController.failPayment);
router.post("/cancel", PaymentController.cancelPayment);

router.post("/init-payment/:bookingId", PaymentController.initPayment);

router.get("/invoice/:paymentId", PaymentController.getInvoice);

router.post("/validate-payment", PaymentController.validatePayment);

export const PaymentRouter = router;

