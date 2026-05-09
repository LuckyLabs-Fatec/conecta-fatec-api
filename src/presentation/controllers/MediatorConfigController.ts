/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";

import { FileMediatorConfigRepository, MediatorConfig } from "@/infra/config/FileMediatorConfigRepository";

export class MediatorConfigController {
  constructor(private readonly repository = new FileMediatorConfigRepository()) {}

  async setConfig(req: Request, res: Response): Promise<void> {
    try {
      const { url } = req.body ?? {};

      if (!url || typeof url !== "string") {
        res.status(400).json({ error: "Invalid url" });
        return;
      }

      const config: MediatorConfig = { url };
      await this.repository.save(config);

      res.status(200).json({ message: "Mediator config saved" });
    } catch (err: unknown) {
      res.status(500).json({ error: "Failed to save mediator config" });
    }
  }

  async proxyPreApproval(req: Request, res: Response): Promise<void> {
    try {
      const config = await this.repository.load();

      if (!config || !config.url) {
        res.status(500).json({ error: "Mediator URL not configured" });
        return;
      }

      const mediatorUrl = config.url.replace(/\/$/, "") + "/pre-approval";

      const response = await fetch(mediatorUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body ?? {}),
      });

      const body = await response.text();

      const contentType = response.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        try {
          const parsed = JSON.parse(body);
          res.status(response.status).json(parsed);
          return;
        } catch {
          // fallthrough to send text
        }
      }

      res.status(response.status).send(body);
    } catch (err: unknown) {
      res.status(500).json({ error: "Mediator request failed" });
    }
  }
}
