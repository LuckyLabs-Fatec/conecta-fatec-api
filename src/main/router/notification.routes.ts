import { Router } from "express";

import { makeNotificationController } from "@/main/factories/makeNotificationController";

const notificationRoutes = Router();
const notificationController = makeNotificationController();

notificationRoutes.post("/", (req, res) => notificationController.create(req, res));
notificationRoutes.get("/", (req, res) => notificationController.list(req, res));

export { notificationRoutes };
