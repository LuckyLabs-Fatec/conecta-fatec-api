import { Project } from "@/domain/models/Project";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";

export type CreateProjectParams = {
  title: string;
  description: string;
  deadline?: Date;
  status: string;
  attachments?: string;
  courseId: string;
  proposalId: string;
  selectedFeedbackId?: string;
};

export interface ProjectRepository {
  create(data: CreateProjectParams): Promise<Project>;
  findPaginated(params: ListParams): Promise<Paginated<Project>>;
}
