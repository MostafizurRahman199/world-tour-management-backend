import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import { errorHandler } from "./middleware";
import notFound from "./middleware/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport";

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
app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the World Tour Management System");
});



// Error handling middleware (should be last)
app.use(errorHandler);
app.use(notFound);



export default app;