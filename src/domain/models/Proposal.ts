import { UserRole } from "@/domain/models/User";

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
  status: string;
  attachments: Buffer;
  optionalContactPhone?: string;
  optionalContactPhoneIsWhats: boolean;
  optionalContactEmail?: string;
  user: ProposalUser;
}
