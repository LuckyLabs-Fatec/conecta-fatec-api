import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

import { UserRole } from "@/domain/models/User";

type AuthTokenPayload = JwtPayload & {
  role?: UserRole;
};

export function ensureAuthenticatedCommunityUser(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const token = authorizationHeader.slice(7).trim();

  if (!token) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).json({ message: "JWT_SECRET is not configured" });
    return;
  }

  try {
    const decodedToken = verify(token, jwtSecret);

    if (typeof decodedToken !== "object" || decodedToken === null) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    const payload = decodedToken as AuthTokenPayload;

    if (payload.role !== UserRole.SOCIETY) {
      res.status(403).json({ message: "Only community users can create proposals" });
      return;
    }

    if (typeof payload.sub !== "string" || !payload.sub) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    req.body = {
      ...(req.body ?? {}),
      createdByUserId: payload.sub,
    };

    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
