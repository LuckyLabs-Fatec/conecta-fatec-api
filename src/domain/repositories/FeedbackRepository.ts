import { Feedback } from "@/domain/models/Feedback";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";

export type CreateFeedbackParams = {
  comment?: string;
  attachments?: string;
  userId: string;
  projectId: string;
};

export interface FeedbackRepository {
  create(data: CreateFeedbackParams): Promise<Feedback>;
  findPaginated(params: ListParams): Promise<Paginated<Feedback>>;
}
