import { getOrSetCache } from "@/lib/leetcode/cache";
import {
  getLeetCodeCalendarData,
  getLeetCodeContestData,
  getLeetCodeLanguageData,
  getLeetCodeProblemsetData,
  getLeetCodeRecentAcceptedData,
  getLeetCodeSkillData,
  getLeetCodeUserData,
} from "@/lib/leetcode/client";
import { LeetCodeAppError } from "@/lib/leetcode/errors";
import {
  calendarYearSchema,
  recommendLeetCodeProblemsRequestSchema,
  usernameSchema,
  verifyLeetCodeProblemRequestSchema,
} from "@/lib/leetcode/schemas";
import type {
  LeetCodeAcceptedSubmission,
  LeetCodeCalendarResponse,
  LeetCodeContestResponse,
  LeetCodeDifficulty,
  LeetCodeLanguageResponse,
  LeetCodeProblem,
  LeetCodeRecommendationRequest,
  LeetCodeRecommendationResponse,
  LeetCodeSkillResponse,
  LeetCodeUserResponse,
  LeetCodeVerifyProblemRequest,
  LeetCodeVerifyProblemResponse,
} from "@/lib/leetcode/types";

const GET_CACHE_TTL_MS = 60_000;
const UNKNOWN_VERIFY_REASON =
  "The problem was not found in the user's recent accepted submissions. This does not prove it is unsolved.";

function buildProblemUrl(titleSlug: string) {
  return `https://leetcode.com/problems/${titleSlug}/`;
}

function getSolvedCount(
  counts: Array<{ difficulty: string; count: number }>,
  difficulty: "All" | "Easy" | "Medium" | "Hard",
) {
  return counts.find((item) => item.difficulty.toLowerCase() === difficulty.toLowerCase())?.count ?? 0;
}

function toUserResponse(data: Awaited<ReturnType<typeof getLeetCodeUserData>>): LeetCodeUserResponse {
  const matchedUser = data.matchedUser;

  if (!matchedUser) {
    throw new LeetCodeAppError("NOT_FOUND", 404, "User was not found on LeetCode.");
  }

  const solvedCounts = matchedUser.submitStatsGlobal.acSubmissionNum;

  return {
    username: matchedUser.username,
    profile: {
      ranking: matchedUser.profile.ranking,
      avatarUrl: matchedUser.profile.userAvatar ?? "",
      realName: matchedUser.profile.realName ?? "",
      reputation: matchedUser.profile.reputation ?? 0,
    },
    solved: {
      total: getSolvedCount(solvedCounts, "All"),
      easy: getSolvedCount(solvedCounts, "Easy"),
      medium: getSolvedCount(solvedCounts, "Medium"),
      hard: getSolvedCount(solvedCounts, "Hard"),
    },
  };
}

function parseSubmissionCalendar(rawCalendar: string): Record<string, number> {
  try {
    const parsed = JSON.parse(rawCalendar) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("submissionCalendar is not an object");
    }

    const calendar: Record<string, number> = {};

    for (const [timestamp, count] of Object.entries(parsed)) {
      if (
        !Number.isInteger(Number(timestamp)) ||
        typeof count !== "number" ||
        !Number.isInteger(count) ||
        count < 0
      ) {
        throw new Error("submissionCalendar contains invalid values");
      }

      calendar[timestamp] = count;
    }

    return calendar;
  } catch {
    throw new LeetCodeAppError("UPSTREAM_ERROR", 502, "LeetCode returned an invalid calendar payload.");
  }
}

function toProblem(item: Awaited<ReturnType<typeof getLeetCodeProblemsetData>>["problemsetQuestionList"]["questions"][number]): LeetCodeProblem {
  return {
    titleSlug: item.titleSlug,
    questionFrontendId: item.questionFrontendId,
    title: item.title,
    difficulty: item.difficulty,
    acRate: item.acRate,
    paidOnly: item.paidOnly,
    url: buildProblemUrl(item.titleSlug),
    tags: item.topicTags.map((tag) => ({
      name: tag.name,
      slug: tag.slug,
    })),
  };
}

