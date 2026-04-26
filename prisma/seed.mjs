import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
];

async function main() {
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

  console.log(`Seed concluído: ${proposals.length} propostas inseridas/atualizadas.`);
}

main()
  .catch((error) => {
    console.error("Falha no seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
