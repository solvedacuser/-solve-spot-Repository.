import { type NextRequest, NextResponse } from "next/server";
import { apiErrorResponse, badJsonBodyResponse } from "@/lib/api-response";
import { createFeedbackComment } from "@/lib/record/service";
import { createRouteHandlerClient } from "@/utils/supabase/route";

type RecordFeedbackRouteContext = {
  params: Promise<{ id: string }>;
};

function jsonWithCookies(payload: unknown, response: NextResponse, init?: ResponseInit) {
  const json = NextResponse.json(payload, init);

  for (const cookie of response.cookies.getAll()) {
    json.cookies.set(cookie);
  }

  return json;
}

export async function POST(request: NextRequest, context: RecordFeedbackRouteContext) {
  const response = new NextResponse();
  const { supabase, getResponse } = createRouteHandlerClient(request, response);

  try {
    const { id } = await context.params;
    const body = await request.json();
    const data = await createFeedbackComment(supabase, id, body);
    return jsonWithCookies(data, getResponse(), { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return badJsonBodyResponse();
    }

    return apiErrorResponse(error);
  }
}
