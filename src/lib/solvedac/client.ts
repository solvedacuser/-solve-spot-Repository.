import {
  problemSearchResponseSchema,
  solvedAcUserBioResponseSchema,
  solvedAcUserResponseSchema,
} from "@/lib/solvedac/schemas";
import { SolvedAcAppError, mapHttpStatusToError } from "@/lib/solvedac/errors";
import type {
  ProblemSearchResponse,
  SolvedAcUserBioResponse,
  SolvedAcUserResponse,
} from "@/lib/solvedac/types";
import { ZodError } from "zod";

const BASE_URL = process.env.SOLVED_AC_BASE_URL ?? "https://solved.ac/api/v3";
const USER_AGENT = process.env.SOLVED_AC_USER_AGENT ?? "codemate-next/0.1";
const TIMEOUT_MS = Number(process.env.SOLVED_AC_TIMEOUT_MS ?? 5000);

function buildUrl(path: string, params: Record<string, string>) {
  const normalizedBaseUrl = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(normalizedPath, normalizedBaseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url;
}

async function requestJson(path: string, params: Record<string, string>) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(buildUrl(path, params), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": USER_AGENT,
      },
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

      throw mapHttpStatusToError(response.status, message);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof SolvedAcAppError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new SolvedAcAppError("UNAVAILABLE", 503, "solved.ac 응답 시간이 초과되었습니다.");
    }

    throw new SolvedAcAppError("UNAVAILABLE", 503, "solved.ac 연결에 실패했습니다.");
  } finally {
    clearTimeout(timeout);
  }
}

export async function getSolvedAcUserInfo(handle: string): Promise<SolvedAcUserResponse> {
  const payload = await requestJson("/user/show", { handle });
  try {
    return solvedAcUserResponseSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new SolvedAcAppError("UPSTREAM_ERROR", 502, "solved.ac 사용자 응답 형식이 예상과 다릅니다.");
    }
    throw error;
  }
}

export async function getSolvedAcUserBio(handle: string): Promise<SolvedAcUserBioResponse> {
  const payload = await requestJson("/user/show", { handle });
  try {
    return solvedAcUserBioResponseSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new SolvedAcAppError("UPSTREAM_ERROR", 502, "solved.ac bio 응답 형식이 예상과 다릅니다.");
    }
    throw error;
  }
}

export async function searchSolvedAcProblems(query: string, sort: string, direction: string): Promise<ProblemSearchResponse> {
  const payload = await requestJson("/search/problem", { query, sort, direction });
  try {
    return problemSearchResponseSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new SolvedAcAppError("UPSTREAM_ERROR", 502, "solved.ac 문제 검색 응답 형식이 예상과 다릅니다.");
    }
    throw error;
  }
}
