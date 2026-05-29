import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/record/[id]/route";
import { RecordAppError } from "@/lib/record/errors";

vi.mock("@/lib/record/service", () => ({
  loadRecordDetail: vi.fn(),
}));

vi.mock("@/utils/supabase/route", () => ({
  createRouteHandlerClient: vi.fn(() => ({
    supabase: {},
    getResponse: () => new NextResponse(),
  })),
}));

const { loadRecordDetail } = await import("@/lib/record/service");

describe("record detail route", () => {
  it("returns one record detail", async () => {
    vi.mocked(loadRecordDetail).mockResolvedValue({
      record: {
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
      },
      comments: [],
    });

    const response = await GET(new NextRequest("http://localhost/api/record/11111111-1111-4111-8111-111111111111"), {
      params: Promise.resolve({ id: "11111111-1111-4111-8111-111111111111" }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.record.id).toBe("11111111-1111-4111-8111-111111111111");
  });

  it("returns not found errors", async () => {
    vi.mocked(loadRecordDetail).mockRejectedValue(new RecordAppError("NOT_FOUND", 404));

    const response = await GET(new NextRequest("http://localhost/api/record/missing"), {
      params: Promise.resolve({ id: "11111111-1111-4111-8111-111111111111" }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.error.code).toBe("NOT_FOUND");
  });
});
