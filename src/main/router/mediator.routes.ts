import { Router } from "express";
import multer from "multer";

import { UserRole } from "@/domain/models/User";
import { makeMediatorConfigController } from "@/main/factories/makeMediatorConfigController";
import { ensureRole } from "@/main/middlewares/auth";

const mediatorRoutes = Router();
const upload = multer();
const controller = makeMediatorConfigController();

// Admin-only: configure mediator URL via form-data (field `url`)
mediatorRoutes.post(
	"/config",
	ensureRole(UserRole.ADMIN),
	upload.none(),
	(req, res) => controller.setConfig(req, res),
);

// Proxy endpoint: forwards pre-approval request to configured mediator API
mediatorRoutes.post("/pre-approval", ensureRole(UserRole.MEDIATOR), (req, res) =>
	controller.proxyPreApproval(req, res),
);

export { mediatorRoutes };
