import { describe, it, expect } from "vitest";
import { faker } from "@faker-js/faker";

import { AuthenticateUser } from "./AuthenticateUser";

import { InMemoryUserRepository } from "@/test/doubles/InMemoryUserRepository";

class FakeHashComparer {
  constructor(private readonly shouldMatch: boolean) {}
  async compare(): Promise<boolean> {
    return this.shouldMatch;
  }
}

const makeSut = (shouldMatch = true) => {
  const repo = new InMemoryUserRepository();
  const hashComparer = new FakeHashComparer(shouldMatch);
  const sut = new AuthenticateUser(repo, hashComparer);
  return { repo, sut };
};

const setupUser = async (repo: InMemoryUserRepository) => {
    const id = faker.string.uuid();
    const email = faker.internet.email();
    const passwordHash = faker.string.alphanumeric(10);

    await repo.insert({
        id,
        email,
        passwordHash,
    });

    return { id, email, passwordHash };
}

describe("AuthenticateUser", () => {
    it("should throw an error if the user is not found", async () => {
        const { sut } = makeSut();
    
        await expect(sut.execute("nonexistent@example.com", "any-password")).rejects.toThrow("Invalid credentials");
    });


    it("should return the user if found", async () => {
        const { repo, sut } = makeSut();
        const { email, passwordHash } = await setupUser(repo);
    
        const user = await sut.execute(email, passwordHash);
        expect(user.email).toBe(email);
    });

    it("should throw when password does not match", async () => {
        const repo = new InMemoryUserRepository();

        const { email, passwordHash } = await setupUser(repo);
        const useCase = new AuthenticateUser(repo, new FakeHashComparer(false));
    
        await expect(useCase.execute(email, passwordHash)).rejects.toThrow("Invalid credentials");
    });

    it("should return the user when password matches", async () => {
        const repo = new InMemoryUserRepository();

        const { email, passwordHash } = await setupUser(repo);
        const useCase = new AuthenticateUser(repo, new FakeHashComparer(true));
    
        const user = await useCase.execute(email, passwordHash);
        expect(user.email).toBe(email);
    });
});