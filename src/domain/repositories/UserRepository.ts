import { User, UserRole } from "@/domain/models/User";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";

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
  findPaginated(params: ListParams): Promise<Paginated<User>>;
  create(data: CreateUserParams): Promise<User>;
  update(id: string, data: UpdateUserParams): Promise<User>;
  softDelete(id: string): Promise<User>;
}
