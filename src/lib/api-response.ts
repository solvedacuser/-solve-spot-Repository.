import { NextResponse } from "next/server";
import { LeetCodeAppError, toLeetCodeApiErrorPayload } from "@/lib/leetcode/errors";
import { SolvedAcAppError, toApiErrorPayload } from "@/lib/solvedac/errors";

export function apiErrorResponse(error: unknown) {
  const payload = error instanceof LeetCodeAppError ? toLeetCodeApiErrorPayload(error) : toApiErrorPayload(error);
  return NextResponse.json({ error: payload }, { status: payload.status });
}

export function badJsonBodyResponse() {
  const error = new SolvedAcAppError("BAD_REQUEST", 400, "JSON 본문 형식이 올바르지 않습니다.");
  return apiErrorResponse(error);
}
