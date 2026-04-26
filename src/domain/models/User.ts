export enum UserRole {
  SOCIETY = 'SOCIETY',
  MEDIATOR = 'MEDIATOR',
  STUDENT = 'STUDENT',
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
  avatar?: string;
  role: UserRole;
}