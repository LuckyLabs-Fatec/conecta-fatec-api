import { Request, Response } from "express";

import { Notification } from "@/domain/models/Notification";
import { Paginated } from "@/domain/repositories/Pagination";
import { parsePaginationQuery, requireFields } from "@/presentation/controllers/ControllerHelpers";
import { HttpErrorMapper } from "@/presentation/mappers/HttpErrorMapper";

export type CreateNotificationRequest = {
  message: string;
  userId: string;
};

export type UpdateNotificationRequest = {
  message?: string;
};

type CreateNotificationContract = {
  execute(data: CreateNotificationRequest): Promise<Notification>;
};

type UpdateNotificationContract = {
  execute(id: string, data: UpdateNotificationRequest): Promise<Notification>;
};

type DeleteNotificationContract = {
  execute(id: string): Promise<void>;
};

type ListNotificationsContract = {
  execute(params: { page: number; limit: number }): Promise<Paginated<Notification>>;
};

export class NotificationController {
  constructor(
    private readonly createNotification: CreateNotificationContract,
    private readonly listNotifications: ListNotificationsContract,
    private readonly updateNotification?: UpdateNotificationContract,
    private readonly deleteNotification?: DeleteNotificationContract,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { message, userId } = req.body ?? {};
      requireFields({ message, userId });

      const notification = await this.createNotification.execute({ message, userId });
      res.status(201).json(notification);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    if (!this.updateNotification) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    try {
      const id = req.params.id as string;
      const { message } = req.body ?? {};

      const notification = await this.updateNotification.execute(id, { message });
      res.status(200).json(notification);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    if (!this.deleteNotification) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    try {
      const id = req.params.id as string;
      await this.deleteNotification.execute(id);
      res.status(204).send();
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const params = parsePaginationQuery(req.query);
      const notifications = await this.listNotifications.execute(params);
      res.status(200).json(notifications);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }
}
