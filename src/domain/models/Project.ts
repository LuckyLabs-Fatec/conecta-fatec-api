export interface Project {
  id: string;
  title: string;
  description: string;
  deadline?: Date;
  status: string;
  attachments?: string;
  courseId: string;
  proposalId: string;
  selectedFeedbackId?: string;
}
