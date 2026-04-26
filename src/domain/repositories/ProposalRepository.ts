import { Proposal } from "@/domain/models/Proposal";

export type CreateProposalParams = {
  title: string;
  description: string;
  submissionDate: Date;
  status: string;
  attachments: Buffer;
};

export interface ProposalRepository {
  create(data: CreateProposalParams): Promise<Proposal>;
}
