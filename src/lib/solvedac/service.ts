import { getOrSetCache } from "@/lib/solvedac/cache";
import {
  recommendProblemsRequestSchema,
  verifyProblemRequestSchema,
  handleSchema,
} from "@/lib/solvedac/schemas";
import { getSolvedAcUserBio, getSolvedAcUserInfo, searchSolvedAcProblems } from "@/lib/solvedac/client";
import { buildProblemUrl, buildRecommendationQuery, buildSolvedProblemQuery } from "@/lib/solvedac/query";
import type {
  ProblemInfo,
  RecommendProblemsRequest,
  VerifyProblemRequest,
  VerifyProblemResponse,
} from "@/lib/solvedac/types";

const GET_CACHE_TTL_MS = 60_000;

function attachProblemUrl(problem: ProblemInfo): ProblemInfo {
  return {
    ...problem,
    url: buildProblemUrl(problem.problemId),
  };
}

export async function loadUserInfo(handle: string) {
  const parsedHandle = handleSchema.parse(handle);
  return getOrSetCache(`user:${parsedHandle}`, GET_CACHE_TTL_MS, () => getSolvedAcUserInfo(parsedHandle));
}

export async function loadUserBio(handle: string) {
  const parsedHandle = handleSchema.parse(handle);
  return getOrSetCache(`bio:${parsedHandle}`, GET_CACHE_TTL_MS, () => getSolvedAcUserBio(parsedHandle));
}

export async function recommendProblems(input: RecommendProblemsRequest) {
  const parsedInput = recommendProblemsRequestSchema.parse(input);
  const query = buildRecommendationQuery(parsedInput);
  const response = await searchSolvedAcProblems(query, "random", "asc");

  return {
    items: response.items.map(attachProblemUrl).slice(0, parsedInput.count),
  };
}

export async function verifyProblemSolved(input: VerifyProblemRequest): Promise<VerifyProblemResponse> {
  const parsedInput = verifyProblemRequestSchema.parse(input);
  const query = buildSolvedProblemQuery(parsedInput.handle, parsedInput.problemId);
  const response = await searchSolvedAcProblems(query, "id", "asc");

  return {
    solved: response.items.length > 0,
    query,
  };
}
