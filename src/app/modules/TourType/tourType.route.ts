// src/app/modules/division/division.route.ts

import { Router } from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateCreateTourType, validateUpdateTourType } from "./tourType.validation";
import { TourTypeController } from "./tourType.controller";





const router = Router();

router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateCreateTourType,
  TourTypeController.createTourType
);


router.patch(
  "/update-tour-type/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateUpdateTourType,
  TourTypeController.updateTourType
);



router.delete(
  "/delete-tour-type/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourTypeController.deleteTourType
);



router.get("/all-tour-types",
  TourTypeController.getAllTourTypes
);

export const TourTypeRouter = router;
