import { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";

import { CreateProposalContract, ListProposalsContract, ProposalController } from "./ProposalController";

import { InvalidProposalPayloadError } from "@/domain/errors/InvalidProposalPayloadError";

describe("ProposalController", () => {
  let proposalController: ProposalController;
  let createProposalMock: CreateProposalContract;
  let listProposalsMock: ListProposalsContract;

  beforeEach(() => {
    createProposalMock = {
      execute: vi.fn(),
    };

    listProposalsMock = {
      execute: vi.fn(),
    };

    proposalController = new ProposalController(createProposalMock, listProposalsMock);
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
        status: "SUBMITTED",
        attachments: Buffer.from("content"),
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

  it("should return mapped error when create proposal fails with known error", async () => {
    vi.mocked(createProposalMock.execute).mockRejectedValue(new InvalidProposalPayloadError());

    const req = {
      body: {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        submissionDate: new Date().toISOString(),
        status: "SUBMITTED",
        attachments: Buffer.from("content").toString("base64"),
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
        status: "SUBMITTED",
        attachments: Buffer.from("content"),
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
      status: "SUBMITTED",
      attachments,
    });

    const req = {
      body: {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        submissionDate: now.toISOString(),
        status: "SUBMITTED",
        attachments: attachments.toString("base64"),
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
      }),
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        submissionDate: now,
        attachments: attachments.toString("base64"),
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
      status: "SUBMITTED",
      attachments,
    });

    const req = {
      body: {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        submissionDate: now.toISOString(),
        status: "SUBMITTED",
        attachments,
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
        status: "SUBMITTED",
        attachments: 123,
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

    vi.mocked(listProposalsMock.execute).mockResolvedValue([
      {
        id: faker.string.uuid(),
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        submissionDate: firstSubmissionDate,
        status: "SUBMITTED",
        attachments: firstAttachments,
      },
      {
        id: faker.string.uuid(),
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        submissionDate: secondSubmissionDate,
        status: "APPROVED",
        attachments: secondAttachments,
      },
    ]);

    const req = {} as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.list(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          attachments: firstAttachments.toString("base64"),
        }),
        expect.objectContaining({
          attachments: secondAttachments.toString("base64"),
        }),
      ]),
    );
  });

  it("should return mapped error when list proposals fails with known error", async () => {
    vi.mocked(listProposalsMock.execute).mockRejectedValue(new InvalidProposalPayloadError());

    const req = {} as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await proposalController.list(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid proposal payload" });
  });
});
