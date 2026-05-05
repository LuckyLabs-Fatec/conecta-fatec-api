import { Proposal } from "@/domain/models/Proposal";
import { UserRole } from "@/domain/models/User";
import {
  CreateProposalParams,
  UpdateProposalParams,
  ListProposalsParams,
  ListUserProposalsParams,
  PaginatedProposals,
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
        optionalContactPhone?: string;
        optionalContactPhoneIsWhats?: boolean;
        optionalContactEmail?: string;
        createdBy: {
          connect: {
            id: string;
          };
        };
      };
      include: {
        createdBy: true;
      };
    }): Promise<ProposalRecord>;
    update(args: {
      where: {
        id: string;
      };
      data: {
        title?: string;
        description?: string;
        submissionDate?: Date;
        status?: string;
        attachments?: Buffer;
        optionalContactPhone?: string;
        optionalContactPhoneIsWhats?: boolean;
        optionalContactEmail?: string;
      };
      include: {
        createdBy: true;
      };
    }): Promise<ProposalRecord>;
    findMany(args?: {
      skip?: number;
      take?: number;
      orderBy?: {
        submissionDate?: "asc" | "desc";
      };
      where?: {
        createdByUserId?: string;
      };
      include?: {
        createdBy?: true;
      };
    }): Promise<ProposalRecord[]>;
    count(args?: {
      where?: {
        createdByUserId?: string;
      };
    }): Promise<number>;
  };
};

type UserRecord = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: UserRole;
};

type ProposalRecord = {
  id: string;
  title: string;
  description: string;
  submissionDate: Date;
  status: string;
  attachments: Buffer;
  optionalContactPhone: string | null;
  optionalContactPhoneIsWhats: boolean;
  optionalContactEmail: string | null;
  createdBy: UserRecord;
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
        optionalContactPhone: data.optionalContactPhone,
        optionalContactPhoneIsWhats: data.optionalContactPhoneIsWhats ?? false,
        optionalContactEmail: data.optionalContactEmail,
        createdBy: {
          connect: {
            id: data.createdByUserId,
          },
        },
      },
      include: {
        createdBy: true,
      },
    });

    return {
      id: createdProposal.id,
      title: createdProposal.title,
      description: createdProposal.description,
      submissionDate: createdProposal.submissionDate,
      status: createdProposal.status,
      attachments: createdProposal.attachments,
      optionalContactPhone: createdProposal.optionalContactPhone ?? undefined,
      optionalContactPhoneIsWhats: createdProposal.optionalContactPhoneIsWhats,
      optionalContactEmail: createdProposal.optionalContactEmail ?? undefined,
      user: {
        id: createdProposal.createdBy.id,
        email: createdProposal.createdBy.email,
        name: createdProposal.createdBy.name ?? undefined,
        avatar: createdProposal.createdBy.avatar ?? undefined,
        role: createdProposal.createdBy.role,
      },
    };
  }

  async update(id: string, data: UpdateProposalParams): Promise<Proposal> {
    const updateData: {
      title?: string;
      description?: string;
      submissionDate?: Date;
      status?: string;
      attachments?: Buffer;
      optionalContactPhone?: string;
      optionalContactPhoneIsWhats?: boolean;
      optionalContactEmail?: string;
    } = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.submissionDate !== undefined) updateData.submissionDate = data.submissionDate;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.attachments !== undefined) updateData.attachments = data.attachments;
    if (data.optionalContactPhone !== undefined)
      updateData.optionalContactPhone = data.optionalContactPhone;
    if (data.optionalContactPhoneIsWhats !== undefined)
      updateData.optionalContactPhoneIsWhats = data.optionalContactPhoneIsWhats;
    if (data.optionalContactEmail !== undefined)
      updateData.optionalContactEmail = data.optionalContactEmail;

    const updatedProposal = await this.db.proposal.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: true,
      },
    });

    return {
      id: updatedProposal.id,
      title: updatedProposal.title,
      description: updatedProposal.description,
      submissionDate: updatedProposal.submissionDate,
      status: updatedProposal.status,
      attachments: updatedProposal.attachments,
      optionalContactPhone: updatedProposal.optionalContactPhone ?? undefined,
      optionalContactPhoneIsWhats: updatedProposal.optionalContactPhoneIsWhats,
      optionalContactEmail: updatedProposal.optionalContactEmail ?? undefined,
      user: {
        id: updatedProposal.createdBy.id,
        email: updatedProposal.createdBy.email,
        name: updatedProposal.createdBy.name ?? undefined,
        avatar: updatedProposal.createdBy.avatar ?? undefined,
        role: updatedProposal.createdBy.role,
      },
    };
  }

  async findPaginated(params: ListProposalsParams): Promise<PaginatedProposals> {
    const skip = (params.page - 1) * params.limit;

    const [totalItems, proposals] = await Promise.all([
      this.db.proposal.count(),
      this.db.proposal.findMany({
        skip,
        take: params.limit,
        orderBy: {
          submissionDate: "desc",
        },
        include: {
          createdBy: true,
        },
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));

    return {
      items: proposals.map((proposal) => ({
        id: proposal.id,
        title: proposal.title,
        description: proposal.description,
        submissionDate: proposal.submissionDate,
        status: proposal.status,
        attachments: proposal.attachments,
        optionalContactPhone: proposal.optionalContactPhone ?? undefined,
        optionalContactPhoneIsWhats: proposal.optionalContactPhoneIsWhats,
        optionalContactEmail: proposal.optionalContactEmail ?? undefined,
        user: {
          id: proposal.createdBy.id,
          email: proposal.createdBy.email,
          name: proposal.createdBy.name ?? undefined,
          avatar: proposal.createdBy.avatar ?? undefined,
          role: proposal.createdBy.role,
        },
      })),
      page: params.page,
      limit: params.limit,
      totalItems,
      totalPages,
    };
  }

  async findPaginatedByUser(params: ListUserProposalsParams): Promise<PaginatedProposals> {
    const skip = (params.page - 1) * params.limit;
    const where = {
      createdByUserId: params.userId,
    };

    const [totalItems, proposals] = await Promise.all([
      this.db.proposal.count({ where }),
      this.db.proposal.findMany({
        skip,
        take: params.limit,
        orderBy: {
          submissionDate: "desc",
        },
        where,
        include: {
          createdBy: true,
        },
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));

    return {
      items: proposals.map((proposal) => ({
        id: proposal.id,
        title: proposal.title,
        description: proposal.description,
        submissionDate: proposal.submissionDate,
        status: proposal.status,
        attachments: proposal.attachments,
        optionalContactPhone: proposal.optionalContactPhone ?? undefined,
        optionalContactPhoneIsWhats: proposal.optionalContactPhoneIsWhats,
        optionalContactEmail: proposal.optionalContactEmail ?? undefined,
        user: {
          id: proposal.createdBy.id,
          email: proposal.createdBy.email,
          name: proposal.createdBy.name ?? undefined,
          avatar: proposal.createdBy.avatar ?? undefined,
          role: proposal.createdBy.role,
        },
      })),
      page: params.page,
      limit: params.limit,
      totalItems,
      totalPages,
    };
  }
}
