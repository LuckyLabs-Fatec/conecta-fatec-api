import { User } from "@/domain/models/User";
import { CreateUserParams, UserRepository } from "@/domain/repositories/UserRepository";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async create(data: CreateUserParams): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      email: data.email,
      passwordHash: data.passwordHash,
      name: data.name,
    };

    this.users.push(user);
    return user;
  }

  async insert(user: User) {
    this.users.push(user);
  }
}