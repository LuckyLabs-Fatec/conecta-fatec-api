import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { UserRole } from "@prisma/client";

import { prisma } from "@/test/integration/database";

let sequence = 0;

export type TestUser = Awaited<ReturnType<typeof createUser>>;

export function uniqueEmail(prefix: string): string {
  sequence += 1;
  return `${prefix}.${sequence}@example.com`;
}

export async function createUser(role: UserRole = UserRole.SOCIETY) {
  const password = "Password123";
  const user = await prisma.user.create({
    data: {
      email: uniqueEmail(role.toLowerCase()),
      passwordHash: await hash(password, 8),
      name: `${role} User`,
      phone: "11999999999",
      phoneIsWhats: true,
      role,
      active: true,
    },
  });

  return { ...user, password };
}

export function makeToken(user: { id: string; email: string; role: UserRole }): string {
  return sign(
    {
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET ?? "test-secret",
    {
      subject: user.id,
      expiresIn: "1h",
    },
  );
}

export async function createCourse() {
  return prisma.course.create({
    data: {
      name: `Course ${sequence + 1}`,
      description: "Course description",
    },
  });
}

export async function createProposal(createdByUserId?: string) {
  const user = createdByUserId ? undefined : await createUser(UserRole.SOCIETY);

  return prisma.proposal.create({
    data: {
      title: `Proposal ${sequence + 1}`,
      description: "Proposal description",
      submissionDate: new Date("2026-05-20T12:00:00.000Z"),
      status: "submitted",
      attachments: Buffer.from("proposal-file"),
      optionalContactPhone: "11888888888",
      optionalContactPhoneIsWhats: false,
      optionalContactEmail: "proposal@example.com",
      createdByUserId: createdByUserId ?? user!.id,
    },
  });
}

export async function createProject() {
  const course = await createCourse();
  const proposal = await createProposal();

  return prisma.project.create({
    data: {
      title: `Project ${sequence + 1}`,
      description: "Project description",
      deadline: new Date("2026-06-20T12:00:00.000Z"),
      status: "open",
      attachments: "project-file",
      courseId: course.id,
      proposalId: proposal.id,
    },
  });
}

export async function createFeedback() {
  const student = await createUser(UserRole.STUDENT);
  const project = await createProject();

  return prisma.feedback.create({
    data: {
      comment: "Feedback comment",
      attachments: "feedback-file",
      userId: student.id,
      projectId: project.id,
    },
  });
}

export async function createNotification(userId?: string) {
  const user = userId ? undefined : await createUser(UserRole.STUDENT);

  return prisma.notification.create({
    data: {
      message: "Notification message",
      userId: userId ?? user!.id,
    },
  });
}

export async function createProjectStudent() {
  const student = await createUser(UserRole.STUDENT);
  const project = await createProject();

  return prisma.projectStudent.create({
    data: {
      userId: student.id,
      projectId: project.id,
    },
  });
}
