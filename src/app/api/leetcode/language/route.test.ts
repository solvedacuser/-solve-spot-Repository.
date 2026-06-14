import { vi } from "vitest";
import { GET } from "@/app/api/leetcode/language/route";

vi.mock("@/lib/leetcode/service", () => ({
  loadLeetCodeLanguageStats: vi.fn(),
}));

const { loadLeetCodeLanguageStats } = await import("@/lib/leetcode/service");

describe("GET /api/leetcode/language", () => {
  it("rejects missing username", async () => {
    const response = await GET(new Request("http://localhost/api/leetcode/language"));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("BAD_REQUEST");
  });

  it("returns language stats", async () => {
    vi.mocked(loadLeetCodeLanguageStats).mockResolvedValue({
      username: "alice",
      languages: [{ languageName: "TypeScript", problemsSolved: 7 }],
    });

    const response = await GET(new Request("http://localhost/api/leetcode/language?username=alice"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.languages).toEqual([{ languageName: "TypeScript", problemsSolved: 7 }]);
  });
});
