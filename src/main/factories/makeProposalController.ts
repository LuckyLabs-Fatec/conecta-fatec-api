import { PrismaProposalRepository } from "@/infra/repositories/PrismaProposalRepository";
import {
  CreateProposalRequest,
  ProposalController,
  ProposalResponse,
} from "@/presentation/controllers/ProposalController";

export function makeProposalController(): ProposalController {
  const proposalRepository = new PrismaProposalRepository();

  return new ProposalController(
    {
      async execute(data: CreateProposalRequest) {
        const createdProposal = await proposalRepository.create({
          title: data.title,
          description: data.description,
          submissionDate: data.submissionDate,
          status: data.status,
          attachments: data.attachments,
          createdByUserId: data.createdByUserId,
          optionalContactPhone: data.optionalContactPhone,
          optionalContactPhoneIsWhats: data.optionalContactPhoneIsWhats,
          optionalContactEmail: data.optionalContactEmail,
        });

        return {
          id: createdProposal.id,
          title: createdProposal.title,
          description: createdProposal.description,
          submissionDate: createdProposal.submissionDate,
          status: createdProposal.status,
          attachments: createdProposal.attachments,
          optionalContactPhone: createdProposal.optionalContactPhone,
          optionalContactPhoneIsWhats: createdProposal.optionalContactPhoneIsWhats,
          optionalContactEmail: createdProposal.optionalContactEmail,
          user: createdProposal.user,
        };
      },
    },
    {
      async execute({ page, limit }): Promise<{
        items: ProposalResponse[];
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
      }> {
        return proposalRepository.findPaginated({ page, limit });
      },
    },
  );
}
