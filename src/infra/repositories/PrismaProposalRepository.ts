import { Proposal } from "@/domain/models/Proposal";
import {
  CreateProposalParams,
  ProposalRepository,
} from "@/domain/repositories/ProposalRepository";
import { getPrismaClient } from "@/infra/database/prisma/client";

type PrismaClientLike = {
  proposal: {
    create(args: {
      data: {
        title: string;
        description: string;
        submissionDate: Date;
        status: string;
        attachments: Buffer;
      };
    }): Promise<ProposalRecord>;
  };
};

type ProposalRecord = {
  id: string;
  title: string;
  description: string;
  submissionDate: Date;
  status: string;
  attachments: Buffer;
};

export class PrismaProposalRepository implements ProposalRepository {
  constructor(
    private readonly db: PrismaClientLike = getPrismaClient() as unknown as PrismaClientLike,
  ) {}

  async create(data: CreateProposalParams): Promise<Proposal> {
    const createdProposal = await this.db.proposal.create({
      data: {
        title: data.title,
        description: data.description,
        submissionDate: data.submissionDate,
        status: data.status,
        attachments: data.attachments,
      },
    });

    return {
      id: createdProposal.id,
      title: createdProposal.title,
      description: createdProposal.description,
      submissionDate: createdProposal.submissionDate,
      status: createdProposal.status,
      attachments: createdProposal.attachments,
    };
  }
}
