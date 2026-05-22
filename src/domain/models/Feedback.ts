export interface Feedback {
  id: string;
  comment?: string;
  attachments?: string;
  active: boolean;
  createdAt: Date;
  userId: string;
  projectId: string;
}
