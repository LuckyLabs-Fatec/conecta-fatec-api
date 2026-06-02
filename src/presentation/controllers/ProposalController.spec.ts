import { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";

import {
  CreateProposalContract,
  ListMyProposalsContract,
  ListProposalsContract,
  ProposalController,
  UpdateProposalContract,
} from "./ProposalController";

import { InvalidProposalPayloadError } from "@/domain/errors/InvalidProposalPayloadError";
import { ProposalStatus } from "@/domain/models/Status";
import { UserRole } from "@/domain/models/User";

describe("ProposalController", () => {
  let proposalController: ProposalController;
  let createProposalMock: CreateProposalContract;
  let listProposalsMock: ListProposalsContract;
  let listMyProposalsMock: ListMyProposalsContract;
  let updateProposalMock: UpdateProposalContract;

  beforeEach(() => {
    createProposalMock = {
      execute: vi.fn(),
    };

    listProposalsMock = {
      execute: vi.fn(),
    };

    listMyProposalsMock = {
      execute: vi.fn(),
    };

    updateProposalMock = {
      execute: vi.fn(),
    };

    proposalController = new ProposalController(
      createProposalMock,
      listProposalsMock,
      listMyProposalsMock,
      updateProposalMock,
    );
  });

  it("should return 400 when required fields are missing", async () => {
    const req = {
      body: {
        title: faker.lorem.words(3),
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing required fields" });
    expect(createProposalMock.execute).not.toHaveBeenCalled();
  });

  it("should return 400 when body is missing", async () => {
    const req = {} as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing required fields" });
    expect(createProposalMock.execute).not.toHaveBeenCalled();
  });

  it("should return 400 when submission date is invalid", async () => {
    const req = {
      body: {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        submissionDate: "invalid-date",
        status: ProposalStatus.IN_REVIEW,
        attachments: Buffer.from("content"),
        createdByUserId: faker.string.uuid(),
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid submission date" });
    expect(createProposalMock.execute).not.toHaveBeenCalled();
  });

  it("should return 400 when create proposal status is invalid", async () => {
    const req = {
      body: {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        submissionDate: new Date().toISOString(),
        status: "atribuida",
        attachments: Buffer.from("content"),
        createdByUserId: faker.string.uuid(),
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid proposal status" });
    expect(createProposalMock.execute).not.toHaveBeenCalled();
  });

  it("should return mapped error when create proposal fails with known error", async () => {
    vi.mocked(createProposalMock.execute).mockRejectedValue(new InvalidProposalPayloadError());

    const req = {
      body: {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        submissionDate: new Date().toISOString(),
        status: ProposalStatus.IN_REVIEW,
        attachments: Buffer.from("content").toString("base64"),
        createdByUserId: faker.string.uuid(),
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid proposal payload" });
  });

  it("should return 500 on unexpected errors", async () => {
    vi.mocked(createProposalMock.execute).mockRejectedValue(new Error());

    const req = {
      body: {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        submissionDate: new Date().toISOString(),
        status: ProposalStatus.IN_REVIEW,
        attachments: Buffer.from("content"),
        createdByUserId: faker.string.uuid(),
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });

  it("should return 201 and created proposal on success", async () => {
    const now = new Date("2026-04-26T10:00:00.000Z");
    const attachments = Buffer.from("file-content");

    vi.mocked(createProposalMock.execute).mockResolvedValue({
      id: faker.string.uuid(),
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      submissionDate: now,
      status: ProposalStatus.IN_REVIEW,
      attachments,
      optionalContactPhone: "11999999999",
      optionalContactPhoneIsWhats: true,
      optionalContactEmail: "proposal-contact@example.com",
      active: true,
      user: {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        avatar: faker.internet.url(),
        role: UserRole.SOCIETY,
      },
    });

    const req = {
      body: {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        submissionDate: now.toISOString(),
        status: ProposalStatus.IN_REVIEW,
        attachments: attachments.toString("base64"),
        createdByUserId: faker.string.uuid(),
        optionalContactPhone: "11999999999",
        optionalContactPhoneIsWhats: true,
        optionalContactEmail: "proposal-contact@example.com",
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(createProposalMock.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        attachments,
        createdByUserId: req.body.createdByUserId,
        optionalContactPhone: "11999999999",
        optionalContactPhoneIsWhats: true,
        optionalContactEmail: "proposal-contact@example.com",
      }),
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        submissionDate: now,
        attachments: attachments.toString("base64"),
        optionalContactPhone: "11999999999",
        optionalContactPhoneIsWhats: true,
        optionalContactEmail: "proposal-contact@example.com",
        user: expect.objectContaining({
          id: expect.any(String),
          email: expect.any(String),
          role: UserRole.SOCIETY,
        }),
      }),
    );
  });

  it("should accept buffer attachments on success", async () => {
    const now = new Date("2026-04-26T10:00:00.000Z");
    const attachments = Buffer.from("buffer-content");

    vi.mocked(createProposalMock.execute).mockResolvedValue({
      id: faker.string.uuid(),
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      submissionDate: now,
      status: ProposalStatus.IN_REVIEW,
      attachments,
      optionalContactPhoneIsWhats: false,
      active: true,
      user: {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        avatar: faker.internet.url(),
        role: UserRole.SOCIETY,
      },
    });

    const req = {
      body: {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        submissionDate: now.toISOString(),
        status: ProposalStatus.IN_REVIEW,
        attachments,
        createdByUserId: faker.string.uuid(),
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.create(req, res);

    expect(createProposalMock.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        attachments,
        createdByUserId: req.body.createdByUserId,
      }),
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        attachments: attachments.toString("base64"),
      }),
    );
  });

  it("should return 400 when attachments are invalid", async () => {
    const req = {
      body: {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        submissionDate: new Date().toISOString(),
        status: ProposalStatus.IN_REVIEW,
        attachments: 123,
        createdByUserId: faker.string.uuid(),
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Attachments must be a Buffer or base64 string" });
    expect(createProposalMock.execute).not.toHaveBeenCalled();
  });

  it("should return 200 and proposal list on success", async () => {
    const firstSubmissionDate = new Date("2026-04-26T10:00:00.000Z");
    const secondSubmissionDate = new Date("2026-04-25T09:30:00.000Z");
    const firstAttachments = Buffer.from("first-content");
    const secondAttachments = Buffer.from("second-content");

    vi.mocked(listProposalsMock.execute).mockResolvedValue({
      items: [
        {
          id: faker.string.uuid(),
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          submissionDate: firstSubmissionDate,
          status: ProposalStatus.IN_REVIEW,
          attachments: firstAttachments,
          optionalContactPhone: "11888888888",
          optionalContactPhoneIsWhats: false,
          optionalContactEmail: undefined,
          active: true,
          user: {
            id: faker.string.uuid(),
            email: faker.internet.email(),
            name: faker.person.fullName(),
            avatar: faker.internet.url(),
            role: UserRole.SOCIETY,
          },
        },
        {
          id: faker.string.uuid(),
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          submissionDate: secondSubmissionDate,
          status: ProposalStatus.APPROVED,
          attachments: secondAttachments,
          optionalContactPhone: undefined,
          optionalContactPhoneIsWhats: true,
          optionalContactEmail: "second-contact@example.com",
          active: true,
          user: {
            id: faker.string.uuid(),
            email: faker.internet.email(),
            name: faker.person.fullName(),
            avatar: faker.internet.url(),
            role: UserRole.STUDENT,
          },
        },
      ],
      page: 1,
      limit: 10,
      totalItems: 2,
      totalPages: 1,
    });

    const req = {
      query: {},
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.list(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(listProposalsMock.execute).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(res.json).toHaveBeenCalledWith({
      items: expect.arrayContaining([
        expect.objectContaining({
          attachments: firstAttachments.toString("base64"),
          optionalContactPhone: "11888888888",
          optionalContactPhoneIsWhats: false,
          optionalContactEmail: undefined,
          user: expect.objectContaining({ role: UserRole.SOCIETY }),
        }),
        expect.objectContaining({
          attachments: secondAttachments.toString("base64"),
          optionalContactPhone: undefined,
          optionalContactPhoneIsWhats: true,
          optionalContactEmail: "second-contact@example.com",
          user: expect.objectContaining({ role: UserRole.STUDENT }),
        }),
      ]),
      page: 1,
      limit: 10,
      totalItems: 2,
      totalPages: 1,
    });
  });

  it("should return 400 when pagination query is invalid", async () => {
    const req = {
      query: {
        page: "0",
        limit: "10",
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.list(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Pagination parameters must be positive integers" });
    expect(listProposalsMock.execute).not.toHaveBeenCalled();
  });

  it("should return 400 when pagination limit is greater than 100", async () => {
    const req = {
      query: {
        page: "1",
        limit: "101",
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.list(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Limit must be less than or equal to 100" });
    expect(listProposalsMock.execute).not.toHaveBeenCalled();
  });

  it("should parse explicit pagination values", async () => {
    vi.mocked(listProposalsMock.execute).mockResolvedValue({
      items: [],
      page: 2,
      limit: 20,
      totalItems: 0,
      totalPages: 0,
    });

    const req = {
      query: {
        page: "2",
        limit: "20",
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.list(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(listProposalsMock.execute).toHaveBeenCalledWith({ page: 2, limit: 20 });
    expect(res.json).toHaveBeenCalledWith({
      items: [],
      page: 2,
      limit: 20,
      totalItems: 0,
      totalPages: 0,
    });
  });

  it("should return mapped error when list proposals fails with known error", async () => {
    vi.mocked(listProposalsMock.execute).mockRejectedValue(new InvalidProposalPayloadError());

    const req = {
      query: {},
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.list(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid proposal payload" });
  });

  it("should return 200 and only the authenticated user's proposals on mine list", async () => {
    const submissionDate = new Date("2026-04-26T10:00:00.000Z");
    const attachments = Buffer.from("mine-content");

    vi.mocked(listMyProposalsMock.execute).mockResolvedValue({
      items: [
        {
          id: faker.string.uuid(),
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          submissionDate,
          status: ProposalStatus.IN_REVIEW,
          attachments,
          optionalContactPhone: "11999999999",
          optionalContactPhoneIsWhats: true,
          optionalContactEmail: "mine-contact@example.com",
          active: true,
          user: {
            id: faker.string.uuid(),
            email: faker.internet.email(),
            name: faker.person.fullName(),
            avatar: faker.internet.url(),
            role: UserRole.SOCIETY,
          },
        },
      ],
      page: 1,
      limit: 10,
      totalItems: 1,
      totalPages: 1,
    });

    const req = {
      body: {
        createdByUserId: faker.string.uuid(),
      },
      query: {},
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.listMine(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(listMyProposalsMock.execute).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      userId: req.body.createdByUserId,
    });
    expect(res.json).toHaveBeenCalledWith({
      items: [
        expect.objectContaining({
          attachments: attachments.toString("base64"),
          optionalContactPhone: "11999999999",
          optionalContactPhoneIsWhats: true,
          optionalContactEmail: "mine-contact@example.com",
          user: expect.objectContaining({ role: UserRole.SOCIETY }),
        }),
      ],
      page: 1,
      limit: 10,
      totalItems: 1,
      totalPages: 1,
    });
  });

  it("should return 400 when update proposal status is invalid", async () => {
    const req = {
      params: {
        id: faker.string.uuid(),
      },
      body: {
        status: "atribuida",
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid proposal status" });
    expect(updateProposalMock.execute).not.toHaveBeenCalled();
  });

  it("should return 401 when list mine is called without authenticated user id", async () => {
    const req = {
      body: {},
      query: {},
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.listMine(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Authentication required" });
    expect(listMyProposalsMock.execute).not.toHaveBeenCalled();
  });
});
