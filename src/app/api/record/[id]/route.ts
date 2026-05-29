import { type NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-response";
import { loadRecordDetail } from "@/lib/record/service";
import { createRouteHandlerClient } from "@/utils/supabase/route";

type RecordRouteContext = {
  params: Promise<{ id: string }>;
};

function jsonWithCookies(payload: unknown, response: NextResponse, init?: ResponseInit) {
  const json = NextResponse.json(payload, init);

  for (const cookie of response.cookies.getAll()) {
    json.cookies.set(cookie);
  }

  return json;
}

export async function GET(request: NextRequest, context: RecordRouteContext) {
  const response = new NextResponse();
  const { supabase, getResponse } = createRouteHandlerClient(request, response);

  try {
    const { id } = await context.params;
    const data = await loadRecordDetail(supabase, id);
    return jsonWithCookies(data, getResponse());
  } catch (error) {
    return apiErrorResponse(error);
  }
}
