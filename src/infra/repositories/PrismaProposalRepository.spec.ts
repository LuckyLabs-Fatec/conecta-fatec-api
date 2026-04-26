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
      proposal: { create },
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
});
