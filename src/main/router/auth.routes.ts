import { Router } from "express";

import { makeAuthController } from "@/main/factories/makeAuthController";

const authRoutes = Router();
const authController = makeAuthController();

authRoutes.post("/login", (req, res) => authController.login(req, res));
authRoutes.post("/register", (req, res) => authController.register(req, res));
authRoutes.put("/register/:id", (req, res) => authController.update(req, res));
authRoutes.patch("/register/:id", (req, res) => authController.patch(req, res));
authRoutes.delete("/register/:id", (req, res) => authController.delete(req, res));

export { authRoutes };
