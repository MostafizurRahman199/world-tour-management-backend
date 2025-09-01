import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../../errors";
import { ENV } from "../../config/env";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { de } from "zod/v4/locales/index.cjs";



const createUserService = async (userData: Partial<IUser>) => {

  const { email, password,  ...rest } = userData;
  
  const isUserExist = await User.findOne({ email });
  
  if (isUserExist) {
    throw new AppError("User already exists", 409); // 409 Conflict status code
  }

  const hashPassword = await bcryptjs.hash(password as string, ENV.BCRYPT_SALT_ROUNDS);
 

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };


  const user = await User.create({
    email,
    password: hashPassword,
    auths: [authProvider],
    ...rest
  });
  
  return user;  // return the created user directly
};




const getAllUsersService = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers,
    }
  }
};





const getUserByIdService = async (userId: string) => {
  const user = await User.findById(userId);
  return user;
};




const updateUserService = async (userId: string, updateData: Partial<IUser>, decodedToken:JwtPayload) => {


  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError("User not found", 404);
  }


  if(updateData.role){
   if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
    throw new AppError("You are not authorized to update user role", 403);
  }

  if(updateData.role === Role.SUPER_ADMIN && decodedToken.role !== Role.SUPER_ADMIN){
    throw new AppError("You are not authorized to update user role to SUPER_ADMIN", 403);
  }
 }


 if(updateData.isActive || updateData.isDeleted || updateData.isVerified){
   if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
     throw new AppError("You are not authorized to update user status", 403);
   }
 }


 if(updateData.password){
    updateData.password = await bcryptjs.hash(updateData.password as string, ENV.BCRYPT_SALT_ROUNDS);
  }


  const newUpdatedUser = await User.findOneAndUpdate(
    { _id: userId },
    updateData,
    { new: true, runValidators: true }
  );

  return newUpdatedUser;
};




const deleteUserService = async (userId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true }
  );
  return user;
};



export const UserServices = {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
};