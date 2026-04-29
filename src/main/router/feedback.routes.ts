import { Router } from "express";

import { makeFeedbackController } from "@/main/factories/makeFeedbackController";

const feedbackRoutes = Router();
const feedbackController = makeFeedbackController();

feedbackRoutes.post("/", (req, res) => feedbackController.create(req, res));
feedbackRoutes.get("/", (req, res) => feedbackController.list(req, res));

export { feedbackRoutes };
