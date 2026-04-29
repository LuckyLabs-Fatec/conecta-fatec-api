import { Course } from "@/domain/models/Course";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";

export type CreateCourseParams = {
  name: string;
  description?: string;
};

export interface CourseRepository {
  create(data: CreateCourseParams): Promise<Course>;
  findPaginated(params: ListParams): Promise<Paginated<Course>>;
}
