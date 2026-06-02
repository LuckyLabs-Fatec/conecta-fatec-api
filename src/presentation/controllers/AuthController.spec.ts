import { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";

import {
    AuthController,
    AuthenticateUserContract,
    DeleteUserContract,
    ListUsersContract,
    UpdateUserContract,
    UpdateUserRequest,
} from "./AuthController";

import { InvalidCredentialsError } from "@/domain/errors/InvalidCredentialsError";
import { UserRole } from "@/domain/models/User";


const VALID_IMGUR_AVATAR_URL = "https://i.imgur.com/avatar123.jpg";

describe("AuthController", () => {
    let authController: AuthController;
    let authenticateUserMock: AuthenticateUserContract;
    let updateUserMock: UpdateUserContract;
    let deleteUserMock: DeleteUserContract;
    let listUsersMock: ListUsersContract;

    beforeEach(() => {
        authenticateUserMock = {
            execute: vi.fn(),
        };
        updateUserMock = {
            execute: vi.fn(),
        };
        deleteUserMock = {
            execute: vi.fn(),
        };
        listUsersMock = {
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
        const publicUser = {
            id: faker.string.uuid(),
            email: faker.internet.email(),
            name: faker.person.fullName(),
            avatar: VALID_IMGUR_AVATAR_URL,
            phone: "11999999999",
            phoneIsWhats: true,
            role: UserRole.SOCIETY,
        };

        vi.mocked(authenticateUserMock.execute).mockResolvedValue({
            accessToken: fakeToken,
            user: publicUser,
        });

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
        expect(res.json).toHaveBeenCalledWith({
            accessToken: fakeToken,
            user: publicUser,
        });
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
            avatar: VALID_IMGUR_AVATAR_URL,
        };

        const createUserMock = {
            execute: vi.fn().mockResolvedValue(createdUser),
        };

        const controller = new AuthController(authenticateUserMock, createUserMock);

	    const req = {
	        body: {
	            email: faker.internet.email(),
	            password: faker.internet.password(),
	            phone: "11999999999",
	            phoneIsWhats: true,
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

    it("should return paginated users for admin listing", async () => {
        const paginatedUsers = {
            items: [
                {
                    id: faker.string.uuid(),
                    email: faker.internet.email(),
                    name: faker.person.fullName(),
                    avatar: faker.image.avatar(),
                    phone: "11999999999",
                    phoneIsWhats: true,
                    role: UserRole.ADMIN,
                },
            ],
            page: 2,
            limit: 5,
            totalItems: 12,
            totalPages: 3,
        };
        vi.mocked(listUsersMock.execute).mockResolvedValue(paginatedUsers);
        const controller = new AuthController(authenticateUserMock, undefined, undefined, undefined, listUsersMock);

        const req = {
            query: { page: "2", limit: "5" },
        } as unknown as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        await controller.list(req, res);

        expect(listUsersMock.execute).toHaveBeenCalledWith({ page: 2, limit: 5 });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(paginatedUsers);
    });

    it("should return 200 and updated user on full register update", async () => {
        const userId = faker.string.uuid();
        const updatedUser = {
            id: userId,
            email: faker.internet.email(),
            name: faker.person.fullName(),
            avatar: VALID_IMGUR_AVATAR_URL,
            phone: "11999999999",
            phoneIsWhats: true,
        };
        vi.mocked(updateUserMock.execute).mockResolvedValue(updatedUser);

        const controller = new AuthController(authenticateUserMock, undefined, updateUserMock);

        const req = {
            params: { id: userId },
            body: {
                email: updatedUser.email,
                password: faker.internet.password(),
                name: updatedUser.name,
                avatar: updatedUser.avatar,
                phone: updatedUser.phone,
                phoneIsWhats: updatedUser.phoneIsWhats,
            } satisfies UpdateUserRequest,
        } as unknown as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        await controller.update(req, res);

        expect(updateUserMock.execute).toHaveBeenCalledWith(userId, req.body, "full");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it("should return 400 when full register update has missing required fields", async () => {
        const controller = new AuthController(authenticateUserMock, undefined, updateUserMock);

        const req = {
            params: { id: faker.string.uuid() },
            body: {
                name: faker.person.fullName(),
            },
        } as unknown as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        await controller.update(req, res);

        expect(updateUserMock.execute).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Missing required fields" });
    });

    it("should return 200 and updated user on partial register update", async () => {
        const userId = faker.string.uuid();
        const updatedUser = {
            id: userId,
            email: faker.internet.email(),
            name: faker.person.fullName(),
            avatar: faker.image.avatar(),
            phone: "11999999999",
            phoneIsWhats: false,
        };
        vi.mocked(updateUserMock.execute).mockResolvedValue(updatedUser);

        const controller = new AuthController(authenticateUserMock, undefined, updateUserMock);

        const req = {
            auth: {
                userId,
                role: UserRole.STUDENT,
            },
            params: { id: userId },
            body: {
                phone: updatedUser.phone,
                phoneIsWhats: updatedUser.phoneIsWhats,
            },
        } as unknown as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        await controller.patch(req, res);

        expect(updateUserMock.execute).toHaveBeenCalledWith(userId, req.body, "partial");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it("should return 403 when a non-admin user tries to patch another user", async () => {
        const controller = new AuthController(authenticateUserMock, undefined, updateUserMock);

        const req = {
            auth: {
                userId: "authenticated-user-id",
                role: UserRole.STUDENT,
            },
            params: { id: "other-user-id" },
            body: {
                name: faker.person.fullName(),
            },
        } as unknown as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        await controller.patch(req, res);

        expect(updateUserMock.execute).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
    });

    it("should reject partial register update with a non-Imgur avatar URL", async () => {
        const userId = faker.string.uuid();
        const controller = new AuthController(authenticateUserMock, undefined, updateUserMock);

        const req = {
            auth: {
                userId,
                role: UserRole.STUDENT,
            },
            params: { id: userId },
            body: {
                avatar: "https://plus.unsplash.com/avatar.jpg",
            },
        } as unknown as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        await controller.patch(req, res);

        expect(updateUserMock.execute).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Avatar must be a direct Imgur image URL",
        });
    });

    it("should allow an admin user to patch another user", async () => {
        const updatedUser = {
            id: "other-user-id",
            email: faker.internet.email(),
            name: faker.person.fullName(),
            avatar: faker.image.avatar(),
            phone: "11999999999",
            phoneIsWhats: true,
        };
        vi.mocked(updateUserMock.execute).mockResolvedValue(updatedUser);
        const controller = new AuthController(authenticateUserMock, undefined, updateUserMock);

        const req = {
            auth: {
                userId: "admin-user-id",
                role: UserRole.ADMIN,
            },
            params: { id: updatedUser.id },
            body: {
                name: updatedUser.name,
            },
        } as unknown as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        await controller.patch(req, res);

        expect(updateUserMock.execute).toHaveBeenCalledWith(updatedUser.id, req.body, "partial");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it("should return mapped error when partial register update fails", async () => {
        vi.mocked(updateUserMock.execute).mockRejectedValue(new Error());
        const controller = new AuthController(authenticateUserMock, undefined, updateUserMock);

        const req = {
            auth: {
                userId: "user-id",
                role: UserRole.STUDENT,
            },
            params: { id: "user-id" },
            body: {
                name: faker.person.fullName(),
            },
        } as unknown as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        await controller.patch(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });

    it("should return 204 when register is soft deleted", async () => {
        const userId = faker.string.uuid();
        vi.mocked(deleteUserMock.execute).mockResolvedValue();
        const controller = new AuthController(authenticateUserMock, undefined, undefined, deleteUserMock);

        const req = {
            params: { id: userId },
        } as unknown as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
        } as unknown as Response;

        await controller.delete(req, res);

        expect(deleteUserMock.execute).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalledWith();
    });

    it("should return mapped error when register soft delete fails", async () => {
        vi.mocked(deleteUserMock.execute).mockRejectedValue(new Error());
        const controller = new AuthController(authenticateUserMock, undefined, undefined, deleteUserMock);

        const req = {
            params: { id: faker.string.uuid() },
        } as unknown as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        await controller.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
});
