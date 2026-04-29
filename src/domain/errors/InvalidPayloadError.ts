export class InvalidPayloadError extends Error {
  readonly code = "INVALID_PAYLOAD";
  readonly statusCode = 400;

  constructor(message = "Invalid payload") {
    super(message);
    this.name = "InvalidPayloadError";
  }
}
