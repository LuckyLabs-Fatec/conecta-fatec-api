import { Feedback } from "@/domain/models/Feedback";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";

export type CreateFeedbackParams = {
  comment?: string;
  attachments?: string;
  userId: string;
  projectId: string;
};

export type UpdateFeedbackParams = {
  comment?: string;
  attachments?: string;
};

export interface FeedbackRepository {
  create(data: CreateFeedbackParams): Promise<Feedback>;
  update(id: string, data: UpdateFeedbackParams): Promise<Feedback>;
  delete(id: string): Promise<void>;
  findPaginated(params: ListParams): Promise<Paginated<Feedback>>;
}
