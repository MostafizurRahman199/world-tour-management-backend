

import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRegisterUser, validateUpdateUser } from "./user.validation";

const router = Router();

// Apply validation middleware to routes
router.post("/register", validateRegisterUser, UserController.createUser);
router.get("/all-users", UserController.getAllUsers);

// New routes with validation
router.get("/single-user/:id", UserController.getUserById);
router.put("/update-user/:id", validateUpdateUser, UserController.updateUser);
router.delete("/delete-user/:id", UserController.deleteUser);

export const UserRouter = router;
