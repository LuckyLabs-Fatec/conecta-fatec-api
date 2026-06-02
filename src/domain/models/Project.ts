import { ProjectStatus } from "@/domain/models/Status";

export interface Project {
  id: string;
  title: string;
  description: string;
  deadline?: Date;
  status: ProjectStatus;
  attachments?: string;
  active: boolean;
  courseId: string;
  proposalId: string;
  selectedFeedbackId?: string;
}
