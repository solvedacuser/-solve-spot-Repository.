import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/app/api/record/teams/route";
import { RecordAppError } from "@/lib/record/errors";

vi.mock("@/lib/record/service", () => ({
  createRecordTeam: vi.fn(),
  listRecordTeams: vi.fn(),
}));

vi.mock("@/utils/supabase/route", () => ({
  createRouteHandlerClient: vi.fn(() => ({
    supabase: {},
    getResponse: () => new NextResponse(),
  })),
}));

const { createRecordTeam, listRecordTeams } = await import("@/lib/record/service");

describe("record teams route", () => {
  it("returns the signed-in user's teams", async () => {
    vi.mocked(listRecordTeams).mockResolvedValue([
      {
        id: 123,
        name: "Algorithms",
      },
    ]);

    const response = await GET(new NextRequest("http://localhost/api/record/teams"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual([{ id: 123, name: "Algorithms" }]);
    expect(listRecordTeams).toHaveBeenCalledWith(expect.anything());
  });

  it("returns unauthorized errors for signed-out users", async () => {
    vi.mocked(listRecordTeams).mockRejectedValue(new RecordAppError("UNAUTHORIZED", 401));

    const response = await GET(new NextRequest("http://localhost/api/record/teams"));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error.code).toBe("UNAUTHORIZED");
  });

  it("returns only the service-approved team list", async () => {
    vi.mocked(listRecordTeams).mockResolvedValue([]);

    const response = await GET(new NextRequest("http://localhost/api/record/teams"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual([]);
  });

  it("creates a team", async () => {
    vi.mocked(createRecordTeam).mockResolvedValue({
      id: 123,
      name: "Algorithms",
    });

    const response = await POST(
      new NextRequest("http://localhost/api/record/teams", {
        method: "POST",
        body: JSON.stringify({
          teamName: "Algorithms",
          description: "Practice together",
          invitedUsers: [],
        }),
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload).toEqual({ id: 123, name: "Algorithms" });
    expect(createRecordTeam).toHaveBeenCalledWith(expect.anything(), {
      teamName: "Algorithms",
      description: "Practice together",
      invitedUsers: [],
    });
  });

  it("rejects malformed create JSON", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/record/teams", {
        method: "POST",
        body: "{",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("BAD_REQUEST");
  });
});
