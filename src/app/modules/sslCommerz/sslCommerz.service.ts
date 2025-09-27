import qs from "qs";
import axios from "axios";
import { ISSLCommerz } from "./sslCommerz.interface";
import { ENV } from "../../config/env";
import { AppError } from "../../../errors";
import { PaymentModel } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";




const sslPaymentInit = async (payload: ISSLCommerz) => {
  const data = {
    store_id: ENV.SSL_STORE_ID,
    store_passwd: ENV.SSL_STORE_PASSWORD,

    total_amount: payload.amount,
    currency: "BDT",
    tran_id: payload.transactionId,

    success_url: `${ENV.SSL_BACKEND_SUCCESS_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,

    fail_url: `${ENV.SSL_BACKEND_FAIL_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,

    cancel_url: `${ENV.SSL_BACKEND_CANCEL_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,

    ipn_url:ENV.SSL_IPN_URL,

    emi_option: 0,
    cus_name: payload.name,
    cus_email: payload.email,
    cus_add1: payload.address,
    cus_phone: payload.phone,

    cus_add2: "N/A",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    product_name: "Tour",
    product_category: "Service",
    product_profile: "general",

    cus_fax: "017111111",
    shipping_method: "N/A",
    ship_name: "N/A",
    ship_add1: "N/A",
    ship_add2: "N/A",
    ship_city: "N/A",
    ship_state: "N/A",
    ship_postcode: 1000,
    ship_country: "N/A",
  };

  try {
    const response = await axios.post(ENV.SSL_PAYMENT_API, qs.stringify(data), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data; // contains GatewayPageURL etc.
  } catch (error: any) {
    throw new AppError(
      `SSLCommerz Init Failed: ${error.response?.data || error.message}`
    );
  }
};




 const validatePayment = async (payload: any) => {
  try {

    const response = await axios.get(ENV.SSL_VALIDATION_API, {
      params: {
        val_id: payload.val_id,
        store_id: ENV.SSL_STORE_ID,
        store_passwd: ENV.SSL_STORE_PASSWORD, 
      },
    });

    const gatewayResponse = response.data;

    // Update payment record
    await PaymentModel.updateOne(
      { transactionId: payload.tran_id },
      {
        paymentGatewayData: gatewayResponse,
        status: gatewayResponse.status === "VALID" ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.FAILED,
      },
      { runValidators: true }
    );

    return gatewayResponse; // return data if caller needs it
  } catch (error: any) {
    console.error("Payment validation failed:", error.message);
    throw new Error("Payment validation failed");
  }
};



export const SSLService = {
  sslPaymentInit,
  validatePayment
};
