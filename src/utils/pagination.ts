export class PaginationOptions {
  page: number = 1;

  limit: number = 10;
}
export interface IPaginationResponse<T> {
  limit: number;
  page: number;
  total: number;
  prevPage: number | null;
  nextPage: number | null;
  lastPage: number;
  data: T[];
}
export function toPaginateResponse<D>(
  result: [Array<D>, number],
  page: number,
  limit: number,
): IPaginationResponse<D> {
  const [data, total] = result;
  const lastPage = Math.ceil(total / limit);
  const nextPage = page + 1 > lastPage ? null : page + 1;
  const prevPage = page - 1 < 1 ? null : page - 1;
  return {
    limit,
    page,
    total,
    prevPage,
    nextPage,
    lastPage,
    data,
  };
}
