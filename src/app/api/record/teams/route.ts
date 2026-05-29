import { type NextRequest, NextResponse } from "next/server";
import { apiErrorResponse, badJsonBodyResponse } from "@/lib/api-response";
import { createRecordTeam, listRecordTeams } from "@/lib/record/service";
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
    const data = await listRecordTeams(supabase);
    return jsonWithCookies(data, getResponse());
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const response = new NextResponse();
  const { supabase, getResponse } = createRouteHandlerClient(request, response);

  try {
    const body = await request.json();
    const data = await createRecordTeam(supabase, body);
    return jsonWithCookies(data, getResponse(), { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return badJsonBodyResponse();
    }

    return apiErrorResponse(error);
  }
}
