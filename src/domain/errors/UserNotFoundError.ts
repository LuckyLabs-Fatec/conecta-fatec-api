export class UserNotFoundError extends Error {
  readonly code = 'USER_NOT_FOUND';
  readonly statusCode = 404;

  constructor(message = 'User not found') {
    super(message);
    this.name = 'UserNotFoundError';
  }
}