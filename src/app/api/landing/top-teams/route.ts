import { type NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { apiErrorResponse } from "@/lib/api-response";
import { loadLandingTopTeams } from "@/lib/landing/top-teams";
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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const routeClient =
    supabaseUrl && serviceRoleKey
      ? {
          supabase: createSupabaseClient(supabaseUrl, serviceRoleKey, {
            auth: {
              autoRefreshToken: false,
              persistSession: false,
            },
          }),
          getResponse: () => response,
        }
      : createRouteHandlerClient(request, response);

  try {
    const data = await loadLandingTopTeams(routeClient.supabase);
    return jsonWithCookies(data, routeClient.getResponse());
  } catch (error) {
    return apiErrorResponse(error);
  }
}
