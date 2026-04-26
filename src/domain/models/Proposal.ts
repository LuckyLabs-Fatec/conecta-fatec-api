export interface Proposal {
  id: string;
  title: string;
  description: string;
  submissionDate: Date;
  status: string;
  attachments: Buffer;
}
