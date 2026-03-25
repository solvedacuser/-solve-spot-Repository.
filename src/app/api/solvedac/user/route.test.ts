import { vi } from "vitest";
import { GET } from "@/app/api/solvedac/user/route";

vi.mock("@/lib/solvedac/service", () => ({
  loadUserInfo: vi.fn(),
}));

const { loadUserInfo } = await import("@/lib/solvedac/service");

describe("GET /api/solvedac/user", () => {
  it("returns valid handle info", async () => {
    vi.mocked(loadUserInfo).mockResolvedValue({
      handle: "tourist",
      tier: 30,
      solvedCount: 10000,
      maxStreak: 80,
      rating: 3500,
    });

    const response = await GET(new Request("http://localhost/api/solvedac/user?handle=tourist"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.handle).toBe("tourist");
  });
});
