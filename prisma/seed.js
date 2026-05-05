import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL is not defined");
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const users = [
  {
    id: "d1111111-1111-4111-8111-111111111111",
    email: "society@example.com",
    password: "society123",
    name: "Representante da Sociedade",
    avatar: "https://cdn.conecta-fatec.com/avatars/society.png",
    phone: "11999999999",
    phoneIsWhats: true,
    role: "SOCIETY",
  },
  {
    id: "d2222222-2222-4222-8222-222222222222",
    email: "mediator@example.com",
    password: "mediator123",
    name: "Pessoa Mediadora",
    avatar: "https://cdn.conecta-fatec.com/avatars/mediator.png",
    phone: "11888888888",
    phoneIsWhats: false,
    role: "MEDIATOR",
  },
  {
    id: "d3333333-3333-4333-8333-333333333333",
    email: "student@example.com",
    password: "student123",
    name: "Estudante Exemplo",
    avatar: null,
    phone: "11777777777",
    phoneIsWhats: true,
    role: "STUDENT",
  },
];

const proposals = [
  {
    id: "1f4d3c20-7f52-4c1f-b9ef-93cd5b8db001",
    title: "Mobilidade Inteligente no Câmpus",
    description: "Uma proposta para otimizar o transporte interno e a acessibilidade no câmpus.",
    submissionDate: new Date("2026-04-20T10:00:00.000Z"),
    status: "SUBMITTED",
    attachments: Buffer.from("plano-de-mobilidade-v1", "utf-8"),
    optionalContactPhone: "11999990001",
    optionalContactPhoneIsWhats: true,
    optionalContactEmail: "mobilidade@example.com",
    createdByUserId: "d1111111-1111-4111-8111-111111111111",
  },
  {
    id: "4ac2a8f0-6e35-4c6b-8a44-c1e8a954b002",
    title: "Programa Comunitário de Reciclagem",
    description: "Uma proposta que conecta estudantes e cooperativas locais para projetos de reciclagem.",
    submissionDate: new Date("2026-04-22T14:30:00.000Z"),
    status: "IN_REVIEW",
    attachments: Buffer.from("anexos-programa-reciclagem", "utf-8"),
    optionalContactPhone: "11999990002",
    optionalContactPhoneIsWhats: false,
    optionalContactEmail: "reciclagem@example.com",
    createdByUserId: "d2222222-2222-4222-8222-222222222222",
  },
  {
    id: "8d9b93f2-cf3a-4d84-b76f-17ecaf6ab003",
    title: "Oficinas de Inclusão Digital",
    description: "Uma proposta de oficinas focadas em alfabetização digital nos bairros do entorno.",
    submissionDate: new Date("2026-04-24T09:15:00.000Z"),
    status: "APPROVED",
    attachments: Buffer.from("material-inclusao-digital", "utf-8"),
    optionalContactPhone: null,
    optionalContactPhoneIsWhats: false,
    optionalContactEmail: "inclusao@example.com",
    createdByUserId: "d1111111-1111-4111-8111-111111111111",
  },
  {
    id: "c0f7b2d1-5b3e-4f0d-9f7a-6b4b9b8dc004",
    title: "Horta Comunitária Sustentável",
    description: "Uma proposta para implantar uma horta comunitária com participação de estudantes e moradores.",
    submissionDate: new Date("2026-04-25T13:40:00.000Z"),
    status: "SUBMITTED",
    attachments: Buffer.from("projeto-horta-comunitaria", "utf-8"),
    optionalContactPhone: "11999990004",
    optionalContactPhoneIsWhats: true,
    optionalContactEmail: null,
    createdByUserId: "d3333333-3333-4333-8333-333333333333",
  },
  {
    id: "f1a8d3e4-9c0b-4ad8-8c2e-7a3a0f6dd005",
    title: "Ponto de Apoio Psicológico Itinerante",
    description: "Uma proposta para levar atendimento e orientação psicológica a diferentes espaços do câmpus.",
    submissionDate: new Date("2026-04-26T08:20:00.000Z"),
    status: "IN_REVIEW",
    attachments: Buffer.from("roteiro-apoio-psicologico", "utf-8"),
    optionalContactPhone: null,
    optionalContactPhoneIsWhats: false,
    optionalContactEmail: "apoio@example.com",
    createdByUserId: "d2222222-2222-4222-8222-222222222222",
  },
  {
    id: "a7b6c5d4-e3f2-4a19-b8c7-9d0e1f2a3b06",
    title: "Laboratório Aberto de Inovação",
    description: "Uma proposta para abrir um espaço colaborativo voltado à prototipagem e a soluções para a comunidade.",
    submissionDate: new Date("2026-04-27T16:10:00.000Z"),
    status: "APPROVED",
    attachments: Buffer.from("laboratorio-aberto-inovacao", "utf-8"),
    optionalContactPhone: "11999990006",
    optionalContactPhoneIsWhats: true,
    optionalContactEmail: "inovacao@example.com",
    createdByUserId: "d1111111-1111-4111-8111-111111111111",
  },
  {
    id: "b9c8d7e6-f5a4-4b3c-9d2e-1f0a2b3c4d07",
    title: "Campanha de Economia de Energia",
    description: "Uma proposta para reduzir o consumo de energia com ações educativas e melhorias operacionais.",
    submissionDate: new Date("2026-04-28T11:05:00.000Z"),
    status: "REJECTED",
    attachments: Buffer.from("campanha-economia-energia", "utf-8"),
    optionalContactPhone: "11999990007",
    optionalContactPhoneIsWhats: false,
    optionalContactEmail: null,
    createdByUserId: "d3333333-3333-4333-8333-333333333333",
  },
];

