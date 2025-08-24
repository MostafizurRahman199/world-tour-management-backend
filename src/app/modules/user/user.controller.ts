import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import { UserServices } from "./user.service";
import { AppError } from "../../../errors";



const createUser = async (req:Request, res:Response, next: NextFunction) => {
    try {

        // return next(new AppError("User creation failed", 400));
        const user = await UserServices.createUserService(req.body);
        res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        next(error);
    }
};



const UserController = {
    createUser,
};

export default UserController;
