import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/record/insights/route";
import { RecordAppError } from "@/lib/record/errors";

vi.mock("@/lib/record/service", () => ({
  loadRecordInsights: vi.fn(),
}));

vi.mock("@/utils/supabase/route", () => ({
  createRouteHandlerClient: vi.fn(() => ({
    supabase: {},
    getResponse: () => new NextResponse(),
  })),
}));

const { loadRecordInsights } = await import("@/lib/record/service");

describe("record insights route", () => {
  it("returns team insights", async () => {
    vi.mocked(loadRecordInsights).mockResolvedValue({
      streak: {
        currentStreakDays: 2,
        lastVerifiedAt: "2026-05-27T01:00:00.000Z",
      },
      topContributors: [
        {
          userId: "22222222-2222-4222-8222-222222222222",
          name: "Alice",
          avatarLabel: "A",
          score: 4,
          records: 1,
          verifiedRecords: 1,
          feedbackComments: 1,
        },
      ],
    });

    const response = await GET(new NextRequest("http://localhost/api/record/insights?scope=team&teamId=123"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.streak.currentStreakDays).toBe(2);
    expect(loadRecordInsights).toHaveBeenCalledWith(expect.anything(), {
      scope: "team",
      teamId: "123",
    });
  });

  it("returns unauthorized errors", async () => {
    vi.mocked(loadRecordInsights).mockRejectedValue(new RecordAppError("UNAUTHORIZED", 401));

    const response = await GET(new NextRequest("http://localhost/api/record/insights?scope=allTeams"));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error.code).toBe("UNAUTHORIZED");
  });

  it("returns bad request for invalid scope", async () => {
    vi.mocked(loadRecordInsights).mockRejectedValue(new RecordAppError("BAD_REQUEST", 400));

    const response = await GET(new NextRequest("http://localhost/api/record/insights?scope=mine"));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("BAD_REQUEST");
  });

  it("returns forbidden for non-member teams", async () => {
    vi.mocked(loadRecordInsights).mockRejectedValue(new RecordAppError("FORBIDDEN", 403));

    const response = await GET(new NextRequest("http://localhost/api/record/insights?scope=team&teamId=999"));
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload.error.code).toBe("FORBIDDEN");
  });
});
