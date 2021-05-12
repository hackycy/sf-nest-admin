export class ResOp<T> {
  data?: T;
  code?: number;
  message?: string;
}

export class Pagination {
  total: number;
  page: number;
  size: number;
}

export class PageResult<T> {
  list?: Array<T>;
  pagination: Pagination;
}
