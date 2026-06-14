import { vi } from "vitest";
import { GET } from "@/app/api/leetcode/skill/route";

vi.mock("@/lib/leetcode/service", () => ({
  loadLeetCodeSkillStats: vi.fn(),
}));

const { loadLeetCodeSkillStats } = await import("@/lib/leetcode/service");

describe("GET /api/leetcode/skill", () => {
  it("rejects missing username", async () => {
    const response = await GET(new Request("http://localhost/api/leetcode/skill"));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("BAD_REQUEST");
  });

  it("returns skill stats", async () => {
    vi.mocked(loadLeetCodeSkillStats).mockResolvedValue({
      username: "alice",
      groups: {
        fundamental: [{ tagName: "Array", tagSlug: "array", problemsSolved: 12 }],
        intermediate: [],
        advanced: [],
      },
    });

    const response = await GET(new Request("http://localhost/api/leetcode/skill?username=alice"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.groups.fundamental).toEqual([{ tagName: "Array", tagSlug: "array", problemsSolved: 12 }]);
  });
});
