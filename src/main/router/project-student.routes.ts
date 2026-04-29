import { Router } from "express";

import { makeProjectStudentController } from "@/main/factories/makeProjectStudentController";

const projectStudentRoutes = Router();
const projectStudentController = makeProjectStudentController();

projectStudentRoutes.post("/", (req, res) => projectStudentController.create(req, res));
projectStudentRoutes.get("/", (req, res) => projectStudentController.list(req, res));

export { projectStudentRoutes };
