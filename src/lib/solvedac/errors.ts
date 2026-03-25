import { ZodError } from "zod";
import type { ApiErrorPayload, AppErrorCode } from "@/lib/solvedac/types";

const DEFAULT_MESSAGES: Record<AppErrorCode, string> = {
  NOT_FOUND: "요청한 solved.ac 리소스를 찾을 수 없습니다.",
  BAD_REQUEST: "잘못된 요청입니다.",
  RATE_LIMITED: "solved.ac 호출 제한에 도달했습니다. 잠시 후 다시 시도해주세요.",
  UPSTREAM_ERROR: "solved.ac 응답을 처리하지 못했습니다.",
  UNAVAILABLE: "solved.ac 서비스가 현재 불안정합니다.",
};

export class SolvedAcAppError extends Error {
  code: AppErrorCode;
  status: number;

  constructor(code: AppErrorCode, status: number, message?: string) {
    super(message ?? DEFAULT_MESSAGES[code]);
    this.name = "SolvedAcAppError";
    this.code = code;
    this.status = status;
  }
}

export function toApiErrorPayload(error: unknown): ApiErrorPayload {
  if (error instanceof SolvedAcAppError) {
    return {
      code: error.code,
      message: error.message,
      status: error.status,
    };
  }

  if (error instanceof ZodError) {
    return {
      code: "BAD_REQUEST",
      message: error.issues[0]?.message ?? "요청 값 검증에 실패했습니다.",
      status: 400,
    };
  }

  return {
    code: "UPSTREAM_ERROR",
    message: "예상하지 못한 서버 오류가 발생했습니다.",
    status: 500,
  };
}

export function mapHttpStatusToError(status: number, message?: string): SolvedAcAppError {
  if (status === 404) {
    return new SolvedAcAppError("NOT_FOUND", 404, message ?? "solved.ac에서 대상을 찾지 못했습니다.");
  }

  if (status === 429) {
    return new SolvedAcAppError("RATE_LIMITED", 429, message);
  }

  if (status >= 400 && status < 500) {
    return new SolvedAcAppError("BAD_REQUEST", status, message);
  }

  return new SolvedAcAppError("UPSTREAM_ERROR", 502, message ?? "solved.ac 상위 서버 오류가 발생했습니다.");
}
