import { ProjectAssignment, ProjectStudent, StudentSummary } from "@/domain/models/ProjectStudent";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";
import { AssignProjectGroupParams, CreateProjectStudentParams, ProjectStudentRepository, UpdateProjectStudentParams } from "@/domain/repositories/ProjectStudentRepository";
import { getPrismaClient } from "@/infra/database/prisma/client";
import { getPagination, toPaginated } from "@/infra/repositories/pagination";

type ProjectStudentRecord = {
  id: string;
  projectId: string;
  userId: string;
  groupName: string | null;
};

type AssignmentProjectRecord = {
  id: string;
  title: string;
  description: string;
  status: string;
  students: Array<{
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  }>;
};

type AssignmentRecord = {
  projectId: string;
  groupName: string | null;
  project: AssignmentProjectRecord;
};

type PrismaClientLike = {
  projectStudent: {
    create(args: {
      data: {
        project: { connect: { id: string } };
        user: { connect: { id: string } };
        groupName?: string;
      };
    }): Promise<ProjectStudentRecord>;
    update(args: {
      where: { projectId_userId: { projectId: string; userId: string } } | { id: string };
      data: {
        groupName?: string;
        project?: { connect: { id: string } };
        user?: { connect: { id: string } };
      };
    }): Promise<ProjectStudentRecord>;
    delete(args: {
      where: { id: string };
    }): Promise<ProjectStudentRecord>;
    findMany(args: {
      skip?: number;
      take?: number;
      orderBy?: { id: "asc" } | { project: { title: "asc" } };
      where?: {
        userId?: string;
      };
      include?: {
        project: {
          include: {
            students: {
              include: {
                user: {
                  select: {
                    id: true;
                    name: true;
                    email: true;
                  };
                };
              };
            };
          };
        };
      };
    }): Promise<ProjectStudentRecord[] | AssignmentRecord[]>;
    count(): Promise<number>;
  };
  user: {
    findMany(args: {
      where: {
        role: "STUDENT";
        active: true;
        OR?: Array<{
          name?: { contains: string; mode: "insensitive" };
          email?: { contains: string; mode: "insensitive" };
        }>;
      };
      select: {
        id: true;
        name: true;
        email: true;
      };
      orderBy: {
        name: "asc";
      };
    }): Promise<Array<{ id: string; name: string | null; email: string }>>;
  };
};

const mapProjectStudent = (projectStudent: ProjectStudentRecord): ProjectStudent => ({
  id: projectStudent.id,
  projectId: projectStudent.projectId,
  userId: projectStudent.userId,
  groupName: projectStudent.groupName ?? undefined,
});

const mapStudentSummary = (student: { id: string; name: string | null; email: string }): StudentSummary => ({
  id: student.id,
  name: student.name ?? undefined,
  email: student.email,
});

const mapProjectAssignment = (assignment: AssignmentRecord): ProjectAssignment => ({
  projectId: assignment.projectId,
  projectTitle: assignment.project.title,
  projectDescription: assignment.project.description,
  projectStatus: assignment.project.status,
  groupName: assignment.groupName ?? undefined,
  teammates: assignment.project.students.map((student) => mapStudentSummary(student.user)),
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
        groupName: data.groupName,
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
      }) as Promise<ProjectStudentRecord[]>,
    ]);

    return toPaginated(projectStudents.map(mapProjectStudent), params, totalItems);
  }

  async assignGroup(data: AssignProjectGroupParams): Promise<ProjectStudent[]> {
    const assignedStudents = await Promise.all(
      data.studentIds.map(async (studentId) => {
        // Try update first, if not found create a new relation
        try {
          return await this.db.projectStudent.update({
            where: {
              projectId_userId: { projectId: data.projectId, userId: studentId },
            },
            data: {
              groupName: data.groupName,
            },
          });
        } catch {
          // If update failed (not found), create the record
          return this.db.projectStudent.create({
            data: {
              project: { connect: { id: data.projectId } },
              user: { connect: { id: studentId } },
              groupName: data.groupName,
            },
          });
        }
      }),
    );

    return assignedStudents.map(mapProjectStudent);
  }

  async findAssignmentsByStudentId(userId: string): Promise<ProjectAssignment[]> {
    const assignments = await this.db.projectStudent.findMany({
      where: { userId },
      include: {
        project: {
          include: {
            students: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        project: {
          title: "asc",
        },
      },
    }) as AssignmentRecord[];

    return assignments.map(mapProjectAssignment);
  }

  async findStudents(search?: string): Promise<StudentSummary[]> {
    const searchTerm = search?.trim();
    const students = await this.db.user.findMany({
      where: {
        role: "STUDENT",
        active: true,
        ...(searchTerm
          ? {
              OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { email: { contains: searchTerm, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return students.map(mapStudentSummary);
  }

  async update(id: string, data: UpdateProjectStudentParams): Promise<ProjectStudent> {
    type UpdateData = Parameters<PrismaClientLike["projectStudent"]["update"]>[0]["data"];
    const updateData = {} as UpdateData;

    if (data.projectId !== undefined) updateData.project = { connect: { id: data.projectId } };
    if (data.userId !== undefined) updateData.user = { connect: { id: data.userId } };

    const projectStudent = await this.db.projectStudent.update({ where: { id }, data: updateData });

    return mapProjectStudent(projectStudent);
  }

  async delete(id: string): Promise<void> {
    await this.db.projectStudent.delete({ where: { id } });
  }
}
