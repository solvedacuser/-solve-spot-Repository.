import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/record/[id]/feedback/route";

vi.mock("@/lib/record/service", () => ({
  createFeedbackComment: vi.fn(),
}));

vi.mock("@/utils/supabase/route", () => ({
  createRouteHandlerClient: vi.fn(() => ({
    supabase: {},
    getResponse: () => new NextResponse(),
  })),
}));

const { createFeedbackComment } = await import("@/lib/record/service");

describe("record feedback route", () => {
  it("creates a feedback comment", async () => {
    vi.mocked(createFeedbackComment).mockResolvedValue({
      id: "33333333-3333-4333-8333-333333333333",
      recordId: "11111111-1111-4111-8111-111111111111",
      author: {
        id: "22222222-2222-4222-8222-222222222222",
        name: "Alice",
        avatarLabel: "A",
        role: "Member",
      },
      submittedAt: "2026-05-25T00:00:00.000Z",
      content: "Looks good.",
      createdAt: "2026-05-25T00:00:00.000Z",
      updatedAt: "2026-05-25T00:00:00.000Z",
    });

    const response = await POST(
      new NextRequest("http://localhost/api/record/11111111-1111-4111-8111-111111111111/feedback", {
        method: "POST",
        body: JSON.stringify({ content: "Looks good." }),
      }),
      {
        params: Promise.resolve({ id: "11111111-1111-4111-8111-111111111111" }),
      },
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.content).toBe("Looks good.");
  });

  it("rejects malformed JSON", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/record/11111111-1111-4111-8111-111111111111/feedback", {
        method: "POST",
        body: "{",
      }),
      {
        params: Promise.resolve({ id: "11111111-1111-4111-8111-111111111111" }),
      },
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("BAD_REQUEST");
  });
});
