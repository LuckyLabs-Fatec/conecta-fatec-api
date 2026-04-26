import { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { UserRole } from "@/domain/models/User";
import { ensureAuthenticatedCommunityUser } from "@/main/middlewares/ensureAuthenticatedCommunityUser";

describe("ensureAuthenticatedCommunityUser", () => {
  const originalJwtSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalJwtSecret;
  });

  it("should return 401 when authorization header is missing", () => {
    const req = { headers: {} } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;

    ensureAuthenticatedCommunityUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Authentication required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 when token is invalid", () => {
    const req = { headers: { authorization: "Bearer invalid-token" } } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;

    ensureAuthenticatedCommunityUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid or expired token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 when user role is not SOCIETY", () => {
    const token = sign(
      { email: "student@example.com", role: UserRole.STUDENT },
      process.env.JWT_SECRET as string,
      { subject: "user-id" },
    );

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;

    ensureAuthenticatedCommunityUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Only community users can create proposals" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next when user is authenticated and role is SOCIETY", () => {
    const token = sign(
      { email: "society@example.com", role: UserRole.SOCIETY },
      process.env.JWT_SECRET as string,
      { subject: "user-id" },
    );

    const req = {
      body: {
        title: "proposal",
      },
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;

    ensureAuthenticatedCommunityUser(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body).toEqual({ title: "proposal", createdByUserId: "user-id" });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 401 when token has no subject", () => {
    const token = sign(
      { email: "society@example.com", role: UserRole.SOCIETY },
      process.env.JWT_SECRET as string,
    );

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;

    ensureAuthenticatedCommunityUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid or expired token" });
    expect(next).not.toHaveBeenCalled();
  });
});
