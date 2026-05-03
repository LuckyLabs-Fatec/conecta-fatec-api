import { Proposal } from "@/domain/models/Proposal";

export type CreateProposalParams = {
  title: string;
  description: string;
  submissionDate: Date;
  status: string;
  attachments: Buffer;
  createdByUserId: string;
  optionalContactPhone?: string;
  optionalContactPhoneIsWhats?: boolean;
  optionalContactEmail?: string;
};

export type ListProposalsParams = {
  page: number;
  limit: number;
};

export type ListUserProposalsParams = ListProposalsParams & {
  userId: string;
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
  findPaginatedByUser(params: ListUserProposalsParams): Promise<PaginatedProposals>;
}
