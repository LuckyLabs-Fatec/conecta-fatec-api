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
      courseId: "course-id",
      proposalId: "proposal-id",
      selectedFeedbackId: null,
    });

    const sut = new PrismaProjectRepository({
      project: { create, findMany: vi.fn(), count: vi.fn() },
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
      courseId: "course-id",
      proposalId: "proposal-id",
      selectedFeedbackId: undefined,
    });
  });
});
