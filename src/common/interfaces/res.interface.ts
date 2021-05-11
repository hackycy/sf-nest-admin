export interface ResOp<T> {
  data?: T;
  code?: number;
  message?: string;
}

export interface PageResult<T> {
  list?: Array<T>;
  pagination: {
    total: number;
    page: number;
    size: number;
  };
}
