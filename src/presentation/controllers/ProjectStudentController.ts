import { Request, Response } from "express";

import { Paginated } from "@/domain/repositories/Pagination";
import { ProjectStudent } from "@/domain/models/ProjectStudent";
import { parsePaginationQuery, requireFields } from "@/presentation/controllers/ControllerHelpers";
import { HttpErrorMapper } from "@/presentation/mappers/HttpErrorMapper";

export type CreateProjectStudentRequest = {
  projectId: string;
  userId: string;
};

type CreateProjectStudentContract = {
  execute(data: CreateProjectStudentRequest): Promise<ProjectStudent>;
};

type ListProjectStudentsContract = {
  execute(params: { page: number; limit: number }): Promise<Paginated<ProjectStudent>>;
};

export class ProjectStudentController {
  constructor(
    private readonly createProjectStudent: CreateProjectStudentContract,
    private readonly listProjectStudents: ListProjectStudentsContract,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { projectId, userId } = req.body ?? {};
      requireFields({ projectId, userId });

      const projectStudent = await this.createProjectStudent.execute({ projectId, userId });
      res.status(201).json(projectStudent);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const params = parsePaginationQuery(req.query);
      const projectStudents = await this.listProjectStudents.execute(params);
      res.status(200).json(projectStudents);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }
}
