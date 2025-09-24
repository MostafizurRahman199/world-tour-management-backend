

import { NextFunction,  Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { validateRegisterUser, validateUpdateUser } from "./user.validation";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "./user.interface";

const router = Router();



// Apply validation middleware to routes
router.post("/register", validateRegisterUser, UserController.createUser);
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserController.getAllUsers);
router.get("/me", checkAuth(...Object.values(Role)), UserController.getMe);




// New routes with validation
router.get("/single-user/:id", UserController.getUserById);
router.put("/update-user/:id",checkAuth(...Object.values(Role)), validateUpdateUser, UserController.updateUser);
router.delete("/delete-user/:id", UserController.deleteUser);

export const UserRouter = router;
