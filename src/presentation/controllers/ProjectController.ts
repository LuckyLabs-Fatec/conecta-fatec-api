import { Request, Response } from "express";

import { InvalidPayloadError } from "@/domain/errors/InvalidPayloadError";
import { Project } from "@/domain/models/Project";
import { isProjectStatus, ProjectStatus } from "@/domain/models/Status";
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
  status: ProjectStatus;
  attachments?: string;
  courseId: string;
  proposalId: string;
  selectedFeedbackId?: string;
};

export type UpdateProjectRequest = {
  title?: string;
  description?: string;
  deadline?: Date;
  status?: ProjectStatus;
  attachments?: string;
  courseId?: string;
  proposalId?: string;
  selectedFeedbackId?: string;
};

type CreateProjectContract = {
  execute(data: CreateProjectRequest): Promise<Project>;
};

type UpdateProjectContract = {
  execute(id: string, data: UpdateProjectRequest): Promise<Project>;
};

type DeleteProjectContract = {
  execute(id: string): Promise<void>;
};

type ListProjectsContract = {
  execute(params: { page: number; limit: number }): Promise<Paginated<Project>>;
};

export class ProjectController {
  constructor(
    private readonly createProject: CreateProjectContract,
    private readonly listProjects: ListProjectsContract,
    private readonly updateProject?: UpdateProjectContract,
    private readonly deleteProject?: DeleteProjectContract,
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

      if (!isProjectStatus(status)) {
        throw new InvalidPayloadError("Invalid project status");
      }

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

  async update(req: Request, res: Response): Promise<void> {
    if (!this.updateProject) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    try {
      const id = req.params.id as string;
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

      if (status !== undefined && !isProjectStatus(status)) {
        throw new InvalidPayloadError("Invalid project status");
      }

      const project = await this.updateProject.execute(id, {
        title,
        description,
        deadline: deadline !== undefined ? parseOptionalDate(deadline, "deadline") : undefined,
        status,
        attachments,
        courseId,
        proposalId,
        selectedFeedbackId,
      });

      res.status(200).json(project);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    if (!this.deleteProject) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    try {
      const id = req.params.id as string;
      await this.deleteProject.execute(id);
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
      const projects = await this.listProjects.execute(params);
      res.status(200).json(projects);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }
}
