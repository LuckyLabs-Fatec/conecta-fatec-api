import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { InvalidCredentialsError } from "@/domain/errors/InvalidCredentialsError";
import { UserAlreadyExistsError } from "@/domain/errors/UserAlreadyExistsError";
import { PrismaUserRepository } from "@/infra/repositories/PrismaUserRepository";
import { AuthController, CreateUserRequest } from "@/presentation/controllers/AuthController";

export function makeAuthController(): AuthController {
  const userRepository = new PrismaUserRepository();

  return new AuthController({
    async execute(email: string, password: string) {
      const user = await userRepository.findByEmail(email);

      if (!user) {
        throw new InvalidCredentialsError();
      }

      const passwordMatches = await compare(password, user.passwordHash);

      if (!passwordMatches) {
        throw new InvalidCredentialsError();
      }

      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not configured");
      }

      const jwtExpiresIn =
        (process.env.JWT_EXPIRES_IN ?? "15m") as Parameters<typeof sign>[2]["expiresIn"];

      const accessToken = sign(
        { email: user.email },
        jwtSecret,
        {
          subject: user.id,
          expiresIn: jwtExpiresIn,
        }
      );

      return { accessToken };

    },
  }, {
    async execute(data: CreateUserRequest) {
      const existingUser = await userRepository.findByEmail(data.email);

      if (existingUser) {
        throw new UserAlreadyExistsError();
      }

      const passwordHash = await hash(data.password, 8);

      const createdUser = await userRepository.create({
        email: data.email,
        passwordHash,
        name: data.name,
      });

      return {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
      };
    },
  });
}
