import { Request, Response } from "express";

import { InvalidProposalPayloadError } from "@/domain/errors/InvalidProposalPayloadError";
import { isProposalStatus, ProposalStatus } from "@/domain/models/Status";
import { UserRole } from "@/domain/models/User";
import { getAuthenticatedUser } from "@/presentation/http/AuthenticatedRequest";
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
  status: ProposalStatus;
  attachments: Buffer;
  optionalContactPhone?: string;
  optionalContactPhoneIsWhats: boolean;
  optionalContactEmail?: string;
  active: boolean;
  user: ProposalAuthorResponse;
};

export type CreateProposalRequest = {
  title: string;
  description: string;
  submissionDate: Date;
  status: ProposalStatus;
  attachments: Buffer;
  createdByUserId: string;
  optionalContactPhone?: string;
  optionalContactPhoneIsWhats?: boolean;
  optionalContactEmail?: string;
};

export type UpdateProposalRequest = {
  title?: string;
  description?: string;
  submissionDate?: Date;
  status?: ProposalStatus;
  attachments?: Buffer;
  optionalContactPhone?: string;
  optionalContactPhoneIsWhats?: boolean;
  optionalContactEmail?: string;
};

export type CreateProposalContract = {
  execute(data: CreateProposalRequest): Promise<ProposalResponse>;
};

export type UpdateProposalContract = {
  execute(id: string, data: UpdateProposalRequest): Promise<ProposalResponse>;
};

export type DeleteProposalContract = {
  execute(id: string): Promise<void>;
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

export type ListMyProposalsContract = {
  execute(params: { page: number; limit: number; userId: string }): Promise<{
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
    private readonly listMyProposals: ListMyProposalsContract,
    private readonly updateProposal?: UpdateProposalContract,
    private readonly deleteProposal?: DeleteProposalContract,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const {
      title,
      description,
      submissionDate,
      status,
      attachments,
      createdByUserId,
      optionalContactPhone,
      optionalContactPhoneIsWhats,
      optionalContactEmail,
    } = req.body ?? {};
    const authenticatedUserId = getAuthenticatedUser(req)?.userId;

    try {
      this.validateRequiredFields({
        title,
        description,
        submissionDate,
        status,
        attachments,
        createdByUserId: authenticatedUserId ?? createdByUserId,
      });

      const parsedSubmissionDate = new Date(submissionDate);

      if (Number.isNaN(parsedSubmissionDate.getTime())) {
        throw new InvalidProposalPayloadError("Invalid submission date");
      }

      if (!isProposalStatus(status)) {
        throw new InvalidProposalPayloadError("Invalid proposal status");
      }

      const normalizedAttachments = this.normalizeAttachments(attachments);

      const proposal = await this.createProposal.execute({
        title,
        description,
        submissionDate: parsedSubmissionDate,
        status,
        attachments: normalizedAttachments,
        createdByUserId: authenticatedUserId ?? createdByUserId,
        optionalContactPhone,
        optionalContactPhoneIsWhats,
        optionalContactEmail,
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

  async listMine(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = this.parsePaginationQuery(req.query);
      const createdByUserId = getAuthenticatedUser(req)?.userId ?? req.body?.createdByUserId;

      if (!createdByUserId) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const proposals = await this.listMyProposals.execute({
        page,
        limit,
        userId: createdByUserId,
      });

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

  async update(req: Request, res: Response): Promise<void> {
    if (!this.updateProposal) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    const {
      title,
      description,
      submissionDate,
      status,
      attachments,
      optionalContactPhone,
      optionalContactPhoneIsWhats,
      optionalContactEmail,
    } = req.body ?? {};

    try {
      const proposalId = this.getIdParam(req);

      if (!proposalId) {
        throw new InvalidProposalPayloadError("Proposal ID is required");
      }

      const updateData: UpdateProposalRequest = {};

      if (title !== undefined) {
        if (!title) throw new InvalidProposalPayloadError("Title cannot be empty");
        updateData.title = title;
      }

      if (description !== undefined) {
        if (!description) throw new InvalidProposalPayloadError("Description cannot be empty");
        updateData.description = description;
      }

      if (submissionDate !== undefined) {
        const parsedSubmissionDate = new Date(submissionDate);
        if (Number.isNaN(parsedSubmissionDate.getTime())) {
          throw new InvalidProposalPayloadError("Invalid submission date");
        }
        updateData.submissionDate = parsedSubmissionDate;
      }

      if (status !== undefined) {
        if (!isProposalStatus(status)) {
          throw new InvalidProposalPayloadError("Invalid proposal status");
        }
        updateData.status = status;
      }

      if (attachments !== undefined) {
        updateData.attachments = this.normalizeAttachments(attachments);
      }

      if (optionalContactPhone !== undefined) {
        updateData.optionalContactPhone = optionalContactPhone;
      }

      if (optionalContactPhoneIsWhats !== undefined) {
        updateData.optionalContactPhoneIsWhats = optionalContactPhoneIsWhats;
      }

      if (optionalContactEmail !== undefined) {
        updateData.optionalContactEmail = optionalContactEmail;
      }

      const proposal = await this.updateProposal.execute(proposalId, updateData);
      res.status(200).json(this.serializeProposal(proposal));
    } catch (error: unknown) {
      const statusCode = HttpErrorMapper.getStatusCode(error);
      const message = HttpErrorMapper.getMessage(error);
      res.status(statusCode).json({ message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    if (!this.deleteProposal) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    try {
      const proposalId = this.getIdParam(req);

      if (!proposalId) {
        throw new InvalidProposalPayloadError("Proposal ID is required");
      }

      await this.deleteProposal.execute(proposalId);
      res.status(204).send();
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

  private getIdParam(req: Request): string {
    const idParam = req.params.id;
    return Array.isArray(idParam) ? idParam[0] : idParam;
  }

  private serializeProposal(proposal: ProposalResponse) {
    return {
      id: proposal.id,
      title: proposal.title,
      description: proposal.description,
      submissionDate: proposal.submissionDate,
      status: proposal.status,
      attachments: Buffer.from(proposal.attachments).toString("base64"),
      optionalContactPhone: proposal.optionalContactPhone,
      optionalContactPhoneIsWhats: proposal.optionalContactPhoneIsWhats,
      optionalContactEmail: proposal.optionalContactEmail,
      active: proposal.active,
      user: proposal.user,
    };
  }
}
