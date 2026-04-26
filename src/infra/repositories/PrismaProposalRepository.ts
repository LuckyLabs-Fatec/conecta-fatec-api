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
    findMany(args?: {
      orderBy?: {
        submissionDate?: "asc" | "desc";
      };
    }): Promise<ProposalRecord[]>;
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

  async findAll(): Promise<Proposal[]> {
    const proposals = await this.db.proposal.findMany({
      orderBy: {
        submissionDate: "desc",
      },
    });

    return proposals.map((proposal) => ({
      id: proposal.id,
      title: proposal.title,
      description: proposal.description,
      submissionDate: proposal.submissionDate,
      status: proposal.status,
      attachments: proposal.attachments,
    }));
  }
}
