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
