import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-response";
import { loadUserInfo } from "@/lib/solvedac/service";
import { SolvedAcAppError } from "@/lib/solvedac/errors";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const handle = searchParams.get("handle");

    if (!handle) {
      throw new SolvedAcAppError("BAD_REQUEST", 400, "handle 쿼리 파라미터가 필요합니다.");
    }

    const data = await loadUserInfo(handle);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
