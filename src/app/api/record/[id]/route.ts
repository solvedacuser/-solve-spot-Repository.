import { type NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-response";
import { recordJsonResponse } from "@/lib/record/route-response";
import { loadRecordDetail } from "@/lib/record/service";
import { createRouteHandlerClient } from "@/utils/supabase/route";

type RecordRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RecordRouteContext) {
  const response = new NextResponse();
  const { supabase, getResponse } = createRouteHandlerClient(request, response);

  try {
    const { id } = await context.params;
    const data = await loadRecordDetail(supabase, id);
    return recordJsonResponse(data, getResponse());
  } catch (error) {
    return apiErrorResponse(error);
  }
}
