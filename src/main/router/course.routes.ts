import { Router } from "express";

import { UserRole } from "@/domain/models/User";
import { makeCourseController } from "@/main/factories/makeCourseController";
import { ensureRole } from "@/main/middlewares/auth";

const courseRoutes = Router();
const courseController = makeCourseController();

courseRoutes.post("/", ensureRole(UserRole.MEDIATOR), (req, res) => courseController.create(req, res));
courseRoutes.get("/", ensureRole(UserRole.STUDENT), (req, res) => courseController.list(req, res));

export { courseRoutes };
