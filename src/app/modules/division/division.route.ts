// src/app/modules/division/division.route.ts

import { Router } from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import * as DivisionController from "./division.controller";
import { validateCreateDivision, validateUpdateDivision } from "./division.validation";


const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateCreateDivision,
  DivisionController.createDivision
);

router.patch(
  "/update-division/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateUpdateDivision,
  DivisionController.updateDivision
);

router.delete(
  "/delete-division/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.deleteDivision
);

router.get("/all-divisions", DivisionController.getAllDivisions);

router.get("/single-division/:slug", DivisionController.getSingleDivision);

export const DivisionRouter = router;
