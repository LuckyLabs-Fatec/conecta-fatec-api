import { Router } from "express";

import { authRoutes } from "@/main/router/auth.routes";
import { proposalRoutes } from "@/main/router/proposal.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/proposals", proposalRoutes);

routes.get("/", (req, res) => {
  res.send({ message: "Hello, World!" });
});

export { routes };
