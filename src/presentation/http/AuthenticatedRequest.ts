import { Request } from "express";

import { UserRole } from "@/domain/models/User";

export type AuthenticatedRequestUser = {
  userId: string;
  role: UserRole;
};

export type AuthenticatedRequest = Request & {
  auth?: AuthenticatedRequestUser;
};

export function getAuthenticatedUser(req: Request): AuthenticatedRequestUser | undefined {
  return (req as AuthenticatedRequest).auth;
}