const courses = [
  {
    id: "e1111111-1111-4111-8111-111111111111",
    name: "Análise de Sistemas",
    description: "Projetos de tecnologia conectados às necessidades da comunidade.",
  },
  {
    id: "e2222222-2222-4222-8222-222222222222",
    name: "Gestão de Negócios",
    description: "Projetos de impacto operacional e social.",
  },
];

const projects = [
  {
    id: "f1111111-1111-4111-8111-111111111111",
    title: "Plataforma de Mobilidade do Câmpus",
    description: "Construir um protótipo para organizar solicitações de mobilidade no câmpus.",
    deadline: new Date("2026-06-30T00:00:00.000Z"),
    status: "ACTIVE",
    attachments: "resumo-do-projeto-de-mobilidade",
    courseId: "e1111111-1111-4111-8111-111111111111",
    proposalId: "1f4d3c20-7f52-4c1f-b9ef-93cd5b8db001",
    selectedFeedbackId: "a1111111-1111-4111-8111-111111111111",
  },
  {
    id: "f2222222-2222-4222-8222-222222222222",
    title: "Fluxo Comunitário de Reciclagem",
    description: "Definir um fluxo de reciclagem com cooperativas parceiras.",
    deadline: new Date("2026-07-15T00:00:00.000Z"),
    status: "PLANNING",
    attachments: "resumo-do-projeto-de-reciclagem",
    courseId: "e2222222-2222-4222-8222-222222222222",
    proposalId: "4ac2a8f0-6e35-4c6b-8a44-c1e8a954b002",
    selectedFeedbackId: "a2222222-2222-4222-8222-222222222222",
  },
];

const feedbacks = [
  {
    id: "a1111111-1111-4111-8111-111111111111",
    comment: "Priorizar rotas acessíveis e os horários de pico das aulas.",
    attachments: "anotacoes-de-feedback-de-mobilidade",
    userId: "d2222222-2222-4222-8222-222222222222",
    projectId: "f1111111-1111-4111-8111-111111111111",
  },
  {
    id: "a2222222-2222-4222-8222-222222222222",
    comment: "Mapear os pontos de coleta antes da implementação.",
    attachments: "anotacoes-de-feedback-de-reciclagem",
    userId: "d1111111-1111-4111-8111-111111111111",
    projectId: "f2222222-2222-4222-8222-222222222222",
  },
];

const projectStudents = [
  {
    id: "b1111111-1111-4111-8111-111111111111",
    projectId: "f1111111-1111-4111-8111-111111111111",
    userId: "d3333333-3333-4333-8333-333333333333",
  },
  {
    id: "b2222222-2222-4222-8222-222222222222",
    projectId: "f2222222-2222-4222-8222-222222222222",
    userId: "d3333333-3333-4333-8333-333333333333",
  },
];

