import { ZodError } from "zod";
import type { ApiErrorPayload, LeetCodeAppErrorCode } from "@/lib/leetcode/types";

const DEFAULT_MESSAGES: Record<LeetCodeAppErrorCode, string> = {
  NOT_FOUND: "The requested LeetCode resource was not found.",
  BAD_REQUEST: "The LeetCode request is invalid.",
  RATE_LIMITED: "LeetCode rate limited the request. Try again later.",
  UPSTREAM_ERROR: "LeetCode returned a response that could not be processed.",
  UNAVAILABLE: "LeetCode is currently unavailable.",
};

export class LeetCodeAppError extends Error {
  code: LeetCodeAppErrorCode;
  status: number;

  constructor(code: LeetCodeAppErrorCode, status: number, message?: string) {
    super(message ?? DEFAULT_MESSAGES[code]);
    this.name = "LeetCodeAppError";
    this.code = code;
    this.status = status;
  }
}

export function toLeetCodeApiErrorPayload(error: unknown): ApiErrorPayload {
  if (error instanceof LeetCodeAppError) {
    return {
      code: error.code,
      message: error.message,
      status: error.status,
    };
  }

  if (error instanceof ZodError) {
    return {
      code: "BAD_REQUEST",
      message: error.issues[0]?.message ?? "The request failed validation.",
      status: 400,
    };
  }

  return {
    code: "UPSTREAM_ERROR",
    message: "An unexpected server error occurred.",
    status: 500,
  };
}

export function mapLeetCodeHttpStatusToError(status: number, message?: string): LeetCodeAppError {
  if (status === 429) {
    return new LeetCodeAppError("RATE_LIMITED", 429, message);
  }

  if (status >= 500) {
    return new LeetCodeAppError("UNAVAILABLE", 503, message ?? "LeetCode is unavailable.");
  }

  return new LeetCodeAppError(
    "UPSTREAM_ERROR",
    502,
    message ?? `LeetCode returned an unexpected HTTP ${status} response.`,
  );
}
