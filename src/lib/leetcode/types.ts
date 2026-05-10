export type LeetCodeAppErrorCode =
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "RATE_LIMITED"
  | "UPSTREAM_ERROR"
  | "UNAVAILABLE";

export interface ApiErrorPayload {
  code: LeetCodeAppErrorCode;
  message: string;
  status: number;
}

export type LeetCodeDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface LeetCodeUserResponse {
  username: string;
  profile: {
    ranking: number | null;
    avatarUrl: string;
    realName: string;
    reputation: number;
  };
  solved: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface LeetCodeBioResponse {
  username: string;
  bio: string;
}

export interface LeetCodeProblemTag {
  name: string;
  slug: string;
}

export interface LeetCodeProblem {
  titleSlug: string;
  questionFrontendId: string;
  title: string;
  difficulty: LeetCodeDifficulty;
  acRate: number;
  paidOnly: boolean;
  url: string;
  tags: LeetCodeProblemTag[];
}

export type LeetCodeExclusionMode =
  | "RECENT_ACCEPTED_SUBMISSIONS"
  | "SESSION_QUESTION_STATUS"
  | "NONE";

export interface LeetCodeExclusionMetadata {
  mode: LeetCodeExclusionMode;
  checkedLimit: number;
  usernames: string[];
}

export interface LeetCodeRecommendationRequest {
  usernames?: string[];
  count: number;
  difficulty?: LeetCodeDifficulty[];
  tagSlugs?: string[];
  skip?: number;
  recentAcceptedLimit?: number;
}

export interface LeetCodeRecommendationResponse {
  items: LeetCodeProblem[];
  exclusion: LeetCodeExclusionMetadata;
}

export interface LeetCodeVerifyProblemRequest {
  username: string;
  titleSlug: string;
  recentAcceptedLimit?: number;
}

export type LeetCodeVerifyProblemStatus = "SOLVED" | "UNKNOWN";

export interface LeetCodeVerifyProblemResponse {
  username: string;
  titleSlug: string;
  status: LeetCodeVerifyProblemStatus;
  solved: boolean | null;
  source: {
    mode: "RECENT_ACCEPTED_SUBMISSIONS";
    checkedLimit: number;
  };
  reason?: string;
}

export interface LeetCodeAcceptedSubmission {
  titleSlug: string;
  timestamp: string;
}

export interface LeetCodeLanguageStat {
  languageName: string;
  problemsSolved: number;
}

export interface LeetCodeLanguageResponse {
  username: string;
  languages: LeetCodeLanguageStat[];
}

export interface LeetCodeSkillStat {
  tagName: string;
  tagSlug: string;
  problemsSolved: number;
}

export interface LeetCodeSkillResponse {
  username: string;
  groups: {
    fundamental: LeetCodeSkillStat[];
    intermediate: LeetCodeSkillStat[];
    advanced: LeetCodeSkillStat[];
  };
}

export interface LeetCodeCalendarBadge {
  timestamp: string;
  badge: {
    name: string;
    icon: string;
  };
}

export interface LeetCodeCalendarResponse {
  username: string;
  year: number;
  activeYears: number[];
  streak: number;
  totalActiveDays: number;
  submissionCalendar: Record<string, number>;
  dccBadges: LeetCodeCalendarBadge[];
}

export interface LeetCodeContestRanking {
  attendedContestsCount: number;
  rating: number;
  globalRanking: number;
  totalParticipants: number;
  topPercentage: number;
  badge: {
    name: string;
  } | null;
}

export interface LeetCodeContestHistoryItem {
  attended: boolean;
  trendDirection: string;
  problemsSolved: number;
  totalProblems: number;
  finishTimeInSeconds: number;
  rating: number;
  ranking: number;
  contest: {
    title: string;
    startTime: number;
  };
}

export interface LeetCodeContestResponse {
  username: string;
  ranking: LeetCodeContestRanking | null;
  history: LeetCodeContestHistoryItem[];
}
