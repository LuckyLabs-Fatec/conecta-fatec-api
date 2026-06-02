import { UserRole } from "@/domain/models/User";
import { ProposalStatus } from "@/domain/models/Status";

export interface ProposalUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: UserRole;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  submissionDate: Date;
  status: ProposalStatus;
  attachments: Buffer;
  optionalContactPhone?: string;
  optionalContactPhoneIsWhats: boolean;
  optionalContactEmail?: string;
  active: boolean;
  user: ProposalUser;
}
