import express, { Request, Response } from "express";
import cors from "cors"; // Added cors import

const app = express();

// Add middleware
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the World Tour Management System");
});

export default app;
