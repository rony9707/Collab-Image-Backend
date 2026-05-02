// utils/pagination.util.ts

interface PaginationParams {
  page?: number;
  limit?: number;
}

export const getPagination = ({ page = 1, limit = 10 }: PaginationParams) => {
  const currentPage = Math.max(1, page);
  const perPage = Math.max(1, limit);

  const skip = (currentPage - 1) * perPage;

  return {
    currentPage,
    perPage,
    skip,
  };
};

export const getPaginationMeta = ({
  total,
  page,
  limit,
}: {
  total: number;
  page: number;
  limit: number;
}) => {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};