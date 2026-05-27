import { Request, Response } from "express";

import { Paginated } from "@/domain/repositories/Pagination";
import { ProjectStudent } from "@/domain/models/ProjectStudent";
import { parsePaginationQuery, requireFields } from "@/presentation/controllers/ControllerHelpers";
import { HttpErrorMapper } from "@/presentation/mappers/HttpErrorMapper";

export type CreateProjectStudentRequest = {
  projectId: string;
  userId: string;
};

export type UpdateProjectStudentRequest = {
  projectId?: string;
  userId?: string;
};

type CreateProjectStudentContract = {
  execute(data: CreateProjectStudentRequest): Promise<ProjectStudent>;
};

type UpdateProjectStudentContract = {
  execute(id: string, data: UpdateProjectStudentRequest): Promise<ProjectStudent>;
};

type DeleteProjectStudentContract = {
  execute(id: string): Promise<void>;
};

type ListProjectStudentsContract = {
  execute(params: { page: number; limit: number }): Promise<Paginated<ProjectStudent>>;
};

export class ProjectStudentController {
  constructor(
    private readonly createProjectStudent: CreateProjectStudentContract,
    private readonly listProjectStudents: ListProjectStudentsContract,
    private readonly updateProjectStudent?: UpdateProjectStudentContract,
    private readonly deleteProjectStudent?: DeleteProjectStudentContract,
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

  async update(req: Request, res: Response): Promise<void> {
    if (!this.updateProjectStudent) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    try {
      const id = req.params.id as string;
      const { projectId, userId } = req.body ?? {};

      const projectStudent = await this.updateProjectStudent.execute(id, { projectId, userId });
      res.status(200).json(projectStudent);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    if (!this.deleteProjectStudent) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    try {
      const id = req.params.id as string;
      await this.deleteProjectStudent.execute(id);
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
      const projectStudents = await this.listProjectStudents.execute(params);
      res.status(200).json(projectStudents);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }
}
