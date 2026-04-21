export class UserAlreadyExistsError extends Error {
  readonly code = "USER_ALREADY_EXISTS";
  readonly statusCode = 409;

  constructor(message = "User already exists") {
    super(message);
    this.name = "UserAlreadyExistsError";
  }
}