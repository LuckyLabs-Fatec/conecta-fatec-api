import { Request, Response } from "express";

import { Course } from "@/domain/models/Course";
import { Paginated } from "@/domain/repositories/Pagination";
import { parsePaginationQuery, requireFields } from "@/presentation/controllers/ControllerHelpers";
import { HttpErrorMapper } from "@/presentation/mappers/HttpErrorMapper";

export type CreateCourseRequest = {
  name: string;
  description?: string;
};

export type UpdateCourseRequest = {
  name?: string;
  description?: string;
};

type CreateCourseContract = {
  execute(data: CreateCourseRequest): Promise<Course>;
};

type UpdateCourseContract = {
  execute(id: string, data: UpdateCourseRequest): Promise<Course>;
};

type DeleteCourseContract = {
  execute(id: string): Promise<void>;
};

type ListCoursesContract = {
  execute(params: { page: number; limit: number }): Promise<Paginated<Course>>;
};

export class CourseController {
  constructor(
    private readonly createCourse: CreateCourseContract,
    private readonly listCourses: ListCoursesContract,
    private readonly updateCourse?: UpdateCourseContract,
    private readonly deleteCourse?: DeleteCourseContract,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body ?? {};
      requireFields({ name });

      const course = await this.createCourse.execute({ name, description });
      res.status(201).json(course);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    if (!this.updateCourse) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    try {
      const id = req.params.id as string;
      const { name, description } = req.body ?? {};

      const course = await this.updateCourse.execute(id, { name, description });
      res.status(200).json(course);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    if (!this.deleteCourse) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    try {
      const id = req.params.id as string;
      await this.deleteCourse.execute(id);
      res.status(204).send();
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const params = parsePaginationQuery(req.query);
      const courses = await this.listCourses.execute(params);
      res.status(200).json(courses);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }
}
