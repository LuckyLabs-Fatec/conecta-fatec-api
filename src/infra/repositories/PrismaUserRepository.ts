import { PrismaClient, UserRole as PrismaUserRole } from "@prisma/client";

import { User, UserRole } from "@/domain/models/User";
import { CreateUserParams, UserRepository } from "@/domain/repositories/UserRepository";
import { getPrismaClient } from "@/infra/database/prisma/client";

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
      },
    });

    return {
      id: createdUser.id,
      email: createdUser.email,
      passwordHash: createdUser.passwordHash,
      name: createdUser.name ?? undefined,
      avatar: createdUser.avatar ?? undefined,
      phone: createdUser.phone,
      phoneIsWhats: createdUser.phoneIsWhats,
      role: createdUser.role as UserRole,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      name: user.name ?? undefined,
      avatar: user.avatar ?? undefined,
      phone: user.phone,
      phoneIsWhats: user.phoneIsWhats,
      role: user.role as UserRole,
    };
  }
}
