import { NextResponse } from "next/server";
import { apiErrorResponse, badJsonBodyResponse } from "@/lib/api-response";
import { verifyLeetCodeProblemSolved } from "@/lib/leetcode/service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await verifyLeetCodeProblemSolved(body);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return badJsonBodyResponse();
    }

    return apiErrorResponse(error);
  }
}
