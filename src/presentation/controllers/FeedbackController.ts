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

export type UpdateFeedbackRequest = {
  comment?: string;
  attachments?: string;
};

type CreateFeedbackContract = {
  execute(data: CreateFeedbackRequest): Promise<Feedback>;
};

type UpdateFeedbackContract = {
  execute(id: string, data: UpdateFeedbackRequest): Promise<Feedback>;
};

type DeleteFeedbackContract = {
  execute(id: string): Promise<void>;
};

type ListFeedbacksContract = {
  execute(params: { page: number; limit: number }): Promise<Paginated<Feedback>>;
};

export class FeedbackController {
  constructor(
    private readonly createFeedback: CreateFeedbackContract,
    private readonly listFeedbacks: ListFeedbacksContract,
    private readonly updateFeedback?: UpdateFeedbackContract,
    private readonly deleteFeedback?: DeleteFeedbackContract,
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

  async update(req: Request, res: Response): Promise<void> {
    if (!this.updateFeedback) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    try {
      const id = req.params.id as string;
      const { comment, attachments } = req.body ?? {};

      const feedback = await this.updateFeedback.execute(id, { comment, attachments });
      res.status(200).json(feedback);
    } catch (error: unknown) {
      res.status(HttpErrorMapper.getStatusCode(error)).json({
        message: HttpErrorMapper.getMessage(error),
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    if (!this.deleteFeedback) {
      res.status(501).json({ message: "Not implemented" });
      return;
    }

    try {
      const id = req.params.id as string;
      await this.deleteFeedback.execute(id);
      res.status(204).send();
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
