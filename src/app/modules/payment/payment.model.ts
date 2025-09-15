

// src/app/modules/payment/payment.model.ts

import { Schema, model } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";



const paymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking", // Make sure you have a Booking model
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate transactions
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentGatewayData: {
      type: Schema.Types.Mixed, // Flexible for storing any data
      default: {},
    },
    invoiceUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
    versionKey: false,
  }
);

export const PaymentModel = model<IPayment>("Payment", paymentSchema);
