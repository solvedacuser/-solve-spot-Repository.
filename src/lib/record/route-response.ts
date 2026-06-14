import { NextResponse } from "next/server";

export function recordJsonResponse(payload: unknown, response: NextResponse, init?: ResponseInit) {
  const json = NextResponse.json(payload, init);

  for (const cookie of response.cookies.getAll()) {
    json.cookies.set(cookie);
  }

  return json;
}
