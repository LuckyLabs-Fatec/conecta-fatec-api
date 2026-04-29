import { Router } from "express";

import { makeCourseController } from "@/main/factories/makeCourseController";

const courseRoutes = Router();
const courseController = makeCourseController();

courseRoutes.post("/", (req, res) => courseController.create(req, res));
courseRoutes.get("/", (req, res) => courseController.list(req, res));

export { courseRoutes };
