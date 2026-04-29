import { Feedback } from "@/domain/models/Feedback";
import {
  CreateFeedbackParams,
  FeedbackRepository,
} from "@/domain/repositories/FeedbackRepository";
import { ListParams, Paginated } from "@/domain/repositories/Pagination";
import { getPrismaClient } from "@/infra/database/prisma/client";
import { getPagination, toPaginated } from "@/infra/repositories/pagination";

type FeedbackRecord = {
  id: string;
  comment: string | null;
  attachments: string | null;
  createdAt: Date;
  userId: string;
  projectId: string;
};

type PrismaClientLike = {
  feedback: {
    create(args: {
      data: {
        comment?: string;
        attachments?: string;
        user: { connect: { id: string } };
        project: { connect: { id: string } };
      };
    }): Promise<FeedbackRecord>;
    findMany(args: {
      skip: number;
      take: number;
      orderBy: { createdAt: "desc" };
    }): Promise<FeedbackRecord[]>;
    count(): Promise<number>;
  };
};

const mapFeedback = (feedback: FeedbackRecord): Feedback => ({
  id: feedback.id,
  comment: feedback.comment ?? undefined,
  attachments: feedback.attachments ?? undefined,
  createdAt: feedback.createdAt,
  userId: feedback.userId,
  projectId: feedback.projectId,
});

export class PrismaFeedbackRepository implements FeedbackRepository {
  constructor(
    private readonly db: PrismaClientLike = getPrismaClient() as unknown as PrismaClientLike,
  ) {}

  async create(data: CreateFeedbackParams): Promise<Feedback> {
    const feedback = await this.db.feedback.create({
      data: {
        comment: data.comment,
        attachments: data.attachments,
        user: { connect: { id: data.userId } },
        project: { connect: { id: data.projectId } },
      },
    });

    return mapFeedback(feedback);
  }

  async findPaginated(params: ListParams): Promise<Paginated<Feedback>> {
    const [totalItems, feedbacks] = await Promise.all([
      this.db.feedback.count(),
      this.db.feedback.findMany({
        ...getPagination(params),
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return toPaginated(feedbacks.map(mapFeedback), params, totalItems);
  }
}
