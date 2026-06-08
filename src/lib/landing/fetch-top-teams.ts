import { headers } from "next/headers";
import { landingTopTeamsResponseSchema, type LandingTopTeam } from "@/lib/landing/top-teams";

export async function fetchLandingTopTeams(): Promise<LandingTopTeam[]> {
  const headerStore = await headers();
  const host = headerStore.get("host");

  if (!host) {
    return [];
  }

  const protocol = headerStore.get("x-forwarded-proto") ?? "http";
  const cookie = headerStore.get("cookie");
  const response = await fetch(`${protocol}://${host}/api/landing/top-teams`, {
    cache: "no-store",
    headers: cookie ? { cookie } : undefined,
  });

  if (!response.ok) {
    return [];
  }

  const payload = await response.json();
  return landingTopTeamsResponseSchema.parse(payload).items;
}
