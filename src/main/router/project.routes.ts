import { Router } from "express";

import { makeProjectController } from "@/main/factories/makeProjectController";

const projectRoutes = Router();
const projectController = makeProjectController();

projectRoutes.post("/", (req, res) => projectController.create(req, res));
projectRoutes.get("/", (req, res) => projectController.list(req, res));

export { projectRoutes };
