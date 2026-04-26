import { Router } from "express";

import { makeProposalController } from "@/main/factories/makeProposalController";

const proposalRoutes = Router();
const proposalController = makeProposalController();

proposalRoutes.post("/", (req, res) => proposalController.create(req, res));

export { proposalRoutes };
