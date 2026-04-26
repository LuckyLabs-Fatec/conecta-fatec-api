import { PrismaProposalRepository } from "@/infra/repositories/PrismaProposalRepository";
import {
  CreateProposalRequest,
  ProposalController,
} from "@/presentation/controllers/ProposalController";

export function makeProposalController(): ProposalController {
  const proposalRepository = new PrismaProposalRepository();

  return new ProposalController({
    async execute(data: CreateProposalRequest) {
      const createdProposal = await proposalRepository.create({
        title: data.title,
        description: data.description,
        submissionDate: data.submissionDate,
        status: data.status,
        attachments: data.attachments,
      });

      return {
        id: createdProposal.id,
        title: createdProposal.title,
        description: createdProposal.description,
        submissionDate: createdProposal.submissionDate,
        status: createdProposal.status,
        attachments: createdProposal.attachments,
      };
    },
  });
}
