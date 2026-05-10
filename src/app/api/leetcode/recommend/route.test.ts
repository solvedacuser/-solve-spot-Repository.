import { POST } from "@/app/api/leetcode/recommend/route";

describe("POST /api/leetcode/recommend", () => {
  it("rejects invalid payload", async () => {
    const response = await POST(
      new Request("http://localhost/api/leetcode/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernames: ["alice"],
          count: 0,
        }),
      }),
    );

    expect(response.status).toBe(400);
  });
});
