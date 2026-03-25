import { vi } from "vitest";
import { GET } from "@/app/api/solvedac/bio/route";

vi.mock("@/lib/solvedac/service", () => ({
  loadUserBio: vi.fn(),
}));

const { loadUserBio } = await import("@/lib/solvedac/service");

describe("GET /api/solvedac/bio", () => {
  it("returns bio data", async () => {
    vi.mocked(loadUserBio).mockResolvedValue({
      handle: "tourist",
      bio: "hello world",
    });

    const response = await GET(new Request("http://localhost/api/solvedac/bio?handle=tourist"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.bio).toBe("hello world");
  });
});
