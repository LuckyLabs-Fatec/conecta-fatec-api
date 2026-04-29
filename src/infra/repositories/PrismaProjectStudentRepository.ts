import { ProjectStudent } from "@/domain/models/ProjectStudent";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";
import {
  CreateProjectStudentParams,
  ProjectStudentRepository,
} from "@/domain/repositories/ProjectStudentRepository";
import { getPrismaClient } from "@/infra/database/prisma/client";
import { getPagination, toPaginated } from "@/infra/repositories/pagination";

type ProjectStudentRecord = {
  id: string;
  projectId: string;
  userId: string;
};

type PrismaClientLike = {
  projectStudent: {
    create(args: {
      data: {
        project: { connect: { id: string } };
        user: { connect: { id: string } };
      };
    }): Promise<ProjectStudentRecord>;
    findMany(args: {
      skip: number;
      take: number;
      orderBy: { id: "asc" };
    }): Promise<ProjectStudentRecord[]>;
    count(): Promise<number>;
  };
};

const mapProjectStudent = (projectStudent: ProjectStudentRecord): ProjectStudent => ({
  id: projectStudent.id,
  projectId: projectStudent.projectId,
  userId: projectStudent.userId,
});

export class PrismaProjectStudentRepository implements ProjectStudentRepository {
  constructor(
    private readonly db: PrismaClientLike = getPrismaClient() as unknown as PrismaClientLike,
  ) {}

  async create(data: CreateProjectStudentParams): Promise<ProjectStudent> {
    const projectStudent = await this.db.projectStudent.create({
      data: {
        project: { connect: { id: data.projectId } },
        user: { connect: { id: data.userId } },
      },
    });

    return mapProjectStudent(projectStudent);
  }

  async findPaginated(params: ListParams): Promise<Paginated<ProjectStudent>> {
    const [totalItems, projectStudents] = await Promise.all([
      this.db.projectStudent.count(),
      this.db.projectStudent.findMany({
        ...getPagination(params),
        orderBy: { id: "asc" },
      }),
    ]);

    return toPaginated(projectStudents.map(mapProjectStudent), params, totalItems);
  }
}
