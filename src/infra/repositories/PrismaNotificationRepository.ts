import { Notification } from "@/domain/models/Notification";
import {
  CreateNotificationParams,
  NotificationRepository,
  UpdateNotificationParams,
} from "@/domain/repositories/NotificationRepository";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";
import { getPrismaClient } from "@/infra/database/prisma/client";
import { getPagination, toPaginated } from "@/infra/repositories/pagination";

type NotificationRecord = {
  id: string;
  message: string;
  active: boolean;
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
    update(args: {
      where: { id: string };
      data: { message?: string; active?: boolean };
    }): Promise<NotificationRecord>;
    findMany(args: {
      skip: number;
      take: number;
      orderBy: { createdAt: "desc" };
      where: { active: boolean };
    }): Promise<NotificationRecord[]>;
    count(args: { where: { active: boolean } }): Promise<number>;
  };
};

const mapNotification = (notification: NotificationRecord): Notification => ({
  id: notification.id,
  message: notification.message,
  active: notification.active,
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

  async update(id: string, data: UpdateNotificationParams): Promise<Notification> {
    const notification = await this.db.notification.update({
      where: { id },
      data: { message: data.message },
    });

    return mapNotification(notification);
  }

  async delete(id: string): Promise<void> {
    await this.db.notification.update({
      where: { id },
      data: { active: false },
    });
  }

  async findPaginated(params: ListParams): Promise<Paginated<Notification>> {
    const where = { active: true };

    const [totalItems, notifications] = await Promise.all([
      this.db.notification.count({ where }),
      this.db.notification.findMany({
        ...getPagination(params),
        orderBy: { createdAt: "desc" },
        where,
      }),
    ]);

    return toPaginated(notifications.map(mapNotification), params, totalItems);
  }
}
