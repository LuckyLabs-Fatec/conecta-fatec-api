import { ProjectStatus as PrismaProjectStatus } from "@prisma/client";

import { Project } from "@/domain/models/Project";
import { ProjectStatus } from "@/domain/models/Status";
import {
  CreateProjectParams,
  ProjectRepository,
  UpdateProjectParams,
} from "@/domain/repositories/ProjectRepository";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";
import { getPrismaClient } from "@/infra/database/prisma/client";
import { getPagination, toPaginated } from "@/infra/repositories/pagination";

type ProjectRecord = {
  id: string;
  title: string;
  description: string;
  deadline: Date | null;
  status: PrismaProjectStatus;
  attachments: string | null;
  active: boolean;
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
        status: PrismaProjectStatus;
        attachments?: string;
        course: { connect: { id: string } };
        proposal: { connect: { id: string } };
        selectedFeedback?: { connect: { id: string } };
      };
    }): Promise<ProjectRecord>;
    update(args: {
      where: { id: string };
      data: {
        title?: string;
        description?: string;
        deadline?: Date;
        status?: PrismaProjectStatus;
        attachments?: string;
        active?: boolean;
        course?: { connect: { id: string } };
        proposal?: { connect: { id: string } };
        selectedFeedback?: { connect: { id: string } } | { disconnect: true };
      };
    }): Promise<ProjectRecord>;
    findMany(args: {
      skip: number;
      take: number;
      orderBy: { deadline: "desc" };
      where: { active: boolean };
    }): Promise<ProjectRecord[]>;
    count(args: { where: { active: boolean } }): Promise<number>;
  };
};

const mapProject = (project: ProjectRecord): Project => ({
  id: project.id,
  title: project.title,
  description: project.description,
  deadline: project.deadline ?? undefined,
  status: project.status as ProjectStatus,
  attachments: project.attachments ?? undefined,
  active: project.active,
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
        status: data.status as PrismaProjectStatus,
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

  async update(id: string, data: UpdateProjectParams): Promise<Project> {
    const updateData: Parameters<PrismaClientLike["project"]["update"]>[0]["data"] = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.deadline !== undefined) updateData.deadline = data.deadline;
    if (data.status !== undefined) updateData.status = data.status as PrismaProjectStatus;
    if (data.attachments !== undefined) updateData.attachments = data.attachments;
    if (data.courseId !== undefined) updateData.course = { connect: { id: data.courseId } };
    if (data.proposalId !== undefined) updateData.proposal = { connect: { id: data.proposalId } };
    if (data.selectedFeedbackId !== undefined) {
      updateData.selectedFeedback = data.selectedFeedbackId
        ? { connect: { id: data.selectedFeedbackId } }
        : { disconnect: true };
    }

    const project = await this.db.project.update({ where: { id }, data: updateData });

    return mapProject(project);
  }

  async delete(id: string): Promise<void> {
    await this.db.project.update({
      where: { id },
      data: { active: false },
    });
  }

  async findPaginated(params: ListParams): Promise<Paginated<Project>> {
    const where = { active: true };

    const [totalItems, projects] = await Promise.all([
      this.db.project.count({ where }),
      this.db.project.findMany({
        ...getPagination(params),
        orderBy: { deadline: "desc" },
        where,
      }),
    ]);

    return toPaginated(projects.map(mapProject), params, totalItems);
  }
}
