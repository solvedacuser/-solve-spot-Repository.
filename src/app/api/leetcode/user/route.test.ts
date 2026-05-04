import { vi } from "vitest";
import { GET } from "@/app/api/leetcode/user/route";

vi.mock("@/lib/leetcode/service", () => ({
  loadLeetCodeUserInfo: vi.fn(),
}));

const { loadLeetCodeUserInfo } = await import("@/lib/leetcode/service");

describe("GET /api/leetcode/user", () => {
  it("rejects missing username", async () => {
    const response = await GET(new Request("http://localhost/api/leetcode/user"));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("BAD_REQUEST");
  });

  it("returns user info", async () => {
    vi.mocked(loadLeetCodeUserInfo).mockResolvedValue({
      username: "alice",
      profile: {
        ranking: 123,
        avatarUrl: "",
        realName: "Alice",
        reputation: 42,
      },
      solved: {
        total: 10,
        easy: 4,
        medium: 5,
        hard: 1,
      },
    });

    const response = await GET(new Request("http://localhost/api/leetcode/user?username=alice"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.username).toBe("alice");
  });
});
