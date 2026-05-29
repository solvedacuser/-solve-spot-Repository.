import { ZodError } from "zod";
import type { RecordApiErrorPayload, RecordAppErrorCode } from "@/lib/record/types";

const DEFAULT_MESSAGES: Record<RecordAppErrorCode, string> = {
  BAD_REQUEST: "The record request is invalid.",
  UNAUTHORIZED: "You must be signed in to use records.",
  FORBIDDEN: "You do not have access to this record.",
  NOT_FOUND: "The requested record was not found.",
  CONFLICT: "The record request conflicts with existing data.",
  INTERNAL_ERROR: "An unexpected record server error occurred.",
};

export class RecordAppError extends Error {
  code: RecordAppErrorCode;
  status: number;

  constructor(code: RecordAppErrorCode, status: number, message?: string) {
    super(message ?? DEFAULT_MESSAGES[code]);
    this.name = "RecordAppError";
    this.code = code;
    this.status = status;
  }
}

export function toRecordApiErrorPayload(error: unknown): RecordApiErrorPayload {
  if (error instanceof RecordAppError) {
    return {
      code: error.code,
      message: error.message,
      status: error.status,
    };
  }

  if (error instanceof ZodError) {
    return {
      code: "BAD_REQUEST",
      message: error.issues[0]?.message ?? "The record request failed validation.",
      status: 400,
    };
  }

  return {
    code: "INTERNAL_ERROR",
    message: DEFAULT_MESSAGES.INTERNAL_ERROR,
    status: 500,
  };
}

export function mapRecordDatabaseError(message?: string): RecordAppError {
  return new RecordAppError("INTERNAL_ERROR", 500, message ?? "The record database request failed.");
}
