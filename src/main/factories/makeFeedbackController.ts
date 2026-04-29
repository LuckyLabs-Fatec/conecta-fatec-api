import { PrismaFeedbackRepository } from "@/infra/repositories/PrismaFeedbackRepository";
import { FeedbackController } from "@/presentation/controllers/FeedbackController";

export function makeFeedbackController(): FeedbackController {
  const feedbackRepository = new PrismaFeedbackRepository();

  return new FeedbackController(
    {
      execute: (data) => feedbackRepository.create(data),
    },
    {
      execute: (params) => feedbackRepository.findPaginated(params),
    },
  );
}
