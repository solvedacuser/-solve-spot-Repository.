import { z, ZodError, type ZodTypeAny } from "zod";
import {
  LEETCODE_CALENDAR_QUERY,
  LEETCODE_CONTEST_QUERY,
  LEETCODE_LANGUAGE_QUERY,
  LEETCODE_PROBLEMSET_QUERY,
  LEETCODE_RECENT_ACCEPTED_QUERY,
  LEETCODE_SKILL_QUERY,
  LEETCODE_USER_QUERY,
} from "@/lib/leetcode/queries";
import {
  leetCodeCalendarGraphQLDataSchema,
  leetCodeContestGraphQLDataSchema,
  leetCodeLanguageGraphQLDataSchema,
  leetCodeProblemsetGraphQLDataSchema,
  leetCodeRecentAcceptedGraphQLDataSchema,
  leetCodeSkillGraphQLDataSchema,
  leetCodeUserGraphQLDataSchema,
  type LeetCodeCalendarGraphQLData,
  type LeetCodeContestGraphQLData,
  type LeetCodeLanguageGraphQLData,
  type LeetCodeProblemsetGraphQLData,
  type LeetCodeRecentAcceptedGraphQLData,
  type LeetCodeSkillGraphQLData,
  type LeetCodeUserGraphQLData,
} from "@/lib/leetcode/schemas";
import { LeetCodeAppError, mapLeetCodeHttpStatusToError } from "@/lib/leetcode/errors";
import type { LeetCodeDifficulty } from "@/lib/leetcode/types";

const GRAPHQL_URL = process.env.LEETCODE_GRAPHQL_URL ?? "https://leetcode.com/graphql";
const USER_AGENT = process.env.LEETCODE_USER_AGENT ?? "codemate-next/0.1";
const TIMEOUT_MS = Number(process.env.LEETCODE_TIMEOUT_MS ?? 5000);

type GraphQLVariables = Record<string, unknown>;

type GraphQLResponse = {
  data?: unknown;
  errors?: Array<{ message?: string }>;
};

async function requestGraphQL<TSchema extends ZodTypeAny>(
  query: string,
  variables: GraphQLVariables,
  schema: TSchema,
  invalidPayloadMessage: string,
): Promise<z.infer<TSchema>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent": USER_AGENT,
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      let message: string | undefined;

      try {
        const maybeJson = (await response.json()) as Record<string, unknown>;
        const rawMessage = maybeJson.message;
        if (typeof rawMessage === "string") {
          message = rawMessage;
        }
      } catch {
        message = undefined;
      }

      throw mapLeetCodeHttpStatusToError(response.status, message);
    }

    const payload = (await response.json()) as GraphQLResponse;

    if (payload.errors?.length) {
      throw new LeetCodeAppError(
        "UPSTREAM_ERROR",
        502,
        payload.errors[0]?.message ?? "LeetCode returned a GraphQL error.",
      );
    }

    return schema.parse(payload.data);
  } catch (error) {
    if (error instanceof LeetCodeAppError) {
      throw error;
    }

    if (error instanceof ZodError || error instanceof SyntaxError) {
      throw new LeetCodeAppError("UPSTREAM_ERROR", 502, invalidPayloadMessage);
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new LeetCodeAppError("UNAVAILABLE", 503, "LeetCode response timed out.");
    }

    throw new LeetCodeAppError("UNAVAILABLE", 503, "Failed to connect to LeetCode.");
  } finally {
    clearTimeout(timeout);
  }
}

export async function getLeetCodeUserData(username: string): Promise<LeetCodeUserGraphQLData> {
  return requestGraphQL(
    LEETCODE_USER_QUERY,
    { username },
    leetCodeUserGraphQLDataSchema,
    "LeetCode returned an invalid user payload.",
  );
}

export async function getLeetCodeRecentAcceptedData(
  username: string,
  limit: number,
): Promise<LeetCodeRecentAcceptedGraphQLData> {
  return requestGraphQL(
    LEETCODE_RECENT_ACCEPTED_QUERY,
    { username, limit },
    leetCodeRecentAcceptedGraphQLDataSchema,
    "LeetCode returned an invalid recent submissions payload.",
  );
}

export async function getLeetCodeProblemsetData({
  difficulty,
  limit,
  skip,
  tagSlugs,
}: {
  difficulty?: LeetCodeDifficulty;
  limit: number;
  skip: number;
  tagSlugs: string[];
}): Promise<LeetCodeProblemsetGraphQLData> {
  const filters: Record<string, unknown> = {};

  if (difficulty) {
    filters.difficulty = difficulty;
  }

  if (tagSlugs.length > 0) {
    filters.tags = tagSlugs;
  }

  return requestGraphQL(
    LEETCODE_PROBLEMSET_QUERY,
    {
      categorySlug: "",
      limit,
      skip,
      filters,
    },
    leetCodeProblemsetGraphQLDataSchema,
    "LeetCode returned an invalid problemset payload.",
  );
}

export async function getLeetCodeLanguageData(username: string): Promise<LeetCodeLanguageGraphQLData> {
  return requestGraphQL(
    LEETCODE_LANGUAGE_QUERY,
    { username },
    leetCodeLanguageGraphQLDataSchema,
    "LeetCode returned an invalid language stats payload.",
  );
}

export async function getLeetCodeSkillData(username: string): Promise<LeetCodeSkillGraphQLData> {
  return requestGraphQL(
    LEETCODE_SKILL_QUERY,
    { username },
    leetCodeSkillGraphQLDataSchema,
    "LeetCode returned an invalid skill stats payload.",
  );
}

export async function getLeetCodeCalendarData(
  username: string,
  year: number,
): Promise<LeetCodeCalendarGraphQLData> {
  return requestGraphQL(
    LEETCODE_CALENDAR_QUERY,
    { username, year },
    leetCodeCalendarGraphQLDataSchema,
    "LeetCode returned an invalid calendar payload.",
  );
}

export async function getLeetCodeContestData(username: string): Promise<LeetCodeContestGraphQLData> {
  return requestGraphQL(
    LEETCODE_CONTEST_QUERY,
    { username },
    leetCodeContestGraphQLDataSchema,
    "LeetCode returned an invalid contest payload.",
  );
}
