import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { JwtHeader } from "jsonwebtoken";



// Create user
const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createUserService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User created successfully",
    data: result,
  });
});




// Get all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {

  const query = req.query;

  const result = await UserServices.getAllUsersService(query as Record<string, string>);

  sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User retrieved successfully",
        data: result,
      });


});





// Get user by ID
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.getUserByIdService(id);

  if (!result) {
    return sendResponse(res, {
      success: false,
      statusCode: 404,
      message: "User not found",
      data: null,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User retrieved successfully",
    data: result,
  });
});





// Update user
const updateUser = catchAsync(async (req: Request, res: Response) => {

  const { id } = req.params;

  // const token = req.headers.authorization;
  // const decodedToken = verifyToken(token as string);

  const decodedToken = req.user;

  const result = await UserServices.updateUserService(id, req.body, decodedToken as JwtHeader);

  if (!result) {
    return sendResponse(res, {
      success: false,
      statusCode: 404,
      message: "User not found",
      data: null,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User updated successfully",
    data: result,
  });
});






// Delete user (soft delete)
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.deleteUserService(id);

  if (!result) {
    return sendResponse(res, {
      success: false,
      statusCode: 404,
      message: "User not found",
      data: null,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};