import { Router } from "express";

import { makeProposalController } from "@/main/factories/makeProposalController";

const proposalRoutes = Router();
const proposalController = makeProposalController();

proposalRoutes.post("/", (req, res) => proposalController.create(req, res));
proposalRoutes.get("/", (req, res) => proposalController.list(req, res));

export { proposalRoutes };
