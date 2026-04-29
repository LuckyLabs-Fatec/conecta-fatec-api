import { Notification } from "@/domain/models/Notification";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";

export type CreateNotificationParams = {
  message: string;
  userId: string;
};

export interface NotificationRepository {
  create(data: CreateNotificationParams): Promise<Notification>;
  findPaginated(params: ListParams): Promise<Paginated<Notification>>;
}
