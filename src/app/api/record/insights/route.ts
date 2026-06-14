import { type NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-response";
import { recordJsonResponse } from "@/lib/record/route-response";
import { loadRecordInsights } from "@/lib/record/service";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export async function GET(request: NextRequest) {
  const response = new NextResponse();
  const { supabase, getResponse } = createRouteHandlerClient(request, response);

  try {
    const query = Object.fromEntries(new URL(request.url).searchParams);
    const data = await loadRecordInsights(supabase, query);
    return recordJsonResponse(data, getResponse());
  } catch (error) {
    return apiErrorResponse(error);
  }
}
