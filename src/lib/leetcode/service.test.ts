import { beforeEach, describe, expect, it, vi } from "vitest";
import { LeetCodeAppError } from "@/lib/leetcode/errors";
import {
  loadLeetCodeCalendar,
  loadLeetCodeLanguageStats,
  loadLeetCodeSkillStats,
  loadLeetCodeUserInfo,
} from "@/lib/leetcode/service";

vi.mock("@/lib/leetcode/client", () => ({
  getLeetCodeCalendarData: vi.fn(),
  getLeetCodeLanguageData: vi.fn(),
  getLeetCodeUserData: vi.fn(),
  getLeetCodeSkillData: vi.fn(),
}));

const {
  getLeetCodeCalendarData,
  getLeetCodeLanguageData,
  getLeetCodeUserData,
  getLeetCodeSkillData,
} = await import("@/lib/leetcode/client");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("LeetCode service", () => {
  it("maps matchedUser null to NOT_FOUND", async () => {
    vi.mocked(getLeetCodeUserData).mockResolvedValue({
      allQuestionsCount: [],
      matchedUser: null,
    });

    await expect(loadLeetCodeUserInfo("missing-user")).rejects.toBeInstanceOf(LeetCodeAppError);
    await expect(loadLeetCodeUserInfo("missing-user")).rejects.toMatchObject({
      code: "NOT_FOUND",
      status: 404,
    });
  });

  it("maps matchedUser null to NOT_FOUND for P1 profile extensions", async () => {
    vi.mocked(getLeetCodeLanguageData).mockResolvedValue({ matchedUser: null });
    vi.mocked(getLeetCodeSkillData).mockResolvedValue({ matchedUser: null });
    vi.mocked(getLeetCodeCalendarData).mockResolvedValue({ matchedUser: null });

    await expect(loadLeetCodeLanguageStats("missing-language-user")).rejects.toMatchObject({
      code: "NOT_FOUND",
      status: 404,
    });
    await expect(loadLeetCodeSkillStats("missing-skill-user")).rejects.toMatchObject({
      code: "NOT_FOUND",
      status: 404,
    });
    await expect(loadLeetCodeCalendar("missing-calendar-user", 2026)).rejects.toMatchObject({
      code: "NOT_FOUND",
      status: 404,
    });
  });

  it("maps language stats", async () => {
    vi.mocked(getLeetCodeLanguageData).mockResolvedValue({
      matchedUser: {
        username: "language-user",
        languageProblemCount: [{ languageName: "TypeScript", problemsSolved: 8 }],
      },
    });

    const response = await loadLeetCodeLanguageStats("language-user");

    expect(response).toEqual({
      username: "language-user",
      languages: [{ languageName: "TypeScript", problemsSolved: 8 }],
    });
  });

  it("maps skill stats", async () => {
    vi.mocked(getLeetCodeSkillData).mockResolvedValue({
      matchedUser: {
        username: "skill-user",
        tagProblemCounts: {
          fundamental: [{ tagName: "Array", tagSlug: "array", problemsSolved: 10 }],
          intermediate: [{ tagName: "Dynamic Programming", tagSlug: "dynamic-programming", problemsSolved: 3 }],
          advanced: [],
        },
      },
    });

    const response = await loadLeetCodeSkillStats("skill-user");

    expect(response.groups.fundamental).toEqual([{ tagName: "Array", tagSlug: "array", problemsSolved: 10 }]);
    expect(response.groups.intermediate).toEqual([
      { tagName: "Dynamic Programming", tagSlug: "dynamic-programming", problemsSolved: 3 },
    ]);
  });

  it("parses calendar submissionCalendar JSON", async () => {
    vi.mocked(getLeetCodeCalendarData).mockResolvedValue({
      matchedUser: {
        username: "calendar-user",
        userCalendar: {
          activeYears: [2025, 2026],
          streak: 4,
          totalActiveDays: 9,
          dccBadges: [
            {
              timestamp: "1767225600",
              badge: {
                name: "January",
                icon: "badge.png",
              },
            },
          ],
          submissionCalendar: '{"1767225600":2,"1767312000":1}',
        },
      },
    });

    const response = await loadLeetCodeCalendar("calendar-user", 2026);

    expect(response).toEqual({
      username: "calendar-user",
      year: 2026,
      activeYears: [2025, 2026],
      streak: 4,
      totalActiveDays: 9,
      submissionCalendar: {
        "1767225600": 2,
        "1767312000": 1,
      },
      dccBadges: [
        {
          timestamp: "1767225600",
          badge: {
            name: "January",
            icon: "badge.png",
          },
        },
      ],
    });
  });

  it("maps invalid calendar JSON to UPSTREAM_ERROR", async () => {
    vi.mocked(getLeetCodeCalendarData).mockResolvedValue({
      matchedUser: {
        username: "bad-calendar-user",
        userCalendar: {
          activeYears: [],
          streak: 0,
          totalActiveDays: 0,
          dccBadges: [],
          submissionCalendar: "not-json",
        },
      },
    });

    await expect(loadLeetCodeCalendar("bad-calendar-user", 2026)).rejects.toMatchObject({
      code: "UPSTREAM_ERROR",
      status: 502,
    });
  });

});
