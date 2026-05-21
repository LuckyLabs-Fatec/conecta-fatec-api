import { Router } from "express";

import { UserRole } from "@/domain/models/User";
import { makeNotificationController } from "@/main/factories/makeNotificationController";
import { ensureRole } from "@/main/middlewares/auth";

const notificationRoutes = Router();
const notificationController = makeNotificationController();

notificationRoutes.post("/", ensureRole(UserRole.MEDIATOR), (req, res) => notificationController.create(req, res));
notificationRoutes.get("/", (req, res) => notificationController.list(req, res));

export { notificationRoutes };
