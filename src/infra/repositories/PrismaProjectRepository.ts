import { Project } from "@/domain/models/Project";
import {
  CreateProjectParams,
  ProjectRepository,
} from "@/domain/repositories/ProjectRepository";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";
import { getPrismaClient } from "@/infra/database/prisma/client";
import { getPagination, toPaginated } from "@/infra/repositories/pagination";

type ProjectRecord = {
  id: string;
  title: string;
  description: string;
  deadline: Date | null;
  status: string;
  attachments: string | null;
  courseId: string;
  proposalId: string;
  selectedFeedbackId: string | null;
};

type PrismaClientLike = {
  project: {
    create(args: {
      data: {
        title: string;
        description: string;
        deadline?: Date;
        status: string;
        attachments?: string;
        course: { connect: { id: string } };
        proposal: { connect: { id: string } };
        selectedFeedback?: { connect: { id: string } };
      };
    }): Promise<ProjectRecord>;
    findMany(args: {
      skip: number;
      take: number;
      orderBy: { deadline: "desc" };
    }): Promise<ProjectRecord[]>;
    count(): Promise<number>;
  };
};

const mapProject = (project: ProjectRecord): Project => ({
  id: project.id,
  title: project.title,
  description: project.description,
  deadline: project.deadline ?? undefined,
  status: project.status,
  attachments: project.attachments ?? undefined,
  courseId: project.courseId,
  proposalId: project.proposalId,
  selectedFeedbackId: project.selectedFeedbackId ?? undefined,
});

export class PrismaProjectRepository implements ProjectRepository {
  constructor(
    private readonly db: PrismaClientLike = getPrismaClient() as unknown as PrismaClientLike,
  ) {}

  async create(data: CreateProjectParams): Promise<Project> {
    const project = await this.db.project.create({
      data: {
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        status: data.status,
        attachments: data.attachments,
        course: { connect: { id: data.courseId } },
        proposal: { connect: { id: data.proposalId } },
        ...(data.selectedFeedbackId
          ? { selectedFeedback: { connect: { id: data.selectedFeedbackId } } }
          : {}),
      },
    });

    return mapProject(project);
  }

  async findPaginated(params: ListParams): Promise<Paginated<Project>> {
    const [totalItems, projects] = await Promise.all([
      this.db.project.count(),
      this.db.project.findMany({
        ...getPagination(params),
        orderBy: { deadline: "desc" },
      }),
    ]);

    return toPaginated(projects.map(mapProject), params, totalItems);
  }
}
