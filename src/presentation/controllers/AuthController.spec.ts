import { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";

import { AuthController, AuthenticateUserContract } from "./AuthController";

import { InvalidCredentialsError } from "@/domain/errors/InvalidCredentialsError";



describe("AuthController", () => {
    let authController: AuthController;
    let authenticateUserMock: AuthenticateUserContract;

    beforeEach(() => {
        authenticateUserMock = {
            execute: vi.fn(),
        };

        authController = new AuthController(authenticateUserMock);
    })

    it("should return 401 when user is not found", async () => {
        vi.mocked(authenticateUserMock.execute).mockRejectedValue(new InvalidCredentialsError());

        const req = {
            body: {
                email: faker.internet.email(),
                password: faker.internet.password(),
            }
        } as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    })

    it("should return 500 on unexpected errors", async () => {
        vi.mocked(authenticateUserMock.execute).mockRejectedValue(new Error());

        const req = {
            body: {
                email: faker.internet.email(),
                password: faker.internet.password(),
            }
        } as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    })

    it("should return 200 and access token on successful authentication", async () => {
        const fakeToken = faker.string.uuid();
        vi.mocked(authenticateUserMock.execute).mockResolvedValue({ accessToken: fakeToken });

        const req = {
            body: {
                email: faker.internet.email(),
                password: faker.internet.password(),
            }
        } as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ accessToken: fakeToken });
    });

    it("should return 501 when register is not implemented", async () => {
        const req = {
            body: {
                email: faker.internet.email(),
                password: faker.internet.password(),
            }
        } as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(501);
        expect(res.json).toHaveBeenCalledWith({ message: "Not implemented" });
    });

    it("should return 201 and created user on successful register", async () => {
        const createdUser = {
            id: faker.string.uuid(),
            email: faker.internet.email(),
            name: faker.person.fullName(),
            avatar: faker.image.avatar(),
        };

        const createUserMock = {
            execute: vi.fn().mockResolvedValue(createdUser),
        };

        const controller = new AuthController(authenticateUserMock, createUserMock);

        const req = {
            body: {
                email: faker.internet.email(),
                password: faker.internet.password(),
                name: faker.person.fullName(),
                avatar: faker.image.avatar(),
            }
        } as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        await controller.register(req, res);

        expect(createUserMock.execute).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(createdUser);
    });

    it("should return mapped error when register fails", async () => {
        const createUserMock = {
            execute: vi.fn().mockRejectedValue(new Error()),
        };

        const controller = new AuthController(authenticateUserMock, createUserMock);

        const req = {
            body: {
                email: faker.internet.email(),
                password: faker.internet.password(),
                name: faker.person.fullName(),
                avatar: faker.image.avatar(),
            }
        } as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        await controller.register(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
});