import { Router } from "express";

import { authRoutes } from "@/main/router/auth.routes";

const routes = Router();

routes.use("/auth", authRoutes);

routes.get("/", (req, res) => {
  res.send({ message: "Hello, World!" });
});

export { routes };
