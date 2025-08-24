import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import { errorHandler } from "./middleware";

const app = express();

// Add middleware
app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the World Tour Management System");
});



// Error handling middleware (should be last)
app.use(errorHandler);

export default app;