import { Request, Response } from "express";

import { Notification } from "@/domain/models/Notification";
import { Paginated } from "@/domain/repositories/Pagination";
import { parsePaginationQuery, requireFields } from "@/presentation/controllers/ControllerHelpers";
import { HttpErrorMapper } from "@/presentation/mappers/HttpErrorMapper";

export type CreateNotificationRequest = {
  message: string;
  userId: string;
};

type CreateNotificationContract = {
  execute(data: CreateNotificationRequest): Promise<Notification>;
};

type ListNotificationsContract = {
  execute(params: { page: number; limit: number }): Promise<Paginated<Notification>>;
};

export class NotificationController {
  constructor(
    private readonly createNotification: CreateNotificationContract,
    private readonly listNotifications: ListNotificationsContract,
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
