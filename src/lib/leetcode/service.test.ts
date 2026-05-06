import { beforeEach, describe, expect, it, vi } from "vitest";
import { LeetCodeAppError } from "@/lib/leetcode/errors";
import {
  loadLeetCodeCalendar,
  loadLeetCodeContest,
  loadLeetCodeLanguageStats,
  loadLeetCodeSkillStats,
  loadLeetCodeUserInfo,
  recommendLeetCodeProblems,
  verifyLeetCodeProblemSolved,
} from "@/lib/leetcode/service";

vi.mock("@/lib/leetcode/client", () => ({
  getLeetCodeCalendarData: vi.fn(),
  getLeetCodeContestData: vi.fn(),
  getLeetCodeLanguageData: vi.fn(),
  getLeetCodeUserData: vi.fn(),
  getLeetCodeRecentAcceptedData: vi.fn(),
  getLeetCodeProblemsetData: vi.fn(),
  getLeetCodeSkillData: vi.fn(),
}));

const {
  getLeetCodeCalendarData,
  getLeetCodeContestData,
  getLeetCodeLanguageData,
  getLeetCodeUserData,
  getLeetCodeRecentAcceptedData,
  getLeetCodeProblemsetData,
  getLeetCodeSkillData,
} = await import("@/lib/leetcode/client");

const sampleQuestion = {
  titleSlug: "two-sum",
  title: "Two Sum",
  difficulty: "EASY" as const,
  questionFrontendId: "1",
  acRate: 55.1,
  paidOnly: false,
  topicTags: [{ name: "Array", slug: "array" }],
};

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
    vi.mocked(getLeetCodeContestData).mockResolvedValue({
      matchedUser: null,
      userContestRanking: null,
      userContestRankingHistory: [],
    });

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
    await expect(loadLeetCodeContest("missing-contest-user")).rejects.toMatchObject({
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

  it("returns contest response when ranking is null", async () => {
    vi.mocked(getLeetCodeContestData).mockResolvedValue({
      matchedUser: {
        username: "contest-user",
      },
      userContestRanking: null,
      userContestRankingHistory: [],
    });

    const response = await loadLeetCodeContest("contest-user");

    expect(response).toEqual({
      username: "contest-user",
      ranking: null,
      history: [],
    });
  });

  it("returns recommendation metadata and excludes recent accepted problems", async () => {
    vi.mocked(getLeetCodeRecentAcceptedData).mockResolvedValue({
      recentAcSubmissionList: [{ titleSlug: "two-sum", timestamp: "1700000000" }],
    });
    vi.mocked(getLeetCodeProblemsetData).mockResolvedValue({
      problemsetQuestionList: {
        total: 2,
        questions: [
          sampleQuestion,
          {
            ...sampleQuestion,
            titleSlug: "add-two-numbers",
            title: "Add Two Numbers",
            difficulty: "MEDIUM",
            questionFrontendId: "2",
          },
        ],
      },
    });

    const response = await recommendLeetCodeProblems({
      usernames: ["alice"],
      count: 1,
      difficulty: ["EASY"],
      tagSlugs: ["array"],
      skip: 0,
      recentAcceptedLimit: 100,
    });

    expect(response.items).toHaveLength(1);
    expect(response.items[0]?.titleSlug).toBe("add-two-numbers");
    expect(response.exclusion).toEqual({
      mode: "RECENT_ACCEPTED_SUBMISSIONS",
      checkedLimit: 100,
      usernames: ["alice"],
    });
  });

  it("returns SOLVED when the title slug is in recent accepted submissions", async () => {
    vi.mocked(getLeetCodeRecentAcceptedData).mockResolvedValue({
      recentAcSubmissionList: [{ titleSlug: "two-sum", timestamp: "1700000000" }],
    });

    const response = await verifyLeetCodeProblemSolved({
      username: "alice",
      titleSlug: "two-sum",
      recentAcceptedLimit: 100,
    });

    expect(response.status).toBe("SOLVED");
    expect(response.solved).toBe(true);
  });

  it("returns UNKNOWN when the title slug is not in recent accepted submissions", async () => {
    vi.mocked(getLeetCodeRecentAcceptedData).mockResolvedValue({
      recentAcSubmissionList: [{ titleSlug: "add-two-numbers", timestamp: "1700000000" }],
    });

    const response = await verifyLeetCodeProblemSolved({
      username: "alice",
      titleSlug: "two-sum",
      recentAcceptedLimit: 100,
    });

    expect(response.status).toBe("UNKNOWN");
    expect(response.solved).toBeNull();
    expect(response.reason).toContain("does not prove it is unsolved");
  });
});
