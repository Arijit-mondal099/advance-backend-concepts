import { Router } from "express";
import { generateAccessToekn, logout, me, signin, signup } from "../controllers/auth.controller";
import { authValidation } from "../middlewares/auth.middleare";
import { requireCsrf } from "../middlewares/csrf.middleware";
import { validateBody } from "../utils/helpers";
import { signinSchema, signupSchema } from "../schemas/auth";

const router = Router();

router.post("/sign-up", validateBody(signupSchema), signup);
router.post("/sign-in", validateBody(signinSchema), signin);
router.get( "/me",      authValidation, me);
router.post("/logout",  requireCsrf, authValidation, logout);
router.post("/refresh", requireCsrf, generateAccessToekn);

export default router;
