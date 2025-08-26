import { IUser } from "./user.interface";
import { User } from "./user.model";



const createUserService = async (userData: Partial<IUser>) => {
  const user = await User.create(userData);
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




const updateUserService = async (userId: string, updateData: Partial<IUser>) => {
  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    { 
      new: true, 
      runValidators: true 
    }
  );
  return user;
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