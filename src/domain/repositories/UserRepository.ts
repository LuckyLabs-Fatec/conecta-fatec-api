import { User, UserRole } from "@/domain/models/User";

export type CreateUserParams = {
  email: string;
  passwordHash: string;
  name?: string;
  avatar?: string;
  phone: string;
  phoneIsWhats?: boolean;
  role?: UserRole;
  active?: boolean;
};

export type UpdateUserParams = Partial<CreateUserParams>;

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserParams): Promise<User>;
  update(id: string, data: UpdateUserParams): Promise<User>;
  softDelete(id: string): Promise<User>;
}
