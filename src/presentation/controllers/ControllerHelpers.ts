import { InvalidPayloadError } from "@/domain/errors/InvalidPayloadError";

export type PaginationQuery = {
  page?: unknown;
  limit?: unknown;
};

export const parsePaginationQuery = (query: PaginationQuery): { page: number; limit: number } => {
  const page = parsePositiveInteger(query.page, 1);
  const limit = parsePositiveInteger(query.limit, 10);

  if (limit > 100) {
    throw new InvalidPayloadError("Limit must be less than or equal to 100");
  }

  return { page, limit };
};

export const parseOptionalDate = (value: unknown, fieldName: string): Date | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsedDate = new Date(String(value));

  if (Number.isNaN(parsedDate.getTime())) {
    throw new InvalidPayloadError(`Invalid ${fieldName}`);
  }

  return parsedDate;
};

export const requireFields = (fields: Record<string, unknown>): void => {
  const hasMissingField = Object.values(fields).some(
    (value) => value === undefined || value === null || value === "",
  );

  if (hasMissingField) {
    throw new InvalidPayloadError("Missing required fields");
  }
};

const parsePositiveInteger = (value: unknown, fallback: number): number => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new InvalidPayloadError("Pagination parameters must be positive integers");
  }

  return parsedValue;
};
