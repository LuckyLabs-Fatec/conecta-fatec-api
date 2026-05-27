import { PrismaProposalRepository } from "@/infra/repositories/PrismaProposalRepository";
import {
  CreateProposalRequest,
  UpdateProposalRequest,
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
          active: createdProposal.active,
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
    {
      async execute({ page, limit, userId }): Promise<{
        items: ProposalResponse[];
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
      }> {
        return proposalRepository.findPaginatedByUser({ page, limit, userId });
      },
    },
    {
      async execute(id: string, data: UpdateProposalRequest) {
        const updatedProposal = await proposalRepository.update(id, {
          title: data.title,
          description: data.description,
          submissionDate: data.submissionDate,
          status: data.status,
          attachments: data.attachments,
          optionalContactPhone: data.optionalContactPhone,
          optionalContactPhoneIsWhats: data.optionalContactPhoneIsWhats,
          optionalContactEmail: data.optionalContactEmail,
        });

        return {
          id: updatedProposal.id,
          title: updatedProposal.title,
          description: updatedProposal.description,
          submissionDate: updatedProposal.submissionDate,
          status: updatedProposal.status,
          attachments: updatedProposal.attachments,
          optionalContactPhone: updatedProposal.optionalContactPhone,
          optionalContactPhoneIsWhats: updatedProposal.optionalContactPhoneIsWhats,
          optionalContactEmail: updatedProposal.optionalContactEmail,
          active: updatedProposal.active,
          user: updatedProposal.user,
        };
      },
    },
    {
      execute: (id: string) => proposalRepository.delete(id),
    },
  );
}
