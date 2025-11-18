import { z } from "zod";
import { validateRequest } from "../../../middleware/validateRequest";

export const applyGuideSchema = z.object({
  divisionId: z.string().nonempty(),
});

export const approveGuideSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

export const applyGuideValidation = validateRequest(applyGuideSchema);
export const approveGuideValidation = validateRequest(approveGuideSchema);
