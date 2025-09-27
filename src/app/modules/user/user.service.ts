import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../../errors";
import { ENV } from "../../config/env";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { de } from "zod/v4/locales/index.cjs";
import QueryBuilder from "../../utils/queryBuilder";
import { USER_SEARCHABLE_FIELDS } from "./user.constant";



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




const getAllUsersService = async (query: Record<string, any>) => {

  const userQueryBuilderObj = new QueryBuilder(User, query);
  const users = await userQueryBuilderObj.execute(USER_SEARCHABLE_FIELDS);

  return {
    users
  }
};




const getMe = async (userId:string) => {

  const  user = await User.findById(userId).select("-password");

  if(!user){
    throw new AppError("User not found")
  }


  return {
   data : user
  }
};





const getUserByIdService = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return user;
};




// const updateUserService = async (
//   userId: string, 
//   updateData: Partial<IUser>,
//   decodedToken:JwtPayload
// ) => {

//   if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
//     if(decodedToken.userId !== userId){
//       throw new AppError("You are not Authorized to update this account");
//     }
//   }


//   const isUserExist = await User.findById(userId);
//   if (!isUserExist) {
//     throw new AppError("User not found", 404);
//   }
  
//   if(decodedToken.role === Role.ADMIN && isUserExist.role === Role.SUPER_ADMIN){
//       throw new AppError("You are not Authorized to update this account");
//   }



//   if(updateData.role){
//    if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
//     throw new AppError("You are not authorized to update user role", 403);
//   }

//   if(updateData.role === Role.SUPER_ADMIN && decodedToken.role !== Role.SUPER_ADMIN){
//     throw new AppError("You are not authorized to update user role to SUPER_ADMIN", 403);
//   }
//  }


//  if(updateData.isActive || updateData.isDeleted || updateData.isVerified){
//    if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
//      throw new AppError("You are not authorized to update user status", 403);
//    }
//  }



//   const newUpdatedUser = await User.findOneAndUpdate(
//     { _id: userId },
//     updateData,
//     { new: true, runValidators: true }
//   );

//   return newUpdatedUser;
// };


const updateUserService = async (
  userId: string,
  updateData: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  
  const { role: requesterRole, userId: requesterId } = decodedToken;

  // 1. Prevent USER or GUIDE from updating other accounts
  if ((requesterRole === Role.USER || requesterRole === Role.GUIDE) && requesterId !== userId) {
    throw new AppError("You are not authorized to update this account", 403);
  }

  // 2. Check if target user exists
  const targetUser = await User.findById(userId);
  if (!targetUser) {
    throw new AppError("User not found", 404);
  }

  // 3. Prevent ADMIN from updating SUPER_ADMIN
  if (requesterRole === Role.ADMIN && targetUser.role === Role.SUPER_ADMIN) {
    throw new AppError("You are not authorized to update this account", 403);
  }

  // 4. Restrict role updates
  if (updateData.role) {
    if (requesterRole === Role.USER || requesterRole === Role.GUIDE) {
      throw new AppError("You are not authorized to update user role", 403);
    }
    if (updateData.role === Role.SUPER_ADMIN && requesterRole !== Role.SUPER_ADMIN) {
      throw new AppError("You are not authorized to assign SUPER_ADMIN role", 403);
    }
  }

  // 5. Restrict sensitive status updates
  const restrictedStatusFields: (keyof IUser)[] = ["isActive", "isDeleted", "isVerified"];
  if (
    restrictedStatusFields.some((field) => updateData[field] !== undefined) &&
    (requesterRole === Role.USER || requesterRole === Role.GUIDE)
  ) {
    throw new AppError("You are not authorized to update user status", 403);
  }

  // 6. Update and return the new user
  return User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
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
  getMe,
};