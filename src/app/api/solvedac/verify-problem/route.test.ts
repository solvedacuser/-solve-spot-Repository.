import { vi } from "vitest";
import { POST } from "@/app/api/solvedac/verify-problem/route";

vi.mock("@/lib/solvedac/service", () => ({
  verifyProblemSolved: vi.fn(),
}));

const { verifyProblemSolved } = await import("@/lib/solvedac/service");

describe("POST /api/solvedac/verify-problem", () => {
  it("returns solved true response", async () => {
    vi.mocked(verifyProblemSolved).mockResolvedValue({
      solved: true,
      query: "id:1000+s@tourist",
    });

    const response = await POST(
      new Request("http://localhost/api/solvedac/verify-problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          handle: "tourist",
          problemId: 1000,
        }),
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.solved).toBe(true);
    expect(payload.query).toBe("id:1000+s@tourist");
  });
});
