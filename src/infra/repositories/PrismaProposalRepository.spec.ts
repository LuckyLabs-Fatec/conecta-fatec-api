import { describe, expect, it, vi } from "vitest";

import { PrismaProposalRepository } from "./PrismaProposalRepository";

import { UserRole } from "@/domain/models/User";

describe("PrismaProposalRepository", () => {
  it("should create and return mapped proposal", async () => {
    const submissionDate = new Date("2026-04-26T12:00:00.000Z");
    const attachments = Buffer.from("file-content");
    const createdBy = {
      id: "society-user-id",
      email: "society@example.com",
      name: "Society User",
      avatar: "https://example.com/avatar.png",
      role: UserRole.SOCIETY,
    };

    const create = vi.fn().mockResolvedValue({
      id: "created-proposal-id",
      title: "New Proposal",
      description: "Proposal description",
      submissionDate,
      status: "SUBMITTED",
      attachments,
      createdBy,
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
      createdByUserId: "society-user-id",
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        title: "New Proposal",
        description: "Proposal description",
        submissionDate,
        status: "SUBMITTED",
        attachments,
        createdBy: {
          connect: {
            id: "society-user-id",
          },
        },
      },
      include: {
        createdBy: true,
      },
    });

    expect(proposal).toEqual({
      id: "created-proposal-id",
      title: "New Proposal",
      description: "Proposal description",
      submissionDate,
      status: "SUBMITTED",
      attachments,
      user: createdBy,
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
        createdBy: {
          id: "society-user-id",
          email: "society@example.com",
          name: "Society User",
          avatar: null,
          role: UserRole.SOCIETY,
        },
      },
      {
        id: "proposal-2",
        title: "Second Proposal",
        description: "Second description",
        submissionDate: secondSubmissionDate,
        status: "APPROVED",
        attachments: Buffer.from("second-file"),
        createdBy: {
          id: "student-user-id",
          email: "student@example.com",
          name: null,
          avatar: "https://example.com/student.png",
          role: UserRole.STUDENT,
        },
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
          user: {
            id: "society-user-id",
            email: "society@example.com",
            name: "Society User",
            avatar: undefined,
            role: UserRole.SOCIETY,
          },
        },
        {
          id: "proposal-2",
          title: "Second Proposal",
          description: "Second description",
          submissionDate: secondSubmissionDate,
          status: "APPROVED",
          attachments: Buffer.from("second-file"),
          user: {
            id: "student-user-id",
            email: "student@example.com",
            name: undefined,
            avatar: "https://example.com/student.png",
            role: UserRole.STUDENT,
          },
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
      include: {
        createdBy: true,
      },
    });
  });

  it("should map null name/avatar to undefined when creating a proposal", async () => {
    const submissionDate = new Date("2026-04-26T12:00:00.000Z");
    const attachments = Buffer.from("file-content");

    const create = vi.fn().mockResolvedValue({
      id: "created-proposal-id",
      title: "New Proposal",
      description: "Proposal description",
      submissionDate,
      status: "SUBMITTED",
      attachments,
      createdBy: {
        id: "society-user-id",
        email: "society@example.com",
        name: null,
        avatar: null,
        role: UserRole.SOCIETY,
      },
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
      createdByUserId: "society-user-id",
    });

    expect(proposal.user).toEqual({
      id: "society-user-id",
      email: "society@example.com",
      name: undefined,
      avatar: undefined,
      role: UserRole.SOCIETY,
    });
  });

  it("should return at least one page when no proposals exist", async () => {
    const sut = new PrismaProposalRepository({
      proposal: {
        create: vi.fn(),
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(0),
      },
    });

    const paginated = await sut.findPaginated({ page: 1, limit: 10 });

    expect(paginated).toEqual({
      items: [],
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 1,
    });
  });
});
