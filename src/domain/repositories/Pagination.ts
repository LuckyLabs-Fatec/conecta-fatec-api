export type ListParams = {
  page: number;
  limit: number;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};
