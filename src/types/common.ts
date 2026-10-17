/**
 * Shared / cross-cutting TypeScript types.
 * Feature-specific types belong in their own `features/<name>/types/` directory.
 */

// ── Base Entity ──────────────────────────────────────────────────────────────
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ── Paginated API Response ───────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ── Discriminated Union for Async State ──────────────────────────────────────
// Use this instead of separate `isLoading` / `isError` booleans to prevent
// impossible states (e.g. loading AND error at the same time).
export type AsyncState<T> =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: T | null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: string };

// ── Generic API Error ────────────────────────────────────────────────────────
export interface ApiError {
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}
