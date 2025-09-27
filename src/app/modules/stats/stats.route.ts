import express from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";


const router = express.Router();

router.get(
  "/dashboard",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getDashboardStats
);

export const statsRouter = router;
