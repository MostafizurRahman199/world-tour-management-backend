import { CustomError } from "../interfaces/error.types";


export function handleMongooseValidationError(err: CustomError) {
  return {
    statusCode: 400,
    status: "fail",
    message: "Validation failed",
    details: Object.values(err.errors ?? {}).map((e: any) => e.message),
  };
}