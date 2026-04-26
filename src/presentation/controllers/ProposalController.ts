import { Request, Response } from "express";

import { InvalidProposalPayloadError } from "@/domain/errors/InvalidProposalPayloadError";
import { HttpErrorMapper } from "@/presentation/mappers/HttpErrorMapper";

export type CreateProposalRequest = {
  title: string;
  description: string;
  submissionDate: Date;
  status: string;
  attachments: Buffer;
};

export type CreateProposalResponse = {
  id: string;
  title: string;
  description: string;
  submissionDate: Date;
  status: string;
  attachments: Buffer;
};

export type CreateProposalContract = {
  execute(data: CreateProposalRequest): Promise<CreateProposalResponse>;
};

export class ProposalController {
  constructor(private readonly createProposal: CreateProposalContract) {}

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

      res.status(201).json({
        id: proposal.id,
        title: proposal.title,
        description: proposal.description,
        submissionDate: proposal.submissionDate,
        status: proposal.status,
        attachments: proposal.attachments.toString("base64"),
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
}