async function loadRecentAcceptedSubmissions(
  username: string,
  limit: number,
): Promise<LeetCodeAcceptedSubmission[]> {
  const data = await getLeetCodeRecentAcceptedData(username, limit);
  return data.recentAcSubmissionList;
}

export async function loadLeetCodeUserInfo(username: string): Promise<LeetCodeUserResponse> {
  const parsedUsername = usernameSchema.parse(username);

  return getOrSetCache(`user:${parsedUsername}`, GET_CACHE_TTL_MS, async () => {
    const data = await getLeetCodeUserData(parsedUsername);
    return toUserResponse(data);
  });
}

export async function loadLeetCodeUserBio(username: string) {
  const parsedUsername = usernameSchema.parse(username);

  return getOrSetCache(`bio:${parsedUsername}`, GET_CACHE_TTL_MS, async () => {
    const data = await getLeetCodeUserData(parsedUsername);
    const matchedUser = data.matchedUser;

    if (!matchedUser) {
      throw new LeetCodeAppError("NOT_FOUND", 404, "User was not found on LeetCode.");
    }

    return {
      username: matchedUser.username,
      bio: matchedUser.profile.aboutMe ?? "",
    };
  });
}

export async function loadLeetCodeLanguageStats(username: string): Promise<LeetCodeLanguageResponse> {
  const parsedUsername = usernameSchema.parse(username);

  return getOrSetCache(`language:${parsedUsername}`, GET_CACHE_TTL_MS, async () => {
    const data = await getLeetCodeLanguageData(parsedUsername);
    const matchedUser = data.matchedUser;

    if (!matchedUser) {
      throw new LeetCodeAppError("NOT_FOUND", 404, "User was not found on LeetCode.");
    }

    return {
      username: matchedUser.username,
      languages: matchedUser.languageProblemCount,
    };
  });
}

export async function loadLeetCodeSkillStats(username: string): Promise<LeetCodeSkillResponse> {
  const parsedUsername = usernameSchema.parse(username);

  return getOrSetCache(`skill:${parsedUsername}`, GET_CACHE_TTL_MS, async () => {
    const data = await getLeetCodeSkillData(parsedUsername);
    const matchedUser = data.matchedUser;

    if (!matchedUser) {
      throw new LeetCodeAppError("NOT_FOUND", 404, "User was not found on LeetCode.");
    }

    return {
      username: matchedUser.username,
      groups: matchedUser.tagProblemCounts,
    };
  });
}

export async function loadLeetCodeCalendar(username: string, year: string | number): Promise<LeetCodeCalendarResponse> {
  const parsedUsername = usernameSchema.parse(username);
  const parsedYear = calendarYearSchema.parse(year);

  return getOrSetCache(`calendar:${parsedUsername}:${parsedYear}`, GET_CACHE_TTL_MS, async () => {
    const data = await getLeetCodeCalendarData(parsedUsername, parsedYear);
    const matchedUser = data.matchedUser;

    if (!matchedUser) {
      throw new LeetCodeAppError("NOT_FOUND", 404, "User was not found on LeetCode.");
    }

    return {
      username: matchedUser.username,
      year: parsedYear,
      activeYears: matchedUser.userCalendar.activeYears,
      streak: matchedUser.userCalendar.streak,
      totalActiveDays: matchedUser.userCalendar.totalActiveDays,
      submissionCalendar: parseSubmissionCalendar(matchedUser.userCalendar.submissionCalendar),
      dccBadges: matchedUser.userCalendar.dccBadges,
    };
  });
}

