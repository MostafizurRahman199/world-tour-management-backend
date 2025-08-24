//src/server.ts
/* eslint-disable no-console */


import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import {ENV} from "./app/config/env";


let server: Server;


const startServer = async () => {
   try {
       await mongoose.connect(ENV.DB_URI);

       console.log("Connected to MongoDB");

       server = app.listen(ENV.PORT, () => {
           console.log(`Server is running on port ${ENV.PORT}`);
       });
       
   } catch (error) {
       console.error("Error connecting to MongoDB:", error);
   }
}






process.on("unhandledRejection", (error) => {
   console.error("Unhandled Rejection:", error);

   if (server) {
       server.close(() => {
           process.exit(1);
       });
   } else {
       process.exit(1);
   }
});





// server local problem
process.on("uncaughtException", (error) => {
   console.error("Uncaught Exception:", error);

   if (server) {
       server.close(() => {
           process.exit(1);
       });
   } else {
       process.exit(1);
   }
});





process.on("SIGTERM", () => {
   console.log("SIGTERM received");
   if (server) {
       server.close(() => {
           process.exit(0);
       });
   } else {
       process.exit(0);
   }
});



startServer();

