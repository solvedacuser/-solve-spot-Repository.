import { vi } from "vitest";
import { POST } from "@/app/api/leetcode/verify-problem/route";

vi.mock("@/lib/leetcode/service", () => ({
  verifyLeetCodeProblemSolved: vi.fn(),
}));

const { verifyLeetCodeProblemSolved } = await import("@/lib/leetcode/service");

describe("POST /api/leetcode/verify-problem", () => {
  it("returns UNKNOWN response", async () => {
    vi.mocked(verifyLeetCodeProblemSolved).mockResolvedValue({
      username: "alice",
      titleSlug: "two-sum",
      status: "UNKNOWN",
      solved: null,
      source: {
        mode: "RECENT_ACCEPTED_SUBMISSIONS",
        checkedLimit: 100,
      },
      reason: "The problem was not found in recent accepted submissions.",
    });

    const response = await POST(
      new Request("http://localhost/api/leetcode/verify-problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "alice",
          titleSlug: "two-sum",
          recentAcceptedLimit: 100,
        }),
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.status).toBe("UNKNOWN");
    expect(payload.solved).toBeNull();
  });
});
