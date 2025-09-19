
import { CustomError } from "../interfaces/error.types";


export function handleDuplicateKeyError(err: CustomError) {
  const field = Object.keys(err.keyValue || {})[0];
  const value = err.keyValue?.[field];

  return {
    statusCode: 409,
    status: "fail",
    message: "Duplicate field value entered",
    details: [
      {
        field,
        value,
        suggestion: `Try a different ${field}`,
      },
    ],
  };
}