const notifications = [
  {
    id: "c1111111-1111-4111-8111-111111111111",
    message: "Sua proposta foi recebida.",
    userId: "d1111111-1111-4111-8111-111111111111",
  },
  {
    id: "c2222222-2222-4222-8222-222222222222",
    message: "Um projeto recebeu novo feedback.",
    userId: "d3333333-3333-4333-8333-333333333333",
  },
];

async function main() {
  for (const user of users) {
    const passwordHash = await hash(user.password, 8);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        avatar: user.avatar,
        phone: user.phone,
        phoneIsWhats: user.phoneIsWhats,
        passwordHash,
        role: user.role,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        phone: user.phone,
        phoneIsWhats: user.phoneIsWhats,
        passwordHash,
        role: user.role,
      },
    });
  }

  for (const proposal of proposals) {
    await prisma.proposal.upsert({
      where: { id: proposal.id },
      update: {
        title: proposal.title,
        description: proposal.description,
        submissionDate: proposal.submissionDate,
        status: proposal.status,
        attachments: proposal.attachments,
        optionalContactPhone: proposal.optionalContactPhone,
        optionalContactPhoneIsWhats: proposal.optionalContactPhoneIsWhats,
        optionalContactEmail: proposal.optionalContactEmail,
        createdBy: {
          connect: {
            id: proposal.createdByUserId,
          },
        },
      },
      create: {
        id: proposal.id,
        title: proposal.title,
        description: proposal.description,
        submissionDate: proposal.submissionDate,
        status: proposal.status,
        attachments: proposal.attachments,
        optionalContactPhone: proposal.optionalContactPhone,
        optionalContactPhoneIsWhats: proposal.optionalContactPhoneIsWhats,
        optionalContactEmail: proposal.optionalContactEmail,
        createdBy: {
          connect: {
            id: proposal.createdByUserId,
          },
        },
      },
    });
  }

  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: {
        name: course.name,
        description: course.description,
      },
      create: course,
    });
  }

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: {
        title: project.title,
        description: project.description,
        deadline: project.deadline,
        status: project.status,
        attachments: project.attachments,
        course: { connect: { id: project.courseId } },
        proposal: { connect: { id: project.proposalId } },
      },
      create: {
        id: project.id,
        title: project.title,
        description: project.description,
        deadline: project.deadline,
        status: project.status,
        attachments: project.attachments,
        course: { connect: { id: project.courseId } },
        proposal: { connect: { id: project.proposalId } },
      },
    });
  }

  for (const feedback of feedbacks) {
    await prisma.feedback.upsert({
      where: { id: feedback.id },
      update: {
        comment: feedback.comment,
        attachments: feedback.attachments,
        user: { connect: { id: feedback.userId } },
        project: { connect: { id: feedback.projectId } },
      },
      create: {
        id: feedback.id,
        comment: feedback.comment,
        attachments: feedback.attachments,
        user: { connect: { id: feedback.userId } },
        project: { connect: { id: feedback.projectId } },
      },
    });
  }

  for (const project of projects) {
    await prisma.project.update({
      where: { id: project.id },
      data: {
        selectedFeedback: { connect: { id: project.selectedFeedbackId } },
      },
    });
  }

  for (const projectStudent of projectStudents) {
    await prisma.projectStudent.upsert({
      where: {
        projectId_userId: {
          projectId: projectStudent.projectId,
          userId: projectStudent.userId,
        },
      },
      update: {
        project: { connect: { id: projectStudent.projectId } },
        user: { connect: { id: projectStudent.userId } },
      },
      create: {
        id: projectStudent.id,
        project: { connect: { id: projectStudent.projectId } },
        user: { connect: { id: projectStudent.userId } },
      },
    });
  }

  for (const notification of notifications) {
    await prisma.notification.upsert({
      where: { id: notification.id },
      update: {
        message: notification.message,
        user: { connect: { id: notification.userId } },
      },
      create: {
        id: notification.id,
        message: notification.message,
        user: { connect: { id: notification.userId } },
      },
    });
  }

  console.log(
    `Seed concluído: ${users.length} usuários, ${proposals.length} propostas, ${courses.length} cursos, ${projects.length} projetos, ${feedbacks.length} feedbacks, ${projectStudents.length} estudantes de projeto e ${notifications.length} notificações inseridos/atualizados.`,
  );
}

main()
  .catch((error) => {
    console.error("Falha no seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
