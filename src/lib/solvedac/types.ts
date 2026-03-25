export type AppErrorCode =
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "RATE_LIMITED"
  | "UPSTREAM_ERROR"
  | "UNAVAILABLE";

export interface ApiErrorPayload {
  code: AppErrorCode;
  message: string;
  status: number;
}

export interface SolvedAcUserResponse {
  handle: string;
  tier: number;
  solvedCount: number;
  maxStreak: number;
  rating: number;
}

export interface SolvedAcUserBioResponse {
  handle: string;
  bio: string;
}

export interface SolvedAcDisplayName {
  language: string;
  name: string;
  short: string;
}

export interface SolvedAcTagInfo {
  key: string;
  isMeta: boolean;
  bojTagId: number | null;
  displayNames: SolvedAcDisplayName[];
}

export interface ProblemInfo {
  problemId: number;
  titleKo: string | null;
  level: number;
  acceptedUserCount: number;
  averageTries: number;
  url?: string;
  tags?: SolvedAcTagInfo[];
}

export interface ProblemSearchResponse {
  items: ProblemInfo[];
}

export interface RecommendProblemsRequest {
  handles: string[];
  count: number;
  minLevel?: number;
  maxLevel?: number;
  tagKeys?: string[];
}

export interface VerifyProblemRequest {
  handle: string;
  problemId: number;
}

export interface VerifyProblemResponse {
  solved: boolean;
  query: string;
}
