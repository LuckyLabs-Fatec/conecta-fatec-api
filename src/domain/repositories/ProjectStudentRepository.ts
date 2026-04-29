import { ProjectStudent } from "@/domain/models/ProjectStudent";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";

export type CreateProjectStudentParams = {
  projectId: string;
  userId: string;
};

export interface ProjectStudentRepository {
  create(data: CreateProjectStudentParams): Promise<ProjectStudent>;
  findPaginated(params: ListParams): Promise<Paginated<ProjectStudent>>;
}
