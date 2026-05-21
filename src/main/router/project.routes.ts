import { Router } from "express";

import { UserRole } from "@/domain/models/User";
import { makeProjectController } from "@/main/factories/makeProjectController";
import { ensureRole } from "@/main/middlewares/auth";

const projectRoutes = Router();
const projectController = makeProjectController();

projectRoutes.post("/", ensureRole(UserRole.MEDIATOR), (req, res) => projectController.create(req, res));
projectRoutes.get("/", ensureRole(UserRole.STUDENT), (req, res) => projectController.list(req, res));

export { projectRoutes };
