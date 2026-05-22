import { Course } from "@/domain/models/Course";
import {
  CourseRepository,
  CreateCourseParams,
  UpdateCourseParams,
} from "@/domain/repositories/CourseRepository";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";
import { getPrismaClient } from "@/infra/database/prisma/client";
import { getPagination, toPaginated } from "@/infra/repositories/pagination";

type CourseRecord = {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
};

type PrismaClientLike = {
  course: {
    create(args: { data: CreateCourseParams }): Promise<CourseRecord>;
    update(args: {
      where: { id: string };
      data: { name?: string; description?: string; active?: boolean };
    }): Promise<CourseRecord>;
    findMany(args: {
      skip: number;
      take: number;
      orderBy: { name: "asc" };
      where: { active: boolean };
    }): Promise<CourseRecord[]>;
    count(args: { where: { active: boolean } }): Promise<number>;
  };
};

const mapCourse = (course: CourseRecord): Course => ({
  id: course.id,
  name: course.name,
  description: course.description ?? undefined,
  active: course.active,
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

  async update(id: string, data: UpdateCourseParams): Promise<Course> {
    const course = await this.db.course.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return mapCourse(course);
  }

  async delete(id: string): Promise<void> {
    await this.db.course.update({
      where: { id },
      data: { active: false },
    });
  }

  async findPaginated(params: ListParams): Promise<Paginated<Course>> {
    const where = { active: true };

    const [totalItems, courses] = await Promise.all([
      this.db.course.count({ where }),
      this.db.course.findMany({
        ...getPagination(params),
        orderBy: { name: "asc" },
        where,
      }),
    ]);

    return toPaginated(courses.map(mapCourse), params, totalItems);
  }
}
