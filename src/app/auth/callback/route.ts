import { type NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const destination = next && next.startsWith("/") ? next : "/";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  const response = NextResponse.redirect(new URL(destination, request.url));
  const { supabase, getResponse } = createRouteHandlerClient(request, response);
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/login?error=confirm_failed", request.url));
  }

  return getResponse();
}
