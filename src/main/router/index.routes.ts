import { Router } from "express";

import { authRoutes } from "@/main/router/auth.routes";
import { courseRoutes } from "@/main/router/course.routes";
import { feedbackRoutes } from "@/main/router/feedback.routes";
import { notificationRoutes } from "@/main/router/notification.routes";
import { proposalRoutes } from "@/main/router/proposal.routes";
import { projectStudentRoutes } from "@/main/router/project-student.routes";
import { projectRoutes } from "@/main/router/project.routes";
import { mediatorRoutes } from "@/main/router/mediator.routes";
import { userRoutes } from "@/main/router/user.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/courses", courseRoutes);
routes.use("/feedbacks", feedbackRoutes);
routes.use("/notifications", notificationRoutes);
routes.use("/proposals", proposalRoutes);
routes.use("/project-students", projectStudentRoutes);
routes.use("/projects", projectRoutes);
routes.use("/mediator", mediatorRoutes);
routes.use("/users", userRoutes);

routes.get("/", (req, res) => {
  res.send({ message: "Hello, World!" });
});

routes.get("/health", (_req, res) => {
  res.sendStatus(200);
});

export { routes };
