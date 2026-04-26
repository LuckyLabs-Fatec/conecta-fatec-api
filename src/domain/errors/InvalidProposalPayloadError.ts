export class InvalidProposalPayloadError extends Error {
  readonly code = "INVALID_PROPOSAL_PAYLOAD";
  readonly statusCode = 400;

  constructor(message = "Invalid proposal payload") {
    super(message);
    this.name = "InvalidProposalPayloadError";
  }
}
