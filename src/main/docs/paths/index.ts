import { authPaths } from "./auth";
import { coursePaths } from "./courses";
import { feedbackPaths } from "./feedbacks";
import { notificationPaths } from "./notifications";
import { projectPaths } from "./projects";
import { proposalPaths } from "./proposals";
import { projectStudentPaths } from "./projectStudents";

export const swaggerPaths = {
  ...authPaths,
  ...proposalPaths,
  ...coursePaths,
  ...projectPaths,
  ...feedbackPaths,
  ...notificationPaths,
  ...projectStudentPaths,
} as const;
