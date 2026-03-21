// Standard API response envelope
export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// Standard API error shape from Django REST Framework
export type ApiError = {
  detail?: string;
  [field: string]: string | string[] | undefined;
};
