import { Router } from "express";

import { UserRole } from "@/domain/models/User";
import { makeFeedbackController } from "@/main/factories/makeFeedbackController";
import { ensureRole } from "@/main/middlewares/auth";

const feedbackRoutes = Router();
const feedbackController = makeFeedbackController();

feedbackRoutes.post("/", ensureRole(UserRole.STUDENT), (req, res) => feedbackController.create(req, res));
feedbackRoutes.get("/", (req, res) => feedbackController.list(req, res));
feedbackRoutes.put("/:id", ensureRole(UserRole.STUDENT), (req, res) => feedbackController.update(req, res));
feedbackRoutes.delete("/:id", ensureRole(UserRole.STUDENT), (req, res) => feedbackController.delete(req, res));

export { feedbackRoutes };
