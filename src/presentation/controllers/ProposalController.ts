import { Request, Response } from "express";

import { InvalidProposalPayloadError } from "@/domain/errors/InvalidProposalPayloadError";
import { HttpErrorMapper } from "@/presentation/mappers/HttpErrorMapper";

export type ProposalResponse = {
  id: string;
  title: string;
  description: string;
  submissionDate: Date;
  status: string;
  attachments: Buffer;
};

export type CreateProposalRequest = {
  title: string;
  description: string;
  submissionDate: Date;
  status: string;
  attachments: Buffer;
};

export type CreateProposalContract = {
  execute(data: CreateProposalRequest): Promise<ProposalResponse>;
};

export type ListProposalsContract = {
  execute(): Promise<ProposalResponse[]>;
};

export class ProposalController {
  constructor(
    private readonly createProposal: CreateProposalContract,
    private readonly listProposals: ListProposalsContract,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const { title, description, submissionDate, status, attachments } = req.body ?? {};

    try {
      this.validateRequiredFields({ title, description, submissionDate, status, attachments });

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
      });

      res.status(201).json(this.serializeProposal(proposal));
    } catch (error: unknown) {
      const statusCode = HttpErrorMapper.getStatusCode(error);
      const message = HttpErrorMapper.getMessage(error);
      res.status(statusCode).json({ message });
    }
  }

  async list(_req: Request, res: Response): Promise<void> {
    try {
      const proposals = await this.listProposals.execute();

      res.status(200).json(proposals.map((proposal) => this.serializeProposal(proposal)));
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
  }) {
    const { title, description, submissionDate, status, attachments } = fields;

    if (!title || !description || !submissionDate || !status || attachments === undefined) {
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

  private serializeProposal(proposal: ProposalResponse) {
    return {
      id: proposal.id,
      title: proposal.title,
      description: proposal.description,
      submissionDate: proposal.submissionDate,
      status: proposal.status,
      attachments: proposal.attachments.toString("base64"),
    };
  }
}
