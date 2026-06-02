import { Project } from "@/domain/models/Project";
import { ProjectStatus } from "@/domain/models/Status";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";

export type CreateProjectParams = {
  title: string;
  description: string;
  deadline?: Date;
  status: ProjectStatus;
  attachments?: string;
  courseId: string;
  proposalId: string;
  selectedFeedbackId?: string;
};

export type UpdateProjectParams = {
  title?: string;
  description?: string;
  deadline?: Date;
  status?: ProjectStatus;
  attachments?: string;
  courseId?: string;
  proposalId?: string;
  selectedFeedbackId?: string;
};

export interface ProjectRepository {
  create(data: CreateProjectParams): Promise<Project>;
  update(id: string, data: UpdateProjectParams): Promise<Project>;
  delete(id: string): Promise<void>;
  findPaginated(params: ListParams): Promise<Paginated<Project>>;
}
