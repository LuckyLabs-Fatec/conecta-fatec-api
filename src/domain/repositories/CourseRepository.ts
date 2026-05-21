import { Course } from "@/domain/models/Course";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";

export type CreateCourseParams = {
  name: string;
  description?: string;
};

export type UpdateCourseParams = {
  name?: string;
  description?: string;
};

export interface CourseRepository {
  create(data: CreateCourseParams): Promise<Course>;
  update(id: string, data: UpdateCourseParams): Promise<Course>;
  delete(id: string): Promise<void>;
  findPaginated(params: ListParams): Promise<Paginated<Course>>;
}
