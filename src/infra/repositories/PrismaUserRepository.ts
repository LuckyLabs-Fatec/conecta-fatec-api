import { PrismaClient, UserRole as PrismaUserRole } from "@prisma/client";

import { User, UserRole } from "@/domain/models/User";
import { CreateUserParams, UpdateUserParams, UserRepository } from "@/domain/repositories/UserRepository";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";
import { getPrismaClient } from "@/infra/database/prisma/client";
import { getPagination, toPaginated } from "@/infra/repositories/pagination";

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly db: PrismaClient = getPrismaClient()) {}

  async create(data: CreateUserParams): Promise<User> {
    const createdUser = await this.db.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        avatar: data.avatar,
        phone: data.phone,
        phoneIsWhats: data.phoneIsWhats ?? false,
        role: (data.role as PrismaUserRole | undefined) ?? PrismaUserRole.SOCIETY,
        active: data.active ?? true,
      },
    });

    return this.mapUser(createdUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.user.findUnique({
      where: { email, active: true },
    });

    if (!user) {
      return null;
    }

    return this.mapUser(user);
  }

  async findPaginated(params: ListParams): Promise<Paginated<User>> {
    const where = { active: true };

    const [totalItems, users] = await Promise.all([
      this.db.user.count({ where }),
      this.db.user.findMany({
        ...getPagination(params),
        orderBy: { name: "asc" },
        where,
      }),
    ]);

    return toPaginated(users.map((user) => this.mapUser(user)), params, totalItems);
  }

  async update(id: string, data: UpdateUserParams): Promise<User> {
    const updatedUser = await this.db.user.update({
      where: { id },
      data,
    });

    return this.mapUser(updatedUser);
  }

  async softDelete(id: string): Promise<User> {
    const updatedUser = await this.db.user.update({
      where: { id },
      data: { active: false },
    });

    return this.mapUser(updatedUser);
  }

  private mapUser(user: {
    id: string;
    email: string;
    passwordHash: string;
    name: string | null;
    avatar: string | null;
    phone: string;
    phoneIsWhats: boolean;
    role: PrismaUserRole;
    active?: boolean;
  }): User {
    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      name: user.name ?? undefined,
      avatar: user.avatar ?? undefined,
      phone: user.phone,
      phoneIsWhats: user.phoneIsWhats,
      role: user.role as UserRole,
      active: user.active ?? true,
    };
  }
}
