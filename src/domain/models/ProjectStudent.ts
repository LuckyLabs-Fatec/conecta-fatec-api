import { ProjectStatus } from "@/domain/models/Status";

export interface ProjectStudent {
  id: string;
  projectId: string;
  userId: string;
  groupName?: string;
}

export interface StudentSummary {
  id: string;
  name?: string;
  email: string;
}

export interface ProjectAssignment {
  projectId: string;
  projectTitle: string;
  projectDescription: string;
  projectStatus: ProjectStatus;
  groupName?: string;
  teammates: StudentSummary[];
}
