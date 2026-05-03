import { describe, it, expect } from "vitest";

import {
  parsePaginationQuery,
  parseOptionalDate,
  requireFields,
} from "./ControllerHelpers";

import { InvalidPayloadError } from "@/domain/errors/InvalidPayloadError";

describe("ControllerHelpers", () => {
  describe("parsePaginationQuery", () => {
    it("should return default values when no query parameters are provided", () => {
      const result = parsePaginationQuery({});

      expect(result).toEqual({ page: 1, limit: 10 });
    });

    it("should parse valid page and limit parameters", () => {
      const result = parsePaginationQuery({ page: 2, limit: 20 });

      expect(result).toEqual({ page: 2, limit: 20 });
    });

    it("should use fallback page when page is undefined", () => {
      const result = parsePaginationQuery({ limit: 15 });

      expect(result).toEqual({ page: 1, limit: 15 });
    });

    it("should use fallback limit when limit is undefined", () => {
      const result = parsePaginationQuery({ page: 3 });

      expect(result).toEqual({ page: 3, limit: 10 });
    });

    it("should throw InvalidPayloadError when limit exceeds 100", () => {
      expect(() => parsePaginationQuery({ page: 1, limit: 101 })).toThrow(
        InvalidPayloadError,
      );
      expect(() => parsePaginationQuery({ page: 1, limit: 101 })).toThrow(
        "Limit must be less than or equal to 100",
      );
    });

    it("should throw InvalidPayloadError for non-integer page values", () => {
      expect(() => parsePaginationQuery({ page: 1.5, limit: 10 })).toThrow(
        InvalidPayloadError,
      );
    });

    it("should throw InvalidPayloadError for non-integer limit values", () => {
      expect(() => parsePaginationQuery({ page: 1, limit: 10.5 })).toThrow(
        InvalidPayloadError,
      );
    });

    it("should throw InvalidPayloadError for zero page value", () => {
      expect(() => parsePaginationQuery({ page: 0, limit: 10 })).toThrow(
        InvalidPayloadError,
      );
    });

    it("should throw InvalidPayloadError for negative page value", () => {
      expect(() => parsePaginationQuery({ page: -1, limit: 10 })).toThrow(
        InvalidPayloadError,
      );
    });

    it("should throw InvalidPayloadError for zero limit value", () => {
      expect(() => parsePaginationQuery({ page: 1, limit: 0 })).toThrow(
        InvalidPayloadError,
      );
    });

    it("should throw InvalidPayloadError for negative limit value", () => {
      expect(() => parsePaginationQuery({ page: 1, limit: -5 })).toThrow(
        InvalidPayloadError,
      );
    });

    it("should handle empty/undefined values as fallback", () => {
      const result = parsePaginationQuery({ page: undefined, limit: undefined });

      expect(result).toEqual({ page: 1, limit: 10 });
    });

    it("should handle null values as fallback", () => {
      const result = parsePaginationQuery({ page: null as unknown as number, limit: null as unknown as number });

      expect(result).toEqual({ page: 1, limit: 10 });
    });
  });

  describe("parseOptionalDate", () => {
    it("should return undefined when value is undefined", () => {
      const result = parseOptionalDate(undefined, "startDate");

      expect(result).toBeUndefined();
    });

    it("should return undefined when value is null", () => {
      const result = parseOptionalDate(null, "startDate");

      expect(result).toBeUndefined();
    });

    it("should return undefined when value is empty string", () => {
      const result = parseOptionalDate("", "startDate");

      expect(result).toBeUndefined();
    });

    it("should parse valid ISO date string", () => {
      const dateString = "2026-04-28T10:00:00Z";
      const result = parseOptionalDate(dateString, "startDate");

      expect(result).toEqual(new Date(dateString));
    });

    it("should parse valid date string", () => {
      const dateString = "2026-04-28";
      const result = parseOptionalDate(dateString, "startDate");

      expect(result?.toISOString()).toContain("2026-04-28");
    });

    it("should throw InvalidPayloadError for invalid date string", () => {
      expect(() => parseOptionalDate("invalid-date", "startDate")).toThrow(
        InvalidPayloadError,
      );
      expect(() => parseOptionalDate("invalid-date", "startDate")).toThrow(
        "Invalid startDate",
      );
    });

    it("should throw InvalidPayloadError with custom field name", () => {
      expect(() => parseOptionalDate("not-a-date", "endDate")).toThrow(
        "Invalid endDate",
      );
    });
  });

  describe("requireFields", () => {
    it("should not throw when all fields are present", () => {
      expect(() =>
        requireFields({ name: "John", email: "john@example.com" }),
      ).not.toThrow();
    });

    it("should throw InvalidPayloadError when a field is undefined", () => {
      expect(() => requireFields({ name: "John", email: undefined })).toThrow(
        InvalidPayloadError,
      );
      expect(() => requireFields({ name: "John", email: undefined })).toThrow(
        "Missing required fields",
      );
    });

    it("should throw InvalidPayloadError when a field is null", () => {
      expect(() => requireFields({ name: "John", email: null })).toThrow(
        InvalidPayloadError,
      );
    });

    it("should throw InvalidPayloadError when a field is empty string", () => {
      expect(() => requireFields({ name: "John", email: "" })).toThrow(
        InvalidPayloadError,
      );
    });

    it("should throw InvalidPayloadError when multiple fields are missing", () => {
      expect(() =>
        requireFields({ name: undefined, email: null, age: "" }),
      ).toThrow(InvalidPayloadError);
    });

    it("should handle multiple fields with some missing", () => {
      expect(() =>
        requireFields({ name: "John", email: "john@example.com", age: undefined }),
      ).toThrow(InvalidPayloadError);
    });
  });
});
