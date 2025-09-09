import { ZodError } from "zod";

export function handleZodError(err: ZodError) {
  return {
    statusCode: 400,
    status: "fail",
    message: "Validation failed",
    details: err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  };
}
