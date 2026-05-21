import { ProjectStudent } from "@/domain/models/ProjectStudent";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";

export type CreateProjectStudentParams = {
  projectId: string;
  userId: string;
};

export type UpdateProjectStudentParams = {
  projectId?: string;
  userId?: string;
};

export interface ProjectStudentRepository {
  create(data: CreateProjectStudentParams): Promise<ProjectStudent>;
  update(id: string, data: UpdateProjectStudentParams): Promise<ProjectStudent>;
  delete(id: string): Promise<void>;
  findPaginated(params: ListParams): Promise<Paginated<ProjectStudent>>;
}
