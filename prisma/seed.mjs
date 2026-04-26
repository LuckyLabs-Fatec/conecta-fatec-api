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
    role: "SOCIETY",
  },
  {
    id: "d2222222-2222-4222-8222-222222222222",
    email: "mediator@example.com",
    password: "mediator123",
    name: "Pessoa Mediadora",
    role: "MEDIATOR",
  },
  {
    id: "d3333333-3333-4333-8333-333333333333",
    email: "student@example.com",
    password: "student123",
    name: "Estudante Exemplo",
    role: "STUDENT",
  },
];

const proposals = [
  {
    id: "1f4d3c20-7f52-4c1f-b9ef-93cd5b8db001",
    title: "Mobilidade Inteligente no Campus",
    description: "Uma proposta para otimizar o transporte interno e a acessibilidade no campus.",
    submissionDate: new Date("2026-04-20T10:00:00.000Z"),
    status: "SUBMITTED",
    attachments: Buffer.from("plano-de-mobilidade-v1", "utf-8"),
  },
  {
    id: "4ac2a8f0-6e35-4c6b-8a44-c1e8a954b002",
    title: "Programa Comunitário de Reciclagem",
    description: "Uma proposta que conecta estudantes e cooperativas locais para projetos de reciclagem.",
    submissionDate: new Date("2026-04-22T14:30:00.000Z"),
    status: "IN_REVIEW",
    attachments: Buffer.from("anexos-programa-reciclagem", "utf-8"),
  },
  {
    id: "8d9b93f2-cf3a-4d84-b76f-17ecaf6ab003",
    title: "Oficinas de Inclusão Digital",
    description: "Uma proposta de oficinas focadas em alfabetização digital nos bairros do entorno.",
    submissionDate: new Date("2026-04-24T09:15:00.000Z"),
    status: "APPROVED",
    attachments: Buffer.from("material-inclusao-digital", "utf-8"),
  },
  {
    id: "c0f7b2d1-5b3e-4f0d-9f7a-6b4b9b8dc004",
    title: "Horta Comunitária Sustentável",
    description: "Uma proposta para implantar uma horta comunitária com participação de estudantes e moradores.",
    submissionDate: new Date("2026-04-25T13:40:00.000Z"),
    status: "SUBMITTED",
    attachments: Buffer.from("projeto-horta-comunitaria", "utf-8"),
  },
  {
    id: "f1a8d3e4-9c0b-4ad8-8c2e-7a3a0f6dd005",
    title: "Ponto de Apoio Psicológico Itinerante",
    description: "Uma proposta para levar atendimento e orientação psicológica a diferentes espaços do campus.",
    submissionDate: new Date("2026-04-26T08:20:00.000Z"),
    status: "IN_REVIEW",
    attachments: Buffer.from("roteiro-apoio-psicologico", "utf-8"),
  },
  {
    id: "a7b6c5d4-e3f2-4a19-b8c7-9d0e1f2a3b06",
    title: "Laboratório Aberto de Inovação",
    description: "Uma proposta para abrir um espaço colaborativo voltado a prototipagem e soluções para a comunidade.",
    submissionDate: new Date("2026-04-27T16:10:00.000Z"),
    status: "APPROVED",
    attachments: Buffer.from("laboratorio-aberto-inovacao", "utf-8"),
  },
  {
    id: "b9c8d7e6-f5a4-4b3c-9d2e-1f0a2b3c4d07",
    title: "Campanha de Economia de Energia",
    description: "Uma proposta para reduzir o consumo de energia com ações educativas e melhorias operacionais.",
    submissionDate: new Date("2026-04-28T11:05:00.000Z"),
    status: "REJECTED",
    attachments: Buffer.from("campanha-economia-energia", "utf-8"),
  },
];

async function main() {
  for (const user of users) {
    const passwordHash = await hash(user.password, 8);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        passwordHash,
        role: user.role,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
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
      },
      create: proposal,
    });
  }

  console.log(`Seed concluído: ${users.length} usuários e ${proposals.length} propostas inseridos/atualizados.`);
}

main()
  .catch((error) => {
    console.error("Falha no seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
