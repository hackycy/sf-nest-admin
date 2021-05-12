export class ResOp<T> {
  data?: T;
  code?: number;
  message?: string;
}

export class PageResult<T> {
  list?: Array<T>;
  pagination: {
    total: number;
    page: number;
    size: number;
  };
}
