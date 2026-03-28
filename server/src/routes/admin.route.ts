import { Router } from "express";
import { requireCsrf } from "../middlewares/csrf.middleware";
import { authValidation, roleValidation } from "../middlewares/auth.middleare";
import { allUsers } from "../controllers/admin.controller";

const router = Router();

router.get("/users", requireCsrf, authValidation, roleValidation(["admin"]), allUsers)

export default router;
