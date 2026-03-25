import { buildRecommendationQuery, buildSolvedProblemQuery, normalizeLevelRange } from "@/lib/solvedac/query";

describe("solved.ac query builders", () => {
  it("builds solved verification query", () => {
    expect(buildSolvedProblemQuery("tourist", 1000)).toBe("id:1000+s@tourist");
  });

  it("normalizes reversed level ranges", () => {
    expect(normalizeLevelRange(20, 10)).toEqual({ min: 10, max: 20 });
  });

  it("deduplicates handles in recommendation query", () => {
    expect(
      buildRecommendationQuery({
        handles: ["tourist", "tourist", "cubelover"],
        minLevel: 5,
        maxLevel: 7,
      }),
    ).toBe("*5..7+s#1000..+lang:ko+!s@tourist+!s@cubelover");
  });

  it("adds tag filters to recommendation query", () => {
    expect(
      buildRecommendationQuery({
        handles: ["tourist"],
        tagKeys: ["implementation", "graph"],
      }),
    ).toBe("*1..30+s#1000..+lang:ko+(tag:implementation|tag:graph)+!s@tourist");
  });
});
