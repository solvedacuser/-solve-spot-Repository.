import { vi } from "vitest";
import { GET } from "@/app/api/leetcode/contest/route";

vi.mock("@/lib/leetcode/service", () => ({
  loadLeetCodeContest: vi.fn(),
}));

const { loadLeetCodeContest } = await import("@/lib/leetcode/service");

describe("GET /api/leetcode/contest", () => {
  it("rejects missing username", async () => {
    const response = await GET(new Request("http://localhost/api/leetcode/contest"));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("BAD_REQUEST");
  });

  it("returns contest stats", async () => {
    vi.mocked(loadLeetCodeContest).mockResolvedValue({
      username: "alice",
      ranking: null,
      history: [],
    });

    const response = await GET(new Request("http://localhost/api/leetcode/contest?username=alice"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      username: "alice",
      ranking: null,
      history: [],
    });
  });
});
