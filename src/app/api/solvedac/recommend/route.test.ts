import { POST } from "@/app/api/solvedac/recommend/route";

describe("POST /api/solvedac/recommend", () => {
  it("rejects invalid payload", async () => {
    const response = await POST(
      new Request("http://localhost/api/solvedac/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          handles: [],
          count: 0,
        }),
      }),
    );

    expect(response.status).toBe(400);
  });
});
