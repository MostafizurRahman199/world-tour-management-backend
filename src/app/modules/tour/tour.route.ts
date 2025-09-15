// src/app/modules/division/division.route.ts

import { Router } from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { TourController } from "./tour.controller";
import { validateCreateTour, validateUpdateTour } from "./tour.validation";



const router = Router();

router.post(
  "/create-tour",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateCreateTour,
  TourController.createTour
);

router.patch(
  "/update-tour/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateUpdateTour,
  TourController.updateTour
);

router.delete(
  "/delete-tour/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTour
);

router.get("/all-tours", TourController.getAllTour);

router.get("/single-tour/:slug", TourController.getSingleTour);

export const TourRouter = router;
