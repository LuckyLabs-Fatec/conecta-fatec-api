import { HashComparer } from "@/domain/contracts/HashComparer";
import { InvalidCredentialsError } from "@/domain/errors/InvalidCredentialsError";
import { PublicUser } from "@/domain/models/User";
import { UserRepository } from "@/domain/repositories/UserRepository";

export class AuthenticateUser {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly hashComparer: HashComparer
    ) {}

    async execute(email: string, password: string): Promise<PublicUser> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new InvalidCredentialsError();
        }

        const matches = await this.hashComparer.compare(password, user.passwordHash);
        if (!matches) {
            throw new InvalidCredentialsError();
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            phone: user.phone,
            phoneIsWhats: user.phoneIsWhats,
            role: user.role,
        };
    }
}