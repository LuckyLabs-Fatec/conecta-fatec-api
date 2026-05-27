import { PrismaNotificationRepository } from "@/infra/repositories/PrismaNotificationRepository";
import { NotificationController } from "@/presentation/controllers/NotificationController";

export function makeNotificationController(): NotificationController {
  const notificationRepository = new PrismaNotificationRepository();

  return new NotificationController(
    {
      execute: (data) => notificationRepository.create(data),
    },
    {
      execute: (params) => notificationRepository.findPaginated(params),
    },
    {
      execute: (id, data) => notificationRepository.update(id, data),
    },
    {
      execute: (id) => notificationRepository.delete(id),
    },
  );
}
