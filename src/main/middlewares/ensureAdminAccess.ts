import { NextFunction, Request, Response } from "express";

export function ensureAdminAccess(req: Request, res: Response, next: NextFunction): void {
  const adminHeader = req.headers["x-admin-secret"] as string | undefined;

  if (!adminHeader) {
    res.status(401).json({ message: "Admin authentication required" });
    return;
  }

  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret) {
    res.status(500).json({ message: "ADMIN_SECRET is not configured" });
    return;
  }

  if (adminHeader !== adminSecret) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  next();
}
