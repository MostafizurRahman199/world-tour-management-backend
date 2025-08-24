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
    data:users,
    meta:{
        total:totalUsers,
    }
  }
};



export const UserServices = {
  createUserService,
  getAllUsersService,
};
