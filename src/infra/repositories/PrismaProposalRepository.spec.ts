import { describe, expect, it, vi } from "vitest";

import { PrismaProposalRepository } from "./PrismaProposalRepository";

describe("PrismaProposalRepository", () => {
  it("should create and return mapped proposal", async () => {
    const submissionDate = new Date("2026-04-26T12:00:00.000Z");
    const attachments = Buffer.from("file-content");

    const create = vi.fn().mockResolvedValue({
      id: "created-proposal-id",
      title: "New Proposal",
      description: "Proposal description",
      submissionDate,
      status: "SUBMITTED",
      attachments,
    });

    const sut = new PrismaProposalRepository({
      proposal: { create, findMany: vi.fn(), count: vi.fn() },
    });

    const proposal = await sut.create({
      title: "New Proposal",
      description: "Proposal description",
      submissionDate,
      status: "SUBMITTED",
      attachments,
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        title: "New Proposal",
        description: "Proposal description",
        submissionDate,
        status: "SUBMITTED",
        attachments,
      },
    });

    expect(proposal).toEqual({
      id: "created-proposal-id",
      title: "New Proposal",
      description: "Proposal description",
      submissionDate,
      status: "SUBMITTED",
      attachments,
    });
  });

  it("should find paginated proposals and return mapped data", async () => {
    const firstSubmissionDate = new Date("2026-04-26T12:00:00.000Z");
    const secondSubmissionDate = new Date("2026-04-25T12:00:00.000Z");

    const findMany = vi.fn().mockResolvedValue([
      {
        id: "proposal-1",
        title: "First Proposal",
        description: "First description",
        submissionDate: firstSubmissionDate,
        status: "SUBMITTED",
        attachments: Buffer.from("first-file"),
      },
      {
        id: "proposal-2",
        title: "Second Proposal",
        description: "Second description",
        submissionDate: secondSubmissionDate,
        status: "APPROVED",
        attachments: Buffer.from("second-file"),
      },
    ]);

    const sut = new PrismaProposalRepository({
      proposal: { create: vi.fn(), findMany, count: vi.fn().mockResolvedValue(12) },
    });

    const paginated = await sut.findPaginated({ page: 2, limit: 5 });

    expect(paginated).toEqual({
      items: [
        {
          id: "proposal-1",
          title: "First Proposal",
          description: "First description",
          submissionDate: firstSubmissionDate,
          status: "SUBMITTED",
          attachments: Buffer.from("first-file"),
        },
        {
          id: "proposal-2",
          title: "Second Proposal",
          description: "Second description",
          submissionDate: secondSubmissionDate,
          status: "APPROVED",
          attachments: Buffer.from("second-file"),
        },
      ],
      page: 2,
      limit: 5,
      totalItems: 12,
      totalPages: 3,
    });
    expect(findMany).toHaveBeenCalledWith({
      skip: 5,
      take: 5,
      orderBy: {
        submissionDate: "desc",
      },
    });
  });
});
