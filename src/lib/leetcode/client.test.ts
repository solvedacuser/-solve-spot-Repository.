import { describe, expect, it, vi, afterEach } from "vitest";
import { getLeetCodeUserData } from "@/lib/leetcode/client";
import { LeetCodeAppError } from "@/lib/leetcode/errors";

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockFetchResponse(payload: unknown, init: ResponseInit = { status: 200 }) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(payload), {
        status: init.status ?? 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ),
  );
}

describe("LeetCode GraphQL client", () => {
  it("maps GraphQL errors to UPSTREAM_ERROR", async () => {
    mockFetchResponse({
      errors: [{ message: "GraphQL failed" }],
    });

    await expect(getLeetCodeUserData("alice")).rejects.toMatchObject({
      code: "UPSTREAM_ERROR",
      status: 502,
    });
  });

  it("maps malformed GraphQL data to UPSTREAM_ERROR", async () => {
    mockFetchResponse({
      data: {
        matchedUser: {
          username: "alice",
        },
      },
    });

    await expect(getLeetCodeUserData("alice")).rejects.toMatchObject({
      code: "UPSTREAM_ERROR",
      status: 502,
    });
  });

  it("maps LeetCode HTTP 429 to RATE_LIMITED", async () => {
    mockFetchResponse({ message: "Too many requests" }, { status: 429 });

    await expect(getLeetCodeUserData("alice")).rejects.toBeInstanceOf(LeetCodeAppError);
    await expect(getLeetCodeUserData("alice")).rejects.toMatchObject({
      code: "RATE_LIMITED",
      status: 429,
    });
  });
});
