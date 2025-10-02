// src/common/pagination/pagination.helper.ts
export interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class PaginationHelper {
  static buildPagination(page = 1, limit = 10): PaginationResult {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (safePage - 1) * safeLimit;

    return {
      skip,
      take: safeLimit,
      page: safePage,
      limit: safeLimit,
    };
  }

  static buildMeta(total: number, page: number, limit: number): PaginationMeta {
    const lastPage = Math.max(1, Math.ceil(total / limit));
    const hasNext = page < lastPage;
    const hasPrev = page > 1;

    return {
      total,
      page,
      limit,
      lastPage,
      hasNext,
      hasPrev,
    };
  }

  static buildPaginatedResponse<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
  ) {
    const pagination = this.buildMeta(total, page, limit);
    return {
      items,
      pagination,
    };
  }
}
