import { type NextRequest, NextResponse } from "next/server";
import { apiErrorResponse, badJsonBodyResponse } from "@/lib/api-response";
import { recordJsonResponse } from "@/lib/record/route-response";
import { createFeedbackComment } from "@/lib/record/service";
import { createRouteHandlerClient } from "@/utils/supabase/route";

type RecordFeedbackRouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RecordFeedbackRouteContext) {
  const response = new NextResponse();
  const { supabase, getResponse } = createRouteHandlerClient(request, response);

  try {
    const { id } = await context.params;
    const body = await request.json();
    const data = await createFeedbackComment(supabase, id, body);
    return recordJsonResponse(data, getResponse(), { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return badJsonBodyResponse();
    }

    return apiErrorResponse(error);
  }
}
