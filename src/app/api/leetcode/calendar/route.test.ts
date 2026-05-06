import { vi } from "vitest";
import { GET } from "@/app/api/leetcode/calendar/route";

vi.mock("@/lib/leetcode/service", () => ({
  loadLeetCodeCalendar: vi.fn(),
}));

const { loadLeetCodeCalendar } = await import("@/lib/leetcode/service");

describe("GET /api/leetcode/calendar", () => {
  it("rejects missing username", async () => {
    const response = await GET(new Request("http://localhost/api/leetcode/calendar?year=2026"));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("BAD_REQUEST");
  });

  it("rejects missing year", async () => {
    const response = await GET(new Request("http://localhost/api/leetcode/calendar?username=alice"));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("BAD_REQUEST");
  });

  it("rejects non-integer year", async () => {
    const response = await GET(new Request("http://localhost/api/leetcode/calendar?username=alice&year=2026.5"));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("BAD_REQUEST");
  });

  it("rejects out-of-range year", async () => {
    const response = await GET(new Request("http://localhost/api/leetcode/calendar?username=alice&year=1900"));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("BAD_REQUEST");
  });

  it("returns calendar stats", async () => {
    vi.mocked(loadLeetCodeCalendar).mockResolvedValue({
      username: "alice",
      year: 2026,
      activeYears: [2026],
      streak: 3,
      totalActiveDays: 4,
      submissionCalendar: { "1767225600": 2 },
      dccBadges: [],
    });

    const response = await GET(new Request("http://localhost/api/leetcode/calendar?username=alice&year=2026"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.submissionCalendar).toEqual({ "1767225600": 2 });
    expect(loadLeetCodeCalendar).toHaveBeenCalledWith("alice", 2026);
  });
});
