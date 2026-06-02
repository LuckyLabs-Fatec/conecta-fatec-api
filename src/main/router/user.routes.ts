import { Router } from "express";

import { UserRole } from "@/domain/models/User";
import { makeAuthController } from "@/main/factories/makeAuthController";
import { ensureRole } from "@/main/middlewares/auth";

const userRoutes = Router();
const authController = makeAuthController();

userRoutes.get("/", ensureRole(UserRole.ADMIN), (req, res) => authController.list(req, res));
userRoutes.patch("/:id", ensureRole(UserRole.ADMIN), (req, res) => authController.patch(req, res));
userRoutes.delete("/:id", ensureRole(UserRole.ADMIN), (req, res) => authController.delete(req, res));

export { userRoutes };
