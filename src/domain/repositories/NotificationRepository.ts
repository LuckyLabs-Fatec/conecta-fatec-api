import { Notification } from "@/domain/models/Notification";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";

export type CreateNotificationParams = {
  message: string;
  userId: string;
};

export type UpdateNotificationParams = {
  message?: string;
};

export interface NotificationRepository {
  create(data: CreateNotificationParams): Promise<Notification>;
  update(id: string, data: UpdateNotificationParams): Promise<Notification>;
  delete(id: string): Promise<void>;
  findPaginated(params: ListParams): Promise<Paginated<Notification>>;
}
