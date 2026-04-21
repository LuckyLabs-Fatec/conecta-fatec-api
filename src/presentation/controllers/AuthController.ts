import { Request, Response } from "express";

import { HttpErrorMapper } from "@/presentation/mappers/HttpErrorMapper";

export type AuthenticateUserResponse = {
  accessToken: string;
};

export type CreateUserResponse = {
  id: string;
  email: string;
  name?: string;
};

export type CreateUserRequest = {
  email: string;
  password: string;
  name?: string;
};

export type AuthenticateUserContract = {
  execute(email: string, password: string): Promise<AuthenticateUserResponse>;
};

export type CreateUserContract = {
  execute(data: CreateUserRequest): Promise<CreateUserResponse>;
};

export class AuthController {
  constructor(
    private readonly authenticateUser: AuthenticateUserContract,
    private readonly createUser?: CreateUserContract,
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const result = await this.authenticateUser.execute(email, password);
      res.status(200).json({ accessToken: result.accessToken });
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

    const { email, password, name } = req.body;

    try {
      const result = await this.createUser.execute({ email, password, name });
      res.status(201).json(result);
    } catch (error: unknown) {
      const statusCode = HttpErrorMapper.getStatusCode(error);
      const message = HttpErrorMapper.getMessage(error);
      res.status(statusCode).json({ message });
    }
  }
}