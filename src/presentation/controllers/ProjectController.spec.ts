import { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

import { ProjectController } from "./ProjectController";

import { ProjectStatus } from "@/domain/models/Status";

describe("ProjectController", () => {
  it("should create a project parsing deadline", async () => {
    const deadline = new Date("2026-06-30T00:00:00.000Z");
    const createProject = {
      execute: vi.fn().mockResolvedValue({
        id: "project-id",
        title: "Campus Mobility Platform",
        description: "Build a prototype",
        deadline,
        status: ProjectStatus.IN_DEVELOPMENT,
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
        status: ProjectStatus.IN_DEVELOPMENT,
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
      status: ProjectStatus.IN_DEVELOPMENT,
      attachments: "brief",
      courseId: "course-id",
      proposalId: "proposal-id",
      selectedFeedbackId: undefined,
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should reject an invalid project status", async () => {
    const createProject = { execute: vi.fn() };
    const listProjects = { execute: vi.fn() };
    const controller = new ProjectController(createProject, listProjects);
    const req = {
      body: {
        title: "Campus Mobility Platform",
        description: "Build a prototype",
        status: "ACTIVE",
        courseId: "course-id",
        proposalId: "proposal-id",
      },
    } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await controller.create(req, res);

    expect(createProject.execute).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should reject an invalid project status on update", async () => {
    const updateProject = { execute: vi.fn() };
    const controller = new ProjectController(
      { execute: vi.fn() },
      { execute: vi.fn() },
      updateProject,
    );
    const req = {
      params: { id: "project-id" },
      body: { status: "ACTIVE" },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await controller.update(req, res);

    expect(updateProject.execute).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
