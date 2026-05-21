import { ProjectStudent } from "@/domain/models/ProjectStudent";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";
import {
  CreateProjectStudentParams,
  ProjectStudentRepository,
  UpdateProjectStudentParams,
} from "@/domain/repositories/ProjectStudentRepository";
import { getPrismaClient } from "@/infra/database/prisma/client";
import { getPagination, toPaginated } from "@/infra/repositories/pagination";

type ProjectStudentRecord = {
  id: string;
  projectId: string;
  userId: string;
  active: boolean;
};

type PrismaClientLike = {
  projectStudent: {
    create(args: {
      data: {
        project: { connect: { id: string } };
        user: { connect: { id: string } };
      };
    }): Promise<ProjectStudentRecord>;
    update(args: {
      where: { id: string };
      data: {
        active?: boolean;
        project?: { connect: { id: string } };
        user?: { connect: { id: string } };
      };
    }): Promise<ProjectStudentRecord>;
    findMany(args: {
      skip: number;
      take: number;
      orderBy: { id: "asc" };
      where: { active: boolean };
    }): Promise<ProjectStudentRecord[]>;
    count(args: { where: { active: boolean } }): Promise<number>;
  };
};

const mapProjectStudent = (projectStudent: ProjectStudentRecord): ProjectStudent => ({
  id: projectStudent.id,
  projectId: projectStudent.projectId,
  userId: projectStudent.userId,
  active: projectStudent.active,
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

  async update(id: string, data: UpdateProjectStudentParams): Promise<ProjectStudent> {
    const updateData: Parameters<PrismaClientLike["projectStudent"]["update"]>[0]["data"] = {};

    if (data.projectId !== undefined) updateData.project = { connect: { id: data.projectId } };
    if (data.userId !== undefined) updateData.user = { connect: { id: data.userId } };

    const projectStudent = await this.db.projectStudent.update({
      where: { id },
      data: updateData,
    });

    return mapProjectStudent(projectStudent);
  }

  async delete(id: string): Promise<void> {
    await this.db.projectStudent.update({
      where: { id },
      data: { active: false },
    });
  }

  async findPaginated(params: ListParams): Promise<Paginated<ProjectStudent>> {
    const where = { active: true };

    const [totalItems, projectStudents] = await Promise.all([
      this.db.projectStudent.count({ where }),
      this.db.projectStudent.findMany({
        ...getPagination(params),
        orderBy: { id: "asc" },
        where,
      }),
    ]);

    return toPaginated(projectStudents.map(mapProjectStudent), params, totalItems);
  }
}
