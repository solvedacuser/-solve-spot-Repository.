import { describe, expect, it } from "vitest";
import { listRecordsQuerySchema } from "@/lib/record/schemas";

describe("record schemas", () => {
  it("defaults record list scope to mine", () => {
    const result = listRecordsQuerySchema.parse({ limit: "50" });

    expect(result).toMatchObject({
      scope: "mine",
      limit: 50,
    });
  });

  it("accepts team scope with a team id", () => {
    const result = listRecordsQuerySchema.parse({
      scope: "team",
      teamId: "123",
    });

    expect(result.scope).toBe("team");
    expect(result.teamId).toBe(123);
  });

  it("accepts all-team scope with a date range", () => {
    const result = listRecordsQuerySchema.parse({
      scope: "allTeams",
      from: "2026-05-01",
      to: "2026-05-31",
    });

    expect(result.scope).toBe("allTeams");
    expect(result.from).toBe("2026-05-01");
    expect(result.to).toBe("2026-05-31");
  });

  it("rejects team scope without a team id", () => {
    expect(() => listRecordsQuerySchema.parse({ scope: "team" })).toThrow();
  });

  it("rejects team id outside team scope", () => {
    expect(() => listRecordsQuerySchema.parse({ teamId: "123" })).toThrow();
    expect(() => listRecordsQuerySchema.parse({ scope: "allTeams", teamId: "123" })).toThrow();
  });

  it("rejects invalid dates", () => {
    expect(() => listRecordsQuerySchema.parse({ from: "2026-02-31" })).toThrow();
    expect(() =>
      listRecordsQuerySchema.parse({
        from: "2026-05-31",
        to: "2026-05-01",
      }),
    ).toThrow();
  });
});
