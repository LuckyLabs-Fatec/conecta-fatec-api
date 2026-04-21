import { describe, expect, it, vi } from "vitest";

import { PrismaUserRepository } from "./PrismaUserRepository";

describe("PrismaUserRepository", () => {
  it("should create and return mapped user", async () => {
    const create = vi.fn().mockResolvedValue({
      id: "created-user-id",
      email: "new@example.com",
      passwordHash: "hashed-password",
      name: "New User",
    });

    const sut = new PrismaUserRepository({
      user: { create, findUnique: vi.fn() },
    });

    const user = await sut.create({
      email: "new@example.com",
      passwordHash: "hashed-password",
      name: "New User",
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        email: "new@example.com",
        passwordHash: "hashed-password",
        name: "New User",
      },
    });
    expect(user).toEqual({
      id: "created-user-id",
      email: "new@example.com",
      passwordHash: "hashed-password",
      name: "New User",
    });
  });

  it("should return null when user does not exist", async () => {
    const findUnique = vi.fn().mockResolvedValue(null);
    const sut = new PrismaUserRepository({
      user: { findUnique, create: vi.fn() },
    });

    const user = await sut.findByEmail("nonexistent@example.com");

    expect(user).toBeNull();
    expect(findUnique).toHaveBeenCalledWith({
      where: { email: "nonexistent@example.com" },
    });
  });

  it("should return mapped user when email exists", async () => {
    const findUnique = vi.fn().mockResolvedValue({
      id: "user-id",
      email: "existent@example.com",
      passwordHash: "hashed-password",
      name: "Test User",
    });

    const sut = new PrismaUserRepository({
      user: { findUnique, create: vi.fn() },
    });

    const user = await sut.findByEmail("existent@example.com");

    expect(user).toEqual({
      id: "user-id",
      email: "existent@example.com",
      passwordHash: "hashed-password",
      name: "Test User",
    });
  });
});
