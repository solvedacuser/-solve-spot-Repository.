import { describe, expect, it } from "vitest";
import { listRecordsQuerySchema, recordInsightsQuerySchema } from "@/lib/record/schemas";

describe("record schemas", () => {
  it("rejects record team scope without a team id", () => {
    expect(() => listRecordsQuerySchema.parse({ scope: "team" })).toThrow();
  });

  it("rejects record team id outside team scope", () => {
    expect(() => listRecordsQuerySchema.parse({ teamId: "123" })).toThrow();
    expect(() => listRecordsQuerySchema.parse({ scope: "allTeams", teamId: "123" })).toThrow();
  });

  it("rejects invalid record list dates", () => {
    expect(() => listRecordsQuerySchema.parse({ from: "2026-02-31" })).toThrow();
    expect(() =>
      listRecordsQuerySchema.parse({
        from: "2026-05-31",
        to: "2026-05-01",
      }),
    ).toThrow();
  });

  it("rejects insight team scope without a team id", () => {
    expect(() => recordInsightsQuerySchema.parse({ scope: "team" })).toThrow();
  });

  it("rejects insight team id outside team scope", () => {
    expect(() => recordInsightsQuerySchema.parse({ scope: "allTeams", teamId: "123" })).toThrow();
  });
});
