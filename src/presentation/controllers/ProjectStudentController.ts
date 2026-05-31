import { Request, Response } from "express";

import { Paginated } from "@/domain/repositories/Pagination";
import { ProjectAssignment, ProjectStudent } from "@/domain/models/ProjectStudent";
import { parsePaginationQuery, requireFields } from "@/presentation/controllers/ControllerHelpers";
import { HttpErrorMapper } from "@/presentation/mappers/HttpErrorMapper";
import { getAuthenticatedUser } from "@/presentation/http/AuthenticatedRequest";

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

type AssignProjectGroupContract = {
  execute(data: { projectId: string; studentIds: string[]; groupName?: string }): Promise<ProjectStudent[]>;
};

type FindAssignmentsContract = {
  execute(userId: string): Promise<ProjectAssignment[]>;
};

type FindStudentsContract = {
  execute(search?: string): Promise<Array<{ id: string; name?: string; email: string }>>;
};

export class ProjectStudentController {
  constructor(
    private readonly createProjectStudent: CreateProjectStudentContract,
    private readonly listProjectStudents: ListProjectStudentsContract,
    private readonly updateProjectStudent?: UpdateProjectStudentContract,
    private readonly deleteProjectStudent?: DeleteProjectStudentContract,
    private readonly assignProjectGroup?: AssignProjectGroupContract,
    private readonly findAssignmentsByStudentId?: FindAssignmentsContract,
    private readonly findStudents?: FindStudentsContract,
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

  async assign(req: Request, res: Response): Promise<void> {
    if (!this.assignProjectGroup) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    try {
      const { projectId, groupName, studentIds } = req.body ?? {};
      requireFields({ projectId, studentIds });

      const assignments = await this.assignProjectGroup.execute({ projectId, groupName, studentIds });
      res.status(201).json({ projectId, groupName, assignments });
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({ message: HttpErrorMapper.getMessage(error) });
    }
  }

  async listMyAssignments(req: Request, res: Response): Promise<void> {
    if (!this.findAssignmentsByStudentId) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    try {
      const userId = getAuthenticatedUser(req)?.userId;
      if (!userId) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const assignments = await this.findAssignmentsByStudentId.execute(userId);
      res.status(200).json(assignments);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({ message: HttpErrorMapper.getMessage(error) });
    }
  }

  async listStudents(req: Request, res: Response): Promise<void> {
    if (!this.findStudents) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    try {
      const search = req.query.search as string | undefined;
      const students = await this.findStudents.execute(search);
      res.status(200).json(students);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({ message: HttpErrorMapper.getMessage(error) });
    }
  }
}
