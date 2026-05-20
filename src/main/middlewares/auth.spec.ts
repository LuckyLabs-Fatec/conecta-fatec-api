import { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { UserRole } from "@/domain/models/User";
import { ensureAuthenticated, ensureRole } from "@/main/middlewares/auth";
import { AuthenticatedRequest } from "@/presentation/http/AuthenticatedRequest";

describe("auth middlewares", () => {
  const originalJwtSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalJwtSecret;
  });

  function makeResponse(): Response {
    return {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
  }

  function makeToken(role: UserRole, subject = "user-id"): string {
    return sign({ email: "user@example.com", role }, process.env.JWT_SECRET as string, {
      subject,
    });
  }

  it("returns 401 when authorization header is missing", () => {
    const req = { headers: {} } as Request;
    const res = makeResponse();
    const next = vi.fn() as unknown as NextFunction;

    ensureAuthenticated(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Authentication required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when token is invalid", () => {
    const req = { headers: { authorization: "Bearer invalid-token" } } as unknown as Request;
    const res = makeResponse();
    const next = vi.fn() as unknown as NextFunction;

    ensureAuthenticated(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid or expired token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("stores authenticated user data when token is valid", () => {
    const req = {
      headers: { authorization: `Bearer ${makeToken(UserRole.SOCIETY)}` },
    } as unknown as Request;
    const res = makeResponse();
    const next = vi.fn() as unknown as NextFunction;

    ensureAuthenticated(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect((req as AuthenticatedRequest).auth).toEqual({ userId: "user-id", role: UserRole.SOCIETY });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("blocks SOCIETY users from routes that require STUDENT", () => {
    const req = {
      headers: { authorization: `Bearer ${makeToken(UserRole.SOCIETY)}` },
    } as unknown as Request;
    const res = makeResponse();
    const next = vi.fn() as unknown as NextFunction;

    ensureRole(UserRole.STUDENT)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
    expect(next).not.toHaveBeenCalled();
  });

  it("allows higher roles on routes that require STUDENT", () => {
    const req = {
      headers: { authorization: `Bearer ${makeToken(UserRole.MEDIATOR)}` },
    } as unknown as Request;
    const res = makeResponse();
    const next = vi.fn() as unknown as NextFunction;

    ensureRole(UserRole.STUDENT)(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect((req as AuthenticatedRequest).auth).toEqual({ userId: "user-id", role: UserRole.MEDIATOR });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("allows only ADMIN users on routes that require ADMIN", () => {
    const req = {
      headers: { authorization: `Bearer ${makeToken(UserRole.ADMIN)}` },
    } as unknown as Request;
    const res = makeResponse();
    const next = vi.fn() as unknown as NextFunction;

    ensureRole(UserRole.ADMIN)(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect((req as AuthenticatedRequest).auth).toEqual({ userId: "user-id", role: UserRole.ADMIN });
  });
});
