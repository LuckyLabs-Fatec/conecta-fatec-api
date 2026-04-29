import { Request, Response } from "express";

import { Feedback } from "@/domain/models/Feedback";
import { Paginated } from "@/domain/repositories/Pagination";
import { parsePaginationQuery, requireFields } from "@/presentation/controllers/ControllerHelpers";
import { HttpErrorMapper } from "@/presentation/mappers/HttpErrorMapper";

export type CreateFeedbackRequest = {
  comment?: string;
  attachments?: string;
  userId: string;
  projectId: string;
};

type CreateFeedbackContract = {
  execute(data: CreateFeedbackRequest): Promise<Feedback>;
};

type ListFeedbacksContract = {
  execute(params: { page: number; limit: number }): Promise<Paginated<Feedback>>;
};

export class FeedbackController {
  constructor(
    private readonly createFeedback: CreateFeedbackContract,
    private readonly listFeedbacks: ListFeedbacksContract,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { comment, attachments, userId, projectId } = req.body ?? {};
      requireFields({ userId, projectId });

      const feedback = await this.createFeedback.execute({
        comment,
        attachments,
        userId,
        projectId,
      });
      res.status(201).json(feedback);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const params = parsePaginationQuery(req.query);
      const feedbacks = await this.listFeedbacks.execute(params);
      res.status(200).json(feedbacks);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }
}
