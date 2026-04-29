import { Notification } from "@/domain/models/Notification";
import {
  CreateNotificationParams,
  NotificationRepository,
} from "@/domain/repositories/NotificationRepository";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";
import { getPrismaClient } from "@/infra/database/prisma/client";
import { getPagination, toPaginated } from "@/infra/repositories/pagination";

type NotificationRecord = {
  id: string;
  message: string;
  createdAt: Date;
  userId: string;
};

type PrismaClientLike = {
  notification: {
    create(args: {
      data: {
        message: string;
        user: { connect: { id: string } };
      };
    }): Promise<NotificationRecord>;
    findMany(args: {
      skip: number;
      take: number;
      orderBy: { createdAt: "desc" };
    }): Promise<NotificationRecord[]>;
    count(): Promise<number>;
  };
};

const mapNotification = (notification: NotificationRecord): Notification => ({
  id: notification.id,
  message: notification.message,
  createdAt: notification.createdAt,
  userId: notification.userId,
});

export class PrismaNotificationRepository implements NotificationRepository {
  constructor(
    private readonly db: PrismaClientLike = getPrismaClient() as unknown as PrismaClientLike,
  ) {}

  async create(data: CreateNotificationParams): Promise<Notification> {
    const notification = await this.db.notification.create({
      data: {
        message: data.message,
        user: { connect: { id: data.userId } },
      },
    });

    return mapNotification(notification);
  }

  async findPaginated(params: ListParams): Promise<Paginated<Notification>> {
    const [totalItems, notifications] = await Promise.all([
      this.db.notification.count(),
      this.db.notification.findMany({
        ...getPagination(params),
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return toPaginated(notifications.map(mapNotification), params, totalItems);
  }
}
