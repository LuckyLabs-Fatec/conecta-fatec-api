import { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

import { ProjectController } from "./ProjectController";

describe("ProjectController", () => {
  it("should create a project parsing deadline", async () => {
    const deadline = new Date("2026-06-30T00:00:00.000Z");
    const createProject = {
      execute: vi.fn().mockResolvedValue({
        id: "project-id",
        title: "Campus Mobility Platform",
        description: "Build a prototype",
        deadline,
        status: "ACTIVE",
        attachments: "brief",
        courseId: "course-id",
        proposalId: "proposal-id",
        selectedFeedbackId: undefined,
      }),
    };
    const listProjects = { execute: vi.fn() };
    const controller = new ProjectController(createProject, listProjects);
    const req = {
      body: {
        title: "Campus Mobility Platform",
        description: "Build a prototype",
        deadline: deadline.toISOString(),
        status: "ACTIVE",
        attachments: "brief",
        courseId: "course-id",
        proposalId: "proposal-id",
      },
    } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await controller.create(req, res);

    expect(createProject.execute).toHaveBeenCalledWith({
      title: "Campus Mobility Platform",
      description: "Build a prototype",
      deadline,
      status: "ACTIVE",
      attachments: "brief",
      courseId: "course-id",
      proposalId: "proposal-id",
      selectedFeedbackId: undefined,
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
