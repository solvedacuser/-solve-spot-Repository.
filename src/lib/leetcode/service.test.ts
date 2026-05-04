import { beforeEach, describe, expect, it, vi } from "vitest";
import { LeetCodeAppError } from "@/lib/leetcode/errors";
import {
  loadLeetCodeUserInfo,
  recommendLeetCodeProblems,
  verifyLeetCodeProblemSolved,
} from "@/lib/leetcode/service";

vi.mock("@/lib/leetcode/client", () => ({
  getLeetCodeUserData: vi.fn(),
  getLeetCodeRecentAcceptedData: vi.fn(),
  getLeetCodeProblemsetData: vi.fn(),
}));

const { getLeetCodeUserData, getLeetCodeRecentAcceptedData, getLeetCodeProblemsetData } = await import(
  "@/lib/leetcode/client"
);

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
