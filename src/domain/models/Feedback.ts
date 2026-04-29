export interface Feedback {
  id: string;
  comment?: string;
  attachments?: string;
  createdAt: Date;
  userId: string;
  projectId: string;
}
