//src/app.ts

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import { errorHandler } from "./middleware";
import notFound from "./middleware/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport";
import { ENV } from "./app/config/env";

const app = express();

// Add middleware
app.use(expressSession({
  secret:"Your Secret",
  resave: false,
  saveUninitialized: false
}))


app.use(passport.initialize());
app.use(passport.session());


app.use(cookieParser());
// after deploy
app.set("trust proxy",1);

const corsOptions = {
  origin: ENV.FRONTEND_URL,
  credentials: true, // This is crucial for cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended:true})); //for form data handle

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the World Tour Management System");
});



// Error handling middleware (should be last)
app.use(errorHandler);
app.use(notFound);



export default app;