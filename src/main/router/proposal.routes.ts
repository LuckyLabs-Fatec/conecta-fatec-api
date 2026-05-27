import { Router } from "express";

import { UserRole } from "@/domain/models/User";
import { makeProposalController } from "@/main/factories/makeProposalController";
import { ensureAuthenticated, ensureRole } from "@/main/middlewares/auth";

const proposalRoutes = Router();
const proposalController = makeProposalController();

proposalRoutes.post("/", ensureAuthenticated, (req, res) =>
	proposalController.create(req, res),
);
proposalRoutes.get("/", ensureRole(UserRole.STUDENT), (req, res) => proposalController.list(req, res));
proposalRoutes.get("/mine", ensureAuthenticated, (req, res) =>
	proposalController.listMine(req, res),
);
proposalRoutes.put("/:id", ensureAuthenticated, (req, res) =>
	proposalController.update(req, res),
);
proposalRoutes.delete("/:id", ensureAuthenticated, (req, res) =>
	proposalController.delete(req, res),
);

export { proposalRoutes };
