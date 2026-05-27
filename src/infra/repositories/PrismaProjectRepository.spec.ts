import { describe, expect, it, vi } from "vitest";

import { PrismaProjectRepository } from "./PrismaProjectRepository";

describe("PrismaProjectRepository", () => {
  it("should create and return mapped project", async () => {
    const deadline = new Date("2026-06-30T00:00:00.000Z");
    const create = vi.fn().mockResolvedValue({
      id: "project-id",
      title: "Campus Mobility Platform",
      description: "Build a prototype",
      deadline,
      status: "ACTIVE",
      attachments: "brief",
      active: true,
      courseId: "course-id",
      proposalId: "proposal-id",
      selectedFeedbackId: null,
    });

    const sut = new PrismaProjectRepository({
      project: { create, findMany: vi.fn(), count: vi.fn(), update: vi.fn() },
    });

    const project = await sut.create({
      title: "Campus Mobility Platform",
      description: "Build a prototype",
      deadline,
      status: "ACTIVE",
      attachments: "brief",
      courseId: "course-id",
      proposalId: "proposal-id",
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        title: "Campus Mobility Platform",
        description: "Build a prototype",
        deadline,
        status: "ACTIVE",
        attachments: "brief",
        course: { connect: { id: "course-id" } },
        proposal: { connect: { id: "proposal-id" } },
      },
    });
    expect(project).toEqual({
      id: "project-id",
      title: "Campus Mobility Platform",
      description: "Build a prototype",
      deadline,
      status: "ACTIVE",
      attachments: "brief",
      active: true,
      courseId: "course-id",
      proposalId: "proposal-id",
      selectedFeedbackId: undefined,
    });
  });

  it("should create project with selectedFeedbackId when provided", async () => {
    const deadline = new Date("2026-06-30T00:00:00.000Z");
    const create = vi.fn().mockResolvedValue({
      id: "project-id",
      title: "Campus Mobility Platform",
      description: "Build a prototype",
      deadline,
      status: "ACTIVE",
      attachments: "brief",
      active: true,
      courseId: "course-id",
      proposalId: "proposal-id",
      selectedFeedbackId: "feedback-id",
    });

    const sut = new PrismaProjectRepository({
      project: { create, findMany: vi.fn(), count: vi.fn(), update: vi.fn() },
    });

    const project = await sut.create({
      title: "Campus Mobility Platform",
      description: "Build a prototype",
      deadline,
      status: "ACTIVE",
      attachments: "brief",
      courseId: "course-id",
      proposalId: "proposal-id",
      selectedFeedbackId: "feedback-id",
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        title: "Campus Mobility Platform",
        description: "Build a prototype",
        deadline,
        status: "ACTIVE",
        attachments: "brief",
        course: { connect: { id: "course-id" } },
        proposal: { connect: { id: "proposal-id" } },
        selectedFeedback: { connect: { id: "feedback-id" } },
      },
    });
    expect(project.selectedFeedbackId).toBe("feedback-id");
  });

  it("should find paginated projects", async () => {
    const deadline = new Date("2026-06-30T00:00:00.000Z");
    const projects = [
      {
        id: "project-id-1",
        title: "Project 1",
        description: "Description 1",
        deadline,
        status: "ACTIVE",
        attachments: "brief1",
        courseId: "course-id",
        proposalId: "proposal-id-1",
        selectedFeedbackId: null,
      },
      {
        id: "project-id-2",
        title: "Project 2",
        description: "Description 2",
        deadline,
        status: "ACTIVE",
        attachments: "brief2",
        courseId: "course-id",
        proposalId: "proposal-id-2",
        selectedFeedbackId: null,
      },
    ];

    const findMany = vi.fn().mockResolvedValue(projects);
    const count = vi.fn().mockResolvedValue(2);

    const sut = new PrismaProjectRepository({
      project: { create: vi.fn(), findMany, count, update: vi.fn() },
    });

    const result = await sut.findPaginated({ page: 1, limit: 10 });

    expect(count).toHaveBeenCalled();
    expect(findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      orderBy: { deadline: "desc" },
      where: { active: true },
    });
    expect(result.items).toHaveLength(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalItems).toBe(2);
  });

  it("should find paginated projects on second page", async () => {
    const deadline = new Date("2026-06-30T00:00:00.000Z");
    const projects = [
      {
        id: "project-id-3",
        title: "Project 3",
        description: "Description 3",
        deadline,
        status: "ACTIVE",
        attachments: "brief3",
        courseId: "course-id",
        proposalId: "proposal-id-3",
        selectedFeedbackId: null,
      },
    ];

    const findMany = vi.fn().mockResolvedValue(projects);
    const count = vi.fn().mockResolvedValue(15);

    const sut = new PrismaProjectRepository({
      project: { create: vi.fn(), findMany, count, update: vi.fn() },
    });

    const result = await sut.findPaginated({ page: 2, limit: 10 });

    expect(findMany).toHaveBeenCalledWith({
      skip: 10,
      take: 10,
      orderBy: { deadline: "desc" },
      where: { active: true },
    });
    expect(result.items).toHaveLength(1);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.totalItems).toBe(15);
  });

  it("should handle projects with null deadline, attachments and selectedFeedbackId", async () => {
    const projects = [
      {
        id: "project-id-4",
        title: "Project 4",
        description: "Description 4",
        deadline: null,
        status: "PENDING",
        attachments: null,
        active: true,
        courseId: "course-id",
        proposalId: "proposal-id-4",
        selectedFeedbackId: null,
      },
    ];

    const findMany = vi.fn().mockResolvedValue(projects);
    const count = vi.fn().mockResolvedValue(1);

    const sut = new PrismaProjectRepository({
      project: { create: vi.fn(), findMany, count, update: vi.fn() },
    });

    const result = await sut.findPaginated({ page: 1, limit: 10 });

    expect(result.items[0]).toEqual({
      id: "project-id-4",
      title: "Project 4",
      description: "Description 4",
      deadline: undefined,
      status: "PENDING",
      attachments: undefined,
      active: true,
      courseId: "course-id",
      proposalId: "proposal-id-4",
      selectedFeedbackId: undefined,
    });
  });
});