export async function loadLeetCodeContest(username: string): Promise<LeetCodeContestResponse> {
  const parsedUsername = usernameSchema.parse(username);

  return getOrSetCache(`contest:${parsedUsername}`, GET_CACHE_TTL_MS, async () => {
    const data = await getLeetCodeContestData(parsedUsername);
    const matchedUser = data.matchedUser;

    if (!matchedUser) {
      throw new LeetCodeAppError("NOT_FOUND", 404, "User was not found on LeetCode.");
    }

    return {
      username: matchedUser.username,
      ranking: data.userContestRanking ?? null,
      history: data.userContestRankingHistory,
    };
  });
}

async function collectRecentAcceptedTitleSlugs(usernames: string[], limit: number) {
  const submissionGroups = await Promise.all(
    usernames.map((username) => loadRecentAcceptedSubmissions(username, limit)),
  );
  return new Set(submissionGroups.flat().map((submission) => submission.titleSlug));
}

async function loadCandidateProblems({
  difficulties,
  count,
  excludedTitleSlugs,
  skip,
  tagSlugs,
}: {
  difficulties: LeetCodeDifficulty[];
  count: number;
  excludedTitleSlugs: Set<string>;
  skip: number;
  tagSlugs: string[];
}) {
  const upstreamLimit = Math.min(100, Math.max(count * 3, count + excludedTitleSlugs.size + 10));
  const difficultyQueries = difficulties.length > 0 ? difficulties : [undefined];
  const problemsets = await Promise.all(
    difficultyQueries.map((difficulty) =>
      getLeetCodeProblemsetData({
        difficulty,
        limit: upstreamLimit,
        skip,
        tagSlugs,
      }),
    ),
  );

  const seen = new Set<string>();
  const items: LeetCodeProblem[] = [];

  for (const problemset of problemsets) {
    for (const candidate of problemset.problemsetQuestionList.questions) {
      if (candidate.paidOnly || excludedTitleSlugs.has(candidate.titleSlug) || seen.has(candidate.titleSlug)) {
        continue;
      }

      seen.add(candidate.titleSlug);
      items.push(toProblem(candidate));

      if (items.length >= count) {
        return items;
      }
    }
  }

  return items;
}

export async function recommendLeetCodeProblems(
  input: LeetCodeRecommendationRequest,
): Promise<LeetCodeRecommendationResponse> {
  const parsedInput = recommendLeetCodeProblemsRequestSchema.parse(input);
  const excludedTitleSlugs =
    parsedInput.usernames.length > 0
      ? await collectRecentAcceptedTitleSlugs(parsedInput.usernames, parsedInput.recentAcceptedLimit)
      : new Set<string>();

  const items = await loadCandidateProblems({
    difficulties: parsedInput.difficulty,
    count: parsedInput.count,
    excludedTitleSlugs,
    skip: parsedInput.skip,
    tagSlugs: parsedInput.tagSlugs,
  });

  return {
    items,
    exclusion: {
      mode: parsedInput.usernames.length > 0 ? "RECENT_ACCEPTED_SUBMISSIONS" : "NONE",
      checkedLimit: parsedInput.recentAcceptedLimit,
      usernames: parsedInput.usernames,
    },
  };
}

export async function verifyLeetCodeProblemSolved(
  input: LeetCodeVerifyProblemRequest,
): Promise<LeetCodeVerifyProblemResponse> {
  const parsedInput = verifyLeetCodeProblemRequestSchema.parse(input);
  const submissions = await loadRecentAcceptedSubmissions(parsedInput.username, parsedInput.recentAcceptedLimit);
  const solved = submissions.some((submission) => submission.titleSlug === parsedInput.titleSlug);
  const source = {
    mode: "RECENT_ACCEPTED_SUBMISSIONS" as const,
    checkedLimit: parsedInput.recentAcceptedLimit,
  };

  if (solved) {
    return {
      username: parsedInput.username,
      titleSlug: parsedInput.titleSlug,
      status: "SOLVED",
      solved: true,
      source,
    };
  }

  return {
    username: parsedInput.username,
    titleSlug: parsedInput.titleSlug,
    status: "UNKNOWN",
    solved: null,
    source,
    reason: UNKNOWN_VERIFY_REASON,
  };
}
