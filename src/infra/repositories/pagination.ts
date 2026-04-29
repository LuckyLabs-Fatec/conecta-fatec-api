import { ListParams, Paginated } from "@/domain/repositories/Pagination";

export const getPagination = (params: ListParams) => ({
  skip: (params.page - 1) * params.limit,
  take: params.limit,
});

export const toPaginated = <T>(
  items: T[],
  params: ListParams,
  totalItems: number,
): Paginated<T> => ({
  items,
  page: params.page,
  limit: params.limit,
  totalItems,
  totalPages: Math.max(1, Math.ceil(totalItems / params.limit)),
});
