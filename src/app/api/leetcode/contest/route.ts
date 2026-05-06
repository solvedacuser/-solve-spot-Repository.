import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-response";
import { LeetCodeAppError } from "@/lib/leetcode/errors";
import { loadLeetCodeContest } from "@/lib/leetcode/service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      throw new LeetCodeAppError("BAD_REQUEST", 400, "username query parameter is required.");
    }

    const data = await loadLeetCodeContest(username);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
