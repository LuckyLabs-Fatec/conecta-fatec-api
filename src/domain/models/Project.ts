export interface Project {
  id: string;
  title: string;
  description: string;
  deadline?: Date;
  status: string;
  attachments?: string;
  active: boolean;
  courseId: string;
  proposalId: string;
  selectedFeedbackId?: string;
}
