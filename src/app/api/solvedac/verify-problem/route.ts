import { NextResponse } from "next/server";
import { apiErrorResponse, badJsonBodyResponse } from "@/lib/api-response";
import { verifyProblemSolved } from "@/lib/solvedac/service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await verifyProblemSolved(body);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return badJsonBodyResponse();
    }

    return apiErrorResponse(error);
  }
}
