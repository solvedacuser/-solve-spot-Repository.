import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

const EMAIL_CONFIRM_TYPE: EmailOtpType = "email";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next");
  const destination = next && next.startsWith("/") ? next : "/";

  if (!tokenHash || type !== EMAIL_CONFIRM_TYPE) {
    return NextResponse.redirect(new URL("/login?error=confirm_failed", request.url));
  }

  const response = NextResponse.redirect(new URL(destination, request.url));
  const { supabase, getResponse } = createRouteHandlerClient(request, response);
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: EMAIL_CONFIRM_TYPE,
  });

  if (error) {
    return NextResponse.redirect(new URL("/login?error=confirm_failed", request.url));
  }

  return getResponse();
}
