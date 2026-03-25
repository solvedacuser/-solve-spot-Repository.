import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSolvedAcUserInfo } from "@/lib/solvedac/client";
import { SolvedAcAppError } from "@/lib/solvedac/errors";

describe("solved.ac client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("maps 404 to NOT_FOUND", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("{}", {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await expect(getSolvedAcUserInfo("tourist")).rejects.toMatchObject<SolvedAcAppError>({
      code: "NOT_FOUND",
      status: 404,
    });
  });

  it("maps 429 to RATE_LIMITED", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Too many requests" }), {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await expect(getSolvedAcUserInfo("tourist")).rejects.toMatchObject<SolvedAcAppError>({
      code: "RATE_LIMITED",
      status: 429,
    });
  });

  it("maps 5xx to UPSTREAM_ERROR", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("{}", {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await expect(getSolvedAcUserInfo("tourist")).rejects.toMatchObject<SolvedAcAppError>({
      code: "UPSTREAM_ERROR",
      status: 502,
    });
  });

  it("rejects malformed payloads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ handle: "tourist" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await expect(getSolvedAcUserInfo("tourist")).rejects.toBeTruthy();
  });
});
