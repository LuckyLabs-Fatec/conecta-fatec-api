import { Router } from "express";

import { makeProposalController } from "@/main/factories/makeProposalController";
import { ensureAuthenticatedCommunityUser } from "@/main/middlewares/ensureAuthenticatedCommunityUser";

const proposalRoutes = Router();
const proposalController = makeProposalController();

proposalRoutes.post("/", ensureAuthenticatedCommunityUser, (req, res) =>
	proposalController.create(req, res),
);
proposalRoutes.get("/", (req, res) => proposalController.list(req, res));
proposalRoutes.get("/mine", ensureAuthenticatedCommunityUser, (req, res) =>
	proposalController.listMine(req, res),
);

export { proposalRoutes };
