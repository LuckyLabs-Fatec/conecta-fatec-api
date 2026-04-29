import { describe, expect, it, vi } from "vitest";

import { PrismaCourseRepository } from "./PrismaCourseRepository";

describe("PrismaCourseRepository", () => {
  it("should create and return mapped course", async () => {
    const create = vi.fn().mockResolvedValue({
      id: "course-id",
      name: "Systems Analysis",
      description: "Technology projects",
    });

    const sut = new PrismaCourseRepository({
      course: { create, findMany: vi.fn(), count: vi.fn() },
    });

    const course = await sut.create({
      name: "Systems Analysis",
      description: "Technology projects",
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        name: "Systems Analysis",
        description: "Technology projects",
      },
    });
    expect(course).toEqual({
      id: "course-id",
      name: "Systems Analysis",
      description: "Technology projects",
    });
  });

  it("should find paginated courses", async () => {
    const findMany = vi.fn().mockResolvedValue([
      { id: "course-id", name: "Systems Analysis", description: null },
    ]);

    const sut = new PrismaCourseRepository({
      course: { create: vi.fn(), findMany, count: vi.fn().mockResolvedValue(1) },
    });

    const paginated = await sut.findPaginated({ page: 1, limit: 10 });

    expect(findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      orderBy: { name: "asc" },
    });
    expect(paginated).toEqual({
      items: [{ id: "course-id", name: "Systems Analysis", description: undefined }],
      page: 1,
      limit: 10,
      totalItems: 1,
      totalPages: 1,
    });
  });
});
