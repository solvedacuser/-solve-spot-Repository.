import { NextResponse } from "next/server";
import { LeetCodeAppError, toLeetCodeApiErrorPayload } from "@/lib/leetcode/errors";
import { RecordAppError, toRecordApiErrorPayload } from "@/lib/record/errors";
import { toApiErrorPayload } from "@/lib/solvedac/errors";

export function apiErrorResponse(error: unknown) {
  const payload =
    error instanceof LeetCodeAppError
      ? toLeetCodeApiErrorPayload(error)
      : error instanceof RecordAppError
        ? toRecordApiErrorPayload(error)
        : toApiErrorPayload(error);
  return NextResponse.json({ error: payload }, { status: payload.status });
}

export function badJsonBodyResponse() {
  const payload = {
    code: "BAD_REQUEST",
    message: "Malformed JSON request body.",
    status: 400,
  };

  return NextResponse.json({ error: payload }, { status: payload.status });
}
