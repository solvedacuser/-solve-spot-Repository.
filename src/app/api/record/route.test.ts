import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/app/api/record/route";

vi.mock("@/lib/record/service", () => ({
  createRecord: vi.fn(),
  listRecords: vi.fn(),
}));

vi.mock("@/utils/supabase/route", () => ({
  createRouteHandlerClient: vi.fn(() => ({
    supabase: {},
    getResponse: () => new NextResponse(),
  })),
}));

const { createRecord, listRecords } = await import("@/lib/record/service");

describe("record collection route", () => {
  it("returns record list data", async () => {
    vi.mocked(listRecords).mockResolvedValue({ items: [] });

    const response = await GET(new NextRequest("http://localhost/api/record?limit=10"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.items).toEqual([]);
    expect(listRecords).toHaveBeenCalledWith(expect.anything(), { limit: "10" });
  });

  it("creates a record", async () => {
    vi.mocked(createRecord).mockResolvedValue({
      id: "11111111-1111-4111-8111-111111111111",
      author: {
        id: "22222222-2222-4222-8222-222222222222",
        name: "Alice",
        avatarLabel: "A",
        role: "Member",
      },
      submittedAt: "2026-05-25T00:00:00.000Z",
      problem: {
        title: "Two Sum",
        titleSlug: "two-sum",
        difficulty: "Easy",
        tags: ["Array"],
      },
      status: "Review Requested",
      language: "TypeScript",
      runtime: null,
      memory: null,
      comments: 0,
      code: "return [];",
      reviewNote: null,
      createdAt: "2026-05-25T00:00:00.000Z",
      updatedAt: "2026-05-25T00:00:00.000Z",
    });

    const response = await POST(
      new NextRequest("http://localhost/api/record", {
        method: "POST",
        body: JSON.stringify({
          problemTitle: "Two Sum",
          titleSlug: "two-sum",
          difficulty: "Easy",
          tags: ["Array"],
          language: "TypeScript",
          code: "return [];",
        }),
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.id).toBe("11111111-1111-4111-8111-111111111111");
  });

  it("rejects malformed JSON", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/record", {
        method: "POST",
        body: "{",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("BAD_REQUEST");
  });
});
