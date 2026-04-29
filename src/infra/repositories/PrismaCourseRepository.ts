import { Course } from "@/domain/models/Course";
import {
  CourseRepository,
  CreateCourseParams,
} from "@/domain/repositories/CourseRepository";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";
import { getPrismaClient } from "@/infra/database/prisma/client";
import { getPagination, toPaginated } from "@/infra/repositories/pagination";

type CourseRecord = {
  id: string;
  name: string;
  description: string | null;
};

type PrismaClientLike = {
  course: {
    create(args: { data: CreateCourseParams }): Promise<CourseRecord>;
    findMany(args: {
      skip: number;
      take: number;
      orderBy: { name: "asc" };
    }): Promise<CourseRecord[]>;
    count(): Promise<number>;
  };
};

const mapCourse = (course: CourseRecord): Course => ({
  id: course.id,
  name: course.name,
  description: course.description ?? undefined,
});

export class PrismaCourseRepository implements CourseRepository {
  constructor(
    private readonly db: PrismaClientLike = getPrismaClient() as unknown as PrismaClientLike,
  ) {}

  async create(data: CreateCourseParams): Promise<Course> {
    const course = await this.db.course.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return mapCourse(course);
  }

  async findPaginated(params: ListParams): Promise<Paginated<Course>> {
    const [totalItems, courses] = await Promise.all([
      this.db.course.count(),
      this.db.course.findMany({
        ...getPagination(params),
        orderBy: { name: "asc" },
      }),
    ]);

    return toPaginated(courses.map(mapCourse), params, totalItems);
  }
}
