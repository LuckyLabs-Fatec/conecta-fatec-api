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
projectStudentRoutes.put("/:id", ensureRole(UserRole.STUDENT), (req, res) =>
	projectStudentController.update(req, res),
);
projectStudentRoutes.delete("/:id", ensureRole(UserRole.STUDENT), (req, res) =>
	projectStudentController.delete(req, res),
);

export { projectStudentRoutes };
