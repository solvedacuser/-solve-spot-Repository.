import { type NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-response";
import { loadRecordInsights } from "@/lib/record/service";
import { createRouteHandlerClient } from "@/utils/supabase/route";

function jsonWithCookies(payload: unknown, response: NextResponse, init?: ResponseInit) {
  const json = NextResponse.json(payload, init);

  for (const cookie of response.cookies.getAll()) {
    json.cookies.set(cookie);
  }

  return json;
}

export async function GET(request: NextRequest) {
  const response = new NextResponse();
  const { supabase, getResponse } = createRouteHandlerClient(request, response);

  try {
    const query = Object.fromEntries(new URL(request.url).searchParams);
    const data = await loadRecordInsights(supabase, query);
    return jsonWithCookies(data, getResponse());
  } catch (error) {
    return apiErrorResponse(error);
  }
}
