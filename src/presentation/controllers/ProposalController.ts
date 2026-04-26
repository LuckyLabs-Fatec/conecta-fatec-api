import { Request, Response } from "express";

import { InvalidProposalPayloadError } from "@/domain/errors/InvalidProposalPayloadError";
import { UserRole } from "@/domain/models/User";
import { HttpErrorMapper } from "@/presentation/mappers/HttpErrorMapper";

export type ProposalAuthorResponse = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: UserRole;
};

export type ProposalResponse = {
  id: string;
  title: string;
  description: string;
  submissionDate: Date;
  status: string;
  attachments: Buffer;
  user: ProposalAuthorResponse;
};

export type CreateProposalRequest = {
  title: string;
  description: string;
  submissionDate: Date;
  status: string;
  attachments: Buffer;
  createdByUserId: string;
};

export type CreateProposalContract = {
  execute(data: CreateProposalRequest): Promise<ProposalResponse>;
};

export type ListProposalsQuery = {
  page?: unknown;
  limit?: unknown;
};

export type PaginatedProposalResponse = {
  items: ReturnType<ProposalController["serializeProposal"]>[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type ListProposalsContract = {
  execute(params: { page: number; limit: number }): Promise<{
    items: ProposalResponse[];
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  }>;
};

export class ProposalController {
  constructor(
    private readonly createProposal: CreateProposalContract,
    private readonly listProposals: ListProposalsContract,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const { title, description, submissionDate, status, attachments, createdByUserId } = req.body ?? {};

    try {
      this.validateRequiredFields({
        title,
        description,
        submissionDate,
        status,
        attachments,
        createdByUserId,
      });

      const parsedSubmissionDate = new Date(submissionDate);

      if (Number.isNaN(parsedSubmissionDate.getTime())) {
        throw new InvalidProposalPayloadError("Invalid submission date");
      }

      const normalizedAttachments = this.normalizeAttachments(attachments);

      const proposal = await this.createProposal.execute({
        title,
        description,
        submissionDate: parsedSubmissionDate,
        status,
        attachments: normalizedAttachments,
        createdByUserId,
      });

      res.status(201).json(this.serializeProposal(proposal));
    } catch (error: unknown) {
      const statusCode = HttpErrorMapper.getStatusCode(error);
      const message = HttpErrorMapper.getMessage(error);
      res.status(statusCode).json({ message });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = this.parsePaginationQuery(req.query);
      const proposals = await this.listProposals.execute({ page, limit });

      res.status(200).json({
        items: proposals.items.map((proposal) => this.serializeProposal(proposal)),
        page: proposals.page,
        limit: proposals.limit,
        totalItems: proposals.totalItems,
        totalPages: proposals.totalPages,
      });
    } catch (error: unknown) {
      const statusCode = HttpErrorMapper.getStatusCode(error);
      const message = HttpErrorMapper.getMessage(error);
      res.status(statusCode).json({ message });
    }
  }

  private validateRequiredFields(fields: {
    title?: unknown;
    description?: unknown;
    submissionDate?: unknown;
    status?: unknown;
    attachments?: unknown;
    createdByUserId?: unknown;
  }) {
    const { title, description, submissionDate, status, attachments, createdByUserId } = fields;

    if (
      !title ||
      !description ||
      !submissionDate ||
      !status ||
      attachments === undefined ||
      !createdByUserId
    ) {
      throw new InvalidProposalPayloadError("Missing required fields");
    }
  }

  private normalizeAttachments(attachments: unknown): Buffer {
    if (Buffer.isBuffer(attachments)) {
      return attachments;
    }

    if (typeof attachments === "string") {
      return Buffer.from(attachments, "base64");
    }

    throw new InvalidProposalPayloadError("Attachments must be a Buffer or base64 string");
  }

  private parsePaginationQuery(query: ListProposalsQuery): { page: number; limit: number } {
    const page = this.parsePositiveInteger(query.page, 1);
    const limit = this.parsePositiveInteger(query.limit, 10);

    if (limit > 100) {
      throw new InvalidProposalPayloadError("Limit must be less than or equal to 100");
    }

    return { page, limit };
  }

  private parsePositiveInteger(value: unknown, fallback: number): number {
    if (value === undefined || value === null || value === "") {
      return fallback;
    }

    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
      throw new InvalidProposalPayloadError("Pagination parameters must be positive integers");
    }

    return parsedValue;
  }

  private serializeProposal(proposal: ProposalResponse) {
    return {
      id: proposal.id,
      title: proposal.title,
      description: proposal.description,
      submissionDate: proposal.submissionDate,
      status: proposal.status,
      attachments: proposal.attachments.toString("base64"),
      user: proposal.user,
    };
  }
}
