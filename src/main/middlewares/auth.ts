import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

import { UserRole } from "@/domain/models/User";
import { AuthenticatedRequest, getAuthenticatedUser } from "@/presentation/http/AuthenticatedRequest";

type AuthTokenPayload = JwtPayload & {
  role?: UserRole;
};

const roleLevels: Record<UserRole, number> = {
  [UserRole.SOCIETY]: 0,
  [UserRole.STUDENT]: 1,
  [UserRole.MEDIATOR]: 2,
  [UserRole.ADMIN]: 3,
};

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction): void {
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

    if (typeof payload.sub !== "string" || !payload.sub || !isUserRole(payload.role)) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    (req as AuthenticatedRequest).auth = {
      userId: payload.sub,
      role: payload.role,
    };

    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function ensureRole(requiredRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    ensureAuthenticated(req, res, () => {
      const authenticatedUser = getAuthenticatedUser(req);

      if (!authenticatedUser || roleLevels[authenticatedUser.role] < roleLevels[requiredRole]) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      next();
    });
  };
}

function isUserRole(role: unknown): role is UserRole {
  return typeof role === "string" && Object.values(UserRole).includes(role as UserRole);
}
