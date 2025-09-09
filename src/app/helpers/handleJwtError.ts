import { CustomError } from "../interfaces/error.types";


export function handleJwtError(err: CustomError) {
  if (err.name === "TokenExpiredError") {
    return {
      statusCode: 401,
      status: "fail",
      message: "Your session has expired. Please log in again.",
    };
  }
  return {
    statusCode: 401,
    status: "fail",
    message: "Invalid token. Please log in again.",
  };
}