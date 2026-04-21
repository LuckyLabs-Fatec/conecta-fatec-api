import { User } from "@/domain/models/User";

export type CreateUserParams = {
  email: string;
  passwordHash: string;
  name?: string;
};

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserParams): Promise<User>;
}