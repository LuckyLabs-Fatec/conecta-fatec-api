import { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

import { CourseController } from "./CourseController";

describe("CourseController", () => {
  it("should create a course", async () => {
    const createCourse = {
      execute: vi.fn().mockResolvedValue({
        id: "course-id",
        name: "Systems Analysis",
        description: "Technology projects",
      }),
    };
    const listCourses = { execute: vi.fn() };
    const controller = new CourseController(createCourse, listCourses);
    const req = {
      body: {
        name: "Systems Analysis",
        description: "Technology projects",
      },
    } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await controller.create(req, res);

    expect(createCourse.execute).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: "course-id",
      name: "Systems Analysis",
      description: "Technology projects",
    });
  });

  it("should list courses with default pagination", async () => {
    const createCourse = { execute: vi.fn() };
    const listCourses = {
      execute: vi.fn().mockResolvedValue({
        items: [],
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1,
      }),
    };
    const controller = new CourseController(createCourse, listCourses);
    const req = { query: {} } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await controller.list(req, res);

    expect(listCourses.execute).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 400 when name is missing in create request", async () => {
    const createCourse = { execute: vi.fn() };
    const listCourses = { execute: vi.fn() };
    const controller = new CourseController(createCourse, listCourses);
    const req = {
      body: {
        description: "Technology projects",
      },
    } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing required fields",
    });
  });

  it("should return 400 when body is undefined", async () => {
    const createCourse = { execute: vi.fn() };
    const listCourses = { execute: vi.fn() };
    const controller = new CourseController(createCourse, listCourses);
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing required fields",
    });
  });

  it("should return 500 on unexpected error during create", async () => {
    const createCourse = {
      execute: vi.fn().mockRejectedValue(new Error("Database error")),
    };
    const listCourses = { execute: vi.fn() };
    const controller = new CourseController(createCourse, listCourses);
    const req = {
      body: {
        name: "Systems Analysis",
      },
    } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Database error",
    });
  });

  it("should return 500 on unexpected error during list", async () => {
    const createCourse = { execute: vi.fn() };
    const listCourses = {
      execute: vi.fn().mockRejectedValue(new Error("Database error")),
    };
    const controller = new CourseController(createCourse, listCourses);
    const req = { query: {} } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await controller.list(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
