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
      avatar: "https://cdn.example.com/avatar-new.png",
      phone: "11999999999",
      phoneIsWhats: true,
      role: "SOCIETY",
      active: true,
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
      avatar: "https://cdn.example.com/avatar-new.png",
      phone: "11999999999",
      phoneIsWhats: true,
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        email: "new@example.com",
        passwordHash: "hashed-password",
        name: "New User",
        avatar: "https://cdn.example.com/avatar-new.png",
        phone: "11999999999",
        phoneIsWhats: true,
        role: "SOCIETY",
        active: true,
      },
    });
    expect(user).toEqual({
      id: "created-user-id",
      email: "new@example.com",
      passwordHash: "hashed-password",
      name: "New User",
      avatar: "https://cdn.example.com/avatar-new.png",
      phone: "11999999999",
      phoneIsWhats: true,
      role: "SOCIETY",
      active: true,
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
      where: { email: "nonexistent@example.com", active: true },
    });
  });

  it("should create user with custom role", async () => {
    const create = vi.fn().mockResolvedValue({
      id: "mediator-user-id",
      email: "mediator@example.com",
      passwordHash: "hashed-password",
      name: "Mediator User",
      avatar: "https://cdn.example.com/avatar-mediator.png",
      phone: "11666666666",
      phoneIsWhats: false,
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
      avatar: "https://cdn.example.com/avatar-mediator.png",
      phone: "11666666666",
      role: UserRole.MEDIATOR,
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        email: "mediator@example.com",
        passwordHash: "hashed-password",
        name: "Mediator User",
        avatar: "https://cdn.example.com/avatar-mediator.png",
        phone: "11666666666",
        phoneIsWhats: false,
        role: "MEDIATOR",
        active: true,
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
      avatar: "https://cdn.example.com/avatar-test.png",
      phone: "11888888888",
      phoneIsWhats: false,
      role: "SOCIETY",
      active: true,
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
      avatar: "https://cdn.example.com/avatar-test.png",
      phone: "11888888888",
      phoneIsWhats: false,
      role: "SOCIETY",
      active: true,
    });
  });

  it("should create user with default role and no name", async () => {
    const create = vi.fn().mockResolvedValue({
      id: "created-user-id",
      email: "no-name@example.com",
      passwordHash: "hashed-password",
      name: null,
      avatar: null,
      phone: "11777777777",
      phoneIsWhats: false,
      role: "SOCIETY",
      active: true,
    });

    const sut = new PrismaUserRepository(
      {
        user: { create, findUnique: vi.fn() },
      } as unknown as PrismaClient
    );

    const user = await sut.create({
      email: "no-name@example.com",
      passwordHash: "hashed-password",
      phone: "11777777777",
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        email: "no-name@example.com",
        passwordHash: "hashed-password",
        name: undefined,
        avatar: undefined,
        phone: "11777777777",
        phoneIsWhats: false,
        role: "SOCIETY",
        active: true,
      },
    });
    expect(user).toEqual({
      id: "created-user-id",
      email: "no-name@example.com",
      passwordHash: "hashed-password",
      name: undefined,
      avatar: undefined,
      phone: "11777777777",
      phoneIsWhats: false,
      role: "SOCIETY",
      active: true,
    });
  });

  it("should return mapped user without name when email exists", async () => {
    const findUnique = vi.fn().mockResolvedValue({
      id: "user-id",
      email: "noname@example.com",
      passwordHash: "hashed-password",
      name: null,
      avatar: null,
      phone: "11555555555",
      phoneIsWhats: false,
      role: "SOCIETY",
      active: true,
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
      avatar: undefined,
      phone: "11555555555",
      phoneIsWhats: false,
      role: "SOCIETY",
      active: true,
    });
  });

  it("should update and return mapped user", async () => {
    const update = vi.fn().mockResolvedValue({
      id: "user-id",
      email: "updated@example.com",
      passwordHash: "new-hashed-password",
      name: "Updated User",
      avatar: "https://cdn.example.com/avatar-updated.png",
      phone: "11999999999",
      phoneIsWhats: true,
      role: "SOCIETY",
      active: true,
    });
    const sut = new PrismaUserRepository(
      {
        user: { update, create: vi.fn(), findUnique: vi.fn() },
      } as unknown as PrismaClient
    );

    const user = await sut.update("user-id", {
      email: "updated@example.com",
      passwordHash: "new-hashed-password",
      name: "Updated User",
      avatar: "https://cdn.example.com/avatar-updated.png",
      phone: "11999999999",
      phoneIsWhats: true,
    });

    expect(update).toHaveBeenCalledWith({
      where: { id: "user-id" },
      data: {
        email: "updated@example.com",
        passwordHash: "new-hashed-password",
        name: "Updated User",
        avatar: "https://cdn.example.com/avatar-updated.png",
        phone: "11999999999",
        phoneIsWhats: true,
      },
    });
    expect(user).toEqual({
      id: "user-id",
      email: "updated@example.com",
      passwordHash: "new-hashed-password",
      name: "Updated User",
      avatar: "https://cdn.example.com/avatar-updated.png",
      phone: "11999999999",
      phoneIsWhats: true,
      role: "SOCIETY",
      active: true,
    });
  });

  it("should update only provided user fields", async () => {
    const update = vi.fn().mockResolvedValue({
      id: "user-id",
      email: "existent@example.com",
      passwordHash: "hashed-password",
      name: "Partial User",
      avatar: null,
      phone: "11888888888",
      phoneIsWhats: false,
      role: "SOCIETY",
    });
    const sut = new PrismaUserRepository(
      {
        user: { update, create: vi.fn(), findUnique: vi.fn() },
      } as unknown as PrismaClient
    );

    const user = await sut.update("user-id", {
      name: "Partial User",
    });

    expect(update).toHaveBeenCalledWith({
      where: { id: "user-id" },
      data: {
        name: "Partial User",
      },
    });
    expect(user.name).toBe("Partial User");
  });

  it("should soft delete user by marking it inactive", async () => {
    const update = vi.fn().mockResolvedValue({
      id: "user-id",
      email: "inactive@example.com",
      passwordHash: "hashed-password",
      name: "Inactive User",
      avatar: null,
      phone: "11888888888",
      phoneIsWhats: false,
      role: "SOCIETY",
      active: false,
    });
    const sut = new PrismaUserRepository(
      {
        user: { update, create: vi.fn(), findUnique: vi.fn() },
      } as unknown as PrismaClient
    );

    const user = await sut.softDelete("user-id");

    expect(update).toHaveBeenCalledWith({
      where: { id: "user-id" },
      data: { active: false },
    });
    expect(user.active).toBe(false);
  });
});
