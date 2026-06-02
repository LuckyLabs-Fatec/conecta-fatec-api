import { User, UserRole } from "@/domain/models/User";
import { Paginated, ListParams } from "@/domain/repositories/Pagination";
import { CreateUserParams, UpdateUserParams, UserRepository } from "@/domain/repositories/UserRepository";

type UserFixture = Omit<User, "active"> & { active?: boolean };

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email && user.active !== false) ?? null;
  }

  async findPaginated({ page, limit }: ListParams): Promise<Paginated<User>> {
    const activeUsers = this.users.filter((user) => user.active !== false);
    const start = (page - 1) * limit;

    return {
      items: activeUsers.slice(start, start + limit),
      page,
      limit,
      totalItems: activeUsers.length,
      totalPages: Math.ceil(activeUsers.length / limit),
    };
  }

  async create(data: CreateUserParams): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      email: data.email,
      passwordHash: data.passwordHash,
      name: data.name,
      avatar: data.avatar,
      phone: data.phone,
      phoneIsWhats: data.phoneIsWhats ?? false,
      role: data.role ?? UserRole.SOCIETY,
      active: data.active ?? true,
    };

    this.users.push(user);
    return user;
  }

  async update(id: string, data: UpdateUserParams): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex < 0) {
      throw new Error("User not found");
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...data,
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async softDelete(id: string): Promise<User> {
    return this.update(id, { active: false });
  }

  async insert(user: UserFixture) {
    this.users.push({
      ...user,
      active: user.active ?? true,
    });
  }
}
