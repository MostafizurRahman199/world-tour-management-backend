import { Router } from "express";
import * as GuideController from "./guide.controller";

import { applyGuideValidation, approveGuideValidation } from "./guide.validation";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../../middleware/checkAuth";

const router = Router();


router.post(
  "/apply",
  checkAuth(Role.USER),
  multerUpload.single("file"),
  applyGuideValidation,
  GuideController.applyGuide
);

router.patch(
  "approve/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  approveGuideValidation,
  GuideController.approveGuide
);

router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), GuideController.getApplications);
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), GuideController.getSingleApplication);

export const GuideRouter = router;
