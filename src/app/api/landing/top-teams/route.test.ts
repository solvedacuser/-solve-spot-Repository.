import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/landing/top-teams/route";

vi.mock("@/lib/landing/top-teams", () => ({
  loadLandingTopTeams: vi.fn(),
}));

vi.mock("@/utils/supabase/route", () => ({
  createRouteHandlerClient: vi.fn(() => ({
    supabase: {},
    getResponse: () => new NextResponse(),
  })),
}));

const { loadLandingTopTeams } = await import("@/lib/landing/top-teams");

describe("GET /api/landing/top-teams", () => {
  it("returns landing top teams", async () => {
    vi.mocked(loadLandingTopTeams).mockResolvedValue({
      items: [
        {
          rank: 1,
          teamId: 10,
          teamName: "Algo Masters",
          teamLeader: "kimdev",
          solved: 42,
          memberCount: 5,
        },
      ],
    });

    const response = await GET(new NextRequest("http://localhost/api/landing/top-teams"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.items).toEqual([
      {
        rank: 1,
        teamId: 10,
        teamName: "Algo Masters",
        teamLeader: "kimdev",
        solved: 42,
        memberCount: 5,
      },
    ]);
    expect(loadLandingTopTeams).toHaveBeenCalledWith(expect.anything());
  });
});
