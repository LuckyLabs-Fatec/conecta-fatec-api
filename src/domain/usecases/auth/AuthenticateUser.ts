import { HashComparer } from "@/domain/contracts/HashComparer";
import { InvalidCredentialsError } from "@/domain/errors/InvalidCredentialsError";
import { UserRepository } from "@/domain/repositories/UserRepository";

export class AuthenticateUser {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly hashComparer: HashComparer
    ) {}

    async execute(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new InvalidCredentialsError();
        }

        const matches = await this.hashComparer.compare(password, user.passwordHash);
        if (!matches) {
            throw new InvalidCredentialsError();
        }
        return user;
    }
}