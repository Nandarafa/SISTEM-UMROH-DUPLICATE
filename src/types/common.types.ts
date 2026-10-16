export type Role = "super_admin" | "admin" | "agent" | "pilgrim" | "guide";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  branchId?: string | null;
  branchName?: string;
}

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type SortDirection = "asc" | "desc";

export type ApiResult<T> = {
  data: T | null;
  error: string | null;
};

export type Option = {
  label: string;
  value: string;
};
