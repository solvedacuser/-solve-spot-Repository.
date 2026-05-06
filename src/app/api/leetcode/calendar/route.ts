import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-response";
import { LeetCodeAppError } from "@/lib/leetcode/errors";
import { calendarYearSchema } from "@/lib/leetcode/schemas";
import { loadLeetCodeCalendar } from "@/lib/leetcode/service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const year = searchParams.get("year");

    if (!username) {
      throw new LeetCodeAppError("BAD_REQUEST", 400, "username query parameter is required.");
    }

    if (!year) {
      throw new LeetCodeAppError("BAD_REQUEST", 400, "year query parameter is required.");
    }

    const parsedYear = calendarYearSchema.parse(year);
    const data = await loadLeetCodeCalendar(username, parsedYear);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
