import { getOrSetCache } from "@/lib/leetcode/cache";
import {
  getLeetCodeCalendarData,
  getLeetCodeLanguageData,
  getLeetCodeSkillData,
  getLeetCodeUserData,
} from "@/lib/leetcode/client";
import { LeetCodeAppError } from "@/lib/leetcode/errors";
import {
  calendarYearSchema,
  usernameSchema,
} from "@/lib/leetcode/schemas";
import type {
  LeetCodeCalendarResponse,
  LeetCodeLanguageResponse,
  LeetCodeSkillResponse,
  LeetCodeUserResponse,
} from "@/lib/leetcode/types";

const GET_CACHE_TTL_MS = 60_000;

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

export async function loadLeetCodeUserInfo(username: string): Promise<LeetCodeUserResponse> {
  const parsedUsername = usernameSchema.parse(username);

  return getOrSetCache(`user:${parsedUsername}`, GET_CACHE_TTL_MS, async () => {
    const data = await getLeetCodeUserData(parsedUsername);
    return toUserResponse(data);
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

