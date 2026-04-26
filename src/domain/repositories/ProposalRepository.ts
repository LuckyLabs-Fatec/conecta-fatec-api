import { Proposal } from "@/domain/models/Proposal";

export type CreateProposalParams = {
  title: string;
  description: string;
  submissionDate: Date;
  status: string;
  attachments: Buffer;
  createdByUserId: string;
};

export type ListProposalsParams = {
  page: number;
  limit: number;
};

export type PaginatedProposals = {
  items: Proposal[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export interface ProposalRepository {
  create(data: CreateProposalParams): Promise<Proposal>;
  findPaginated(params: ListProposalsParams): Promise<PaginatedProposals>;
}
