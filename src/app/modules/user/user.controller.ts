import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";



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
  const result = await UserServices.getAllUsersService();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta,
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
  const result = await UserServices.updateUserService(id, req.body);

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