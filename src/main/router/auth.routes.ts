import { Router } from "express";

import { makeAuthController } from "@/main/factories/makeAuthController";

const authRoutes = Router();
const authController = makeAuthController();

authRoutes.post("/login", (req, res) => authController.login(req, res));
authRoutes.post("/register", (req, res) => authController.register(req, res));

export { authRoutes };
