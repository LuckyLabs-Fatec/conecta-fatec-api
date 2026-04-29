import { User, UserRole } from "@/domain/models/User";

export type CreateUserParams = {
  email: string;
  passwordHash: string;
  name?: string;
  avatar?: string;
  phone: string;
  phoneIsWhats?: boolean;
  role?: UserRole;
};

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserParams): Promise<User>;
}
