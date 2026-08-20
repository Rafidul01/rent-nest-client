import type { ApiSuccessResponse } from "@/app/lib/types";

const DEFAULT_RETRIES = 3;
const RETRY_DELAY_MS = 400;

const IDEMPOTENT_METHODS = new Set(["GET", "PUT", "DELETE"]);

interface FetchApiOptions {
  /** Total attempts including the first. Defaults to 3 for idempotent methods, 1 otherwise. */
  retries?: number;
}

/**
 * fetch() that retries transient network failures (e.g. a flaky edge node)
 * with linear backoff. Only idempotent methods (GET/PUT/DELETE) retry by
 * default — mutations (POST/PATCH) are never retried to avoid duplicate
 * side effects. HTTP error responses (non-2xx) are returned as-is; callers
 * handle those via `res.ok`.
 */
export const fetchApi = async (
  url: string,
  init: RequestInit = {},
  options: FetchApiOptions = {},
): Promise<Response> => {
  const method = (init.method ?? "GET").toUpperCase();
  const attempts =
    options.retries ?? (IDEMPOTENT_METHODS.has(method) ? DEFAULT_RETRIES : 1);
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await fetch(url, init);
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)),
        );
      }
    }
  }

  throw lastError;
};

/**
 * Fetch a list-shaped endpoint defensively: returns `[]` on any network
 * failure, HTTP error, or unexpected payload so dashboard/public reads never
 * crash a page.
 */
export const fetchList = async <T>(
  url: string,
  init: RequestInit = {},
  options: FetchApiOptions = {},
): Promise<T[]> => {
  try {
    const res = await fetchApi(url, init, options);
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !Array.isArray(json?.data)) return [];
    return json.data as T[];
  } catch {
    return [];
  }
};

/**
 * Fetch an envelope-shaped endpoint defensively: returns a
 * `{ success: false, data: [] }` shape on any network failure, HTTP error, or
 * unexpected payload, so `.data` consumers always get an array.
 */
export const fetchEnvelopeOrEmpty = async <T>(
  url: string,
  init: RequestInit = {},
  options: FetchApiOptions = {},
): Promise<ApiSuccessResponse<T[]> | { success: false; message: string; data: [] }> => {
  try {
    const res = await fetchApi(url, init, options);
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !Array.isArray(json?.data)) {
      return {
        success: false,
        message: json.message || "Request failed",
        data: [],
      };
    }
    return json as ApiSuccessResponse<T[]>;
  } catch {
    return { success: false, message: "Could not reach the server.", data: [] };
  }
};