import { CustomError } from "../interfaces/error.types";


export function handleCastError(err: CustomError) {
  return {
    statusCode: 400,
    status: "fail",
    message: `Invalid ${err.path}: ${err.value}`,
  };
}
