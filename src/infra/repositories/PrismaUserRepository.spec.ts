import type { PrismaClient } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";

import { PrismaUserRepository } from "./PrismaUserRepository";

import { UserRole } from "@/domain/models/User";

describe("PrismaUserRepository", () => {
  it("should create and return mapped user", async () => {
    const create = vi.fn().mockResolvedValue({
      id: "created-user-id",
      email: "new@example.com",
      passwordHash: "hashed-password",
      name: "New User",
      role: "SOCIETY",
    });

    const sut = new PrismaUserRepository(
      {
        user: { create, findUnique: vi.fn() },
      } as unknown as PrismaClient
    );

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
        role: "SOCIETY",
      },
    });
    expect(user).toEqual({
      id: "created-user-id",
      email: "new@example.com",
      passwordHash: "hashed-password",
      name: "New User",
      role: "SOCIETY",
    });
  });

  it("should return null when user does not exist", async () => {
    const findUnique = vi.fn().mockResolvedValue(null);
    const sut = new PrismaUserRepository(
      {
        user: { findUnique, create: vi.fn() },
      } as unknown as PrismaClient
    );

    const user = await sut.findByEmail("nonexistent@example.com");

    expect(user).toBeNull();
    expect(findUnique).toHaveBeenCalledWith({
      where: { email: "nonexistent@example.com" },
    });
  });

  it("should create user with custom role", async () => {
    const create = vi.fn().mockResolvedValue({
      id: "mediator-user-id",
      email: "mediator@example.com",
      passwordHash: "hashed-password",
      name: "Mediator User",
      role: "MEDIATOR",
    });

    const sut = new PrismaUserRepository(
      {
        user: { create, findUnique: vi.fn() },
      } as unknown as PrismaClient
    );

    const user = await sut.create({
      email: "mediator@example.com",
      passwordHash: "hashed-password",
      name: "Mediator User",
      role: UserRole.MEDIATOR,
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        email: "mediator@example.com",
        passwordHash: "hashed-password",
        name: "Mediator User",
        role: "MEDIATOR",
      },
    });
    expect(user.role).toBe("MEDIATOR");
  });

  it("should return mapped user when email exists", async () => {
    const findUnique = vi.fn().mockResolvedValue({
      id: "user-id",
      email: "existent@example.com",
      passwordHash: "hashed-password",
      name: "Test User",
      role: "SOCIETY",
    });

    const sut = new PrismaUserRepository(
      {
        user: { findUnique, create: vi.fn() },
      } as unknown as PrismaClient
    );

    const user = await sut.findByEmail("existent@example.com");

    expect(user).toEqual({
      id: "user-id",
      email: "existent@example.com",
      passwordHash: "hashed-password",
      name: "Test User",
      role: "SOCIETY",
    });
  });

  it("should create user with default role and no name", async () => {
    const create = vi.fn().mockResolvedValue({
      id: "created-user-id",
      email: "no-name@example.com",
      passwordHash: "hashed-password",
      name: null,
      role: "SOCIETY",
    });

    const sut = new PrismaUserRepository(
      {
        user: { create, findUnique: vi.fn() },
      } as unknown as PrismaClient
    );

    const user = await sut.create({
      email: "no-name@example.com",
      passwordHash: "hashed-password",
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        email: "no-name@example.com",
        passwordHash: "hashed-password",
        name: undefined,
        role: "SOCIETY",
      },
    });
    expect(user).toEqual({
      id: "created-user-id",
      email: "no-name@example.com",
      passwordHash: "hashed-password",
      name: undefined,
      role: "SOCIETY",
    });
  });

  it("should return mapped user without name when email exists", async () => {
    const findUnique = vi.fn().mockResolvedValue({
      id: "user-id",
      email: "noname@example.com",
      passwordHash: "hashed-password",
      name: null,
      role: "SOCIETY",
    });

    const sut = new PrismaUserRepository(
      {
        user: { findUnique, create: vi.fn() },
      } as unknown as PrismaClient
    );

    const user = await sut.findByEmail("noname@example.com");

    expect(user).toEqual({
      id: "user-id",
      email: "noname@example.com",
      passwordHash: "hashed-password",
      name: undefined,
      role: "SOCIETY",
    });
  });
});
