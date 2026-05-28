import { Router } from "express";

import { UserRole } from "@/domain/models/User";
import { makeAuthController } from "@/main/factories/makeAuthController";
import { ensureAuthenticated, ensureRole } from "@/main/middlewares/auth";

const authRoutes = Router();
const authController = makeAuthController();

authRoutes.post("/login", (req, res) => authController.login(req, res));
authRoutes.post("/register", (req, res) => authController.register(req, res));
authRoutes.get("/register", ensureRole(UserRole.ADMIN), (req, res) => authController.list(req, res));
authRoutes.put("/register/:id", ensureRole(UserRole.ADMIN), (req, res) => authController.update(req, res));
authRoutes.patch("/register/:id", ensureAuthenticated, (req, res) => authController.patch(req, res));
authRoutes.delete("/register/:id", ensureRole(UserRole.ADMIN), (req, res) => authController.delete(req, res));

export { authRoutes };
