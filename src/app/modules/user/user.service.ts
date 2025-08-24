import UserController from "./user.controller";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUserService = async (userData: Partial<IUser>) => {
    try {
        const user = await User.create(userData);
        return { user };
    } catch (error) {
        throw new Error((error as Error).message);
    }
};






export const UserServices = {
    createUserService,
};