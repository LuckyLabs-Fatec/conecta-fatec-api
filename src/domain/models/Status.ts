export enum ProposalStatus {
  PRE_APPROVED = "PRE_APPROVED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  IN_REVIEW = "IN_REVIEW",
}

export enum ProjectStatus {
  IN_DEVELOPMENT = "IN_DEVELOPMENT",
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

export const isProposalStatus = (value: unknown): value is ProposalStatus =>
  typeof value === "string" && Object.values(ProposalStatus).includes(value as ProposalStatus);

export const isProjectStatus = (value: unknown): value is ProjectStatus =>
  typeof value === "string" && Object.values(ProjectStatus).includes(value as ProjectStatus);
