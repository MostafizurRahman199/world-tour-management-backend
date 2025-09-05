import { ENV } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs"

export const seedSuperAdmin = async ()=>{
    try {
        const existingSuperAdmin = await User.findOne({ email: ENV.SUPER_ADMIN_EMAIL });
        
        if (existingSuperAdmin) {
            console.log("Super Admin already exists:");
            return;
        }

        const hashedPassword = await  bcrypt.hash(ENV.SUPER_ADMIN_PASSWORD, ENV.BCRYPT_SALT_ROUNDS);


        const authProvider: IAuthProvider ={
            provider:"credentials",
            providerId:ENV.SUPER_ADMIN_EMAIL
        }

        const payload :IUser = {
            name: ENV.SUPER_ADMIN_USERNAME,
            email: ENV.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
            auths:[authProvider],
            isVerified: true,
        }


        const superAdmin = await User.create(payload);

        // console.log("Super Admin created:", superAdmin);


    } catch (error) {
        console.error("Error creating Super Admin:", error);
    }
}