import { authPaths } from "./auth";
import { coursePaths } from "./courses";
import { feedbackPaths } from "./feedbacks";
import { notificationPaths } from "./notifications";
import { projectPaths } from "./projects";
import { proposalPaths } from "./proposals";
import { projectStudentPaths } from "./projectStudents";
import { mediatorPaths } from "./mediator";

export const swaggerPaths = {
  ...authPaths,
  ...proposalPaths,
  ...coursePaths,
  ...projectPaths,
  ...mediatorPaths,
  ...feedbackPaths,
  ...notificationPaths,
  ...projectStudentPaths,
} as const;
