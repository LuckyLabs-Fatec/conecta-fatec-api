import { Router } from "express";

import { UserRole } from "@/domain/models/User";
import { makeProjectStudentController } from "@/main/factories/makeProjectStudentController";
import { ensureRole } from "@/main/middlewares/auth";

const projectStudentRoutes = Router();
const projectStudentController = makeProjectStudentController();

projectStudentRoutes.post("/", ensureRole(UserRole.STUDENT), (req, res) =>
	projectStudentController.create(req, res),
);
projectStudentRoutes.get("/", ensureRole(UserRole.STUDENT), (req, res) =>
	projectStudentController.list(req, res),
);

export { projectStudentRoutes };
