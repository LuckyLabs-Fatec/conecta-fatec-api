import { Request, Response } from "express";

import { Project } from "@/domain/models/Project";
import { Paginated } from "@/domain/repositories/Pagination";
import {
  parseOptionalDate,
  parsePaginationQuery,
  requireFields,
} from "@/presentation/controllers/ControllerHelpers";
import { HttpErrorMapper } from "@/presentation/mappers/HttpErrorMapper";

export type CreateProjectRequest = {
  title: string;
  description: string;
  deadline?: Date;
  status: string;
  attachments?: string;
  courseId: string;
  proposalId: string;
  selectedFeedbackId?: string;
};

type CreateProjectContract = {
  execute(data: CreateProjectRequest): Promise<Project>;
};

type ListProjectsContract = {
  execute(params: { page: number; limit: number }): Promise<Paginated<Project>>;
};

export class ProjectController {
  constructor(
    private readonly createProject: CreateProjectContract,
    private readonly listProjects: ListProjectsContract,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        title,
        description,
        deadline,
        status,
        attachments,
        courseId,
        proposalId,
        selectedFeedbackId,
      } = req.body ?? {};

      requireFields({ title, description, status, courseId, proposalId });

      const project = await this.createProject.execute({
        title,
        description,
        deadline: parseOptionalDate(deadline, "deadline"),
        status,
        attachments,
        courseId,
        proposalId,
        selectedFeedbackId,
      });

      res.status(201).json(project);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const params = parsePaginationQuery(req.query);
      const projects = await this.listProjects.execute(params);
      res.status(200).json(projects);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }
}
