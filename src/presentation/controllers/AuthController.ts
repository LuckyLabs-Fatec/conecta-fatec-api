import { Request, Response } from "express";

import { InvalidPayloadError } from "@/domain/errors/InvalidPayloadError";
import { PublicUser, UserRole } from "@/domain/models/User";
import { Paginated } from "@/domain/repositories/Pagination";
import { getAuthenticatedUser } from "@/presentation/http/AuthenticatedRequest";
import { HttpErrorMapper } from "@/presentation/mappers/HttpErrorMapper";

export type AuthenticateUserResponse = {
  accessToken: string;
  user: PublicUser;
};

export type CreateUserResponse = Omit<PublicUser, "role">;

export type CreateUserRequest = {
  email: string;
  password: string;
  name?: string;
  avatar?: string;
  phone: string;
  phoneIsWhats?: boolean;
  role?: UserRole;
};

export type UpdateUserRequest = Partial<CreateUserRequest>;
export type UpdateUserMode = "full" | "partial";

export type AuthenticateUserContract = {
  execute(email: string, password: string): Promise<AuthenticateUserResponse>;
};

export type CreateUserContract = {
  execute(data: CreateUserRequest): Promise<CreateUserResponse>;
};

export type UpdateUserContract = {
  execute(id: string, data: UpdateUserRequest, mode: UpdateUserMode): Promise<CreateUserResponse>;
};

export type DeleteUserContract = {
  execute(id: string): Promise<void>;
};

export type ListUsersContract = {
  execute(params: { page: number; limit: number }): Promise<Paginated<PublicUser>>;
};

export class AuthController {
  constructor(
    private readonly authenticateUser: AuthenticateUserContract,
    private readonly createUser?: CreateUserContract,
    private readonly updateUser?: UpdateUserContract,
    private readonly deleteUser?: DeleteUserContract,
    private readonly listUsers?: ListUsersContract,
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const result = await this.authenticateUser.execute(email, password);
      res.status(200).json(result);
    } catch (error: unknown) {
      const statusCode = HttpErrorMapper.getStatusCode(error);
      const message = HttpErrorMapper.getMessage(error);
      res.status(statusCode).json({ message });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    if (!this.createUser) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    const { email, password, name, avatar, phone, phoneIsWhats } = req.body;

    try {
      const result = await this.createUser.execute({ email, password, name, avatar, phone, phoneIsWhats });
      res.status(201).json(result);
    } catch (error: unknown) {
      const statusCode = HttpErrorMapper.getStatusCode(error);
      const message = HttpErrorMapper.getMessage(error);
      res.status(statusCode).json({ message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    await this.updateRegister(req, res, "full");
  }

  async patch(req: Request, res: Response): Promise<void> {
    await this.updateRegister(req, res, "partial");
  }

  async delete(req: Request, res: Response): Promise<void> {
    if (!this.deleteUser) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    try {
      await this.deleteUser.execute(this.getIdParam(req));
      res.status(204).send();
    } catch (error: unknown) {
      const statusCode = HttpErrorMapper.getStatusCode(error);
      const message = HttpErrorMapper.getMessage(error);
      res.status(statusCode).json({ message });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    if (!this.listUsers) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    const params = {
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
    };

    try {
      const result = await this.listUsers.execute(params);
      res.status(200).json(result);
    } catch (error: unknown) {
      const statusCode = HttpErrorMapper.getStatusCode(error);
      const message = HttpErrorMapper.getMessage(error);
      res.status(statusCode).json({ message });
    }
  }

  private async updateRegister(req: Request, res: Response, mode: UpdateUserMode): Promise<void> {
    if (!this.updateUser) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    try {
      if (mode === "partial" && !this.canPatchUser(req)) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      if (mode === "full") {
        this.ensureFullUpdatePayload(req.body);
      }

      const result = await this.updateUser.execute(this.getIdParam(req), req.body, mode);
      res.status(200).json(result);
    } catch (error: unknown) {
      const statusCode = HttpErrorMapper.getStatusCode(error);
      const message = HttpErrorMapper.getMessage(error);
      res.status(statusCode).json({ message });
    }
  }

  private ensureFullUpdatePayload(body: UpdateUserRequest): void {
    const requiredFields = ["email", "password", "name", "avatar", "phone", "phoneIsWhats"] as const;
    const hasAllRequiredFields = requiredFields.every((field) => body[field] !== undefined);

    if (!hasAllRequiredFields) {
      throw new InvalidPayloadError("Missing required fields");
    }
  }

  private getIdParam(req: Request): string {
    const idParam = req.params.id;
    return Array.isArray(idParam) ? idParam[0] : idParam;
  }

  private canPatchUser(req: Request): boolean {
    const authenticatedUser = getAuthenticatedUser(req);

    if (!authenticatedUser) {
      return false;
    }

    return authenticatedUser.userId === this.getIdParam(req) || authenticatedUser.role === UserRole.ADMIN;
  }
}
