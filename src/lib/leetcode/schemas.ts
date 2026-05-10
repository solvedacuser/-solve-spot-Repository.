import { z } from "zod";
import type { LeetCodeDifficulty } from "@/lib/leetcode/types";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

export const usernameSchema = z
  .string()
  .trim()
  .min(1, "username is required.")
  .max(100, "username is too long.")
  .regex(/^[A-Za-z0-9_-]+$/, "username format is invalid.");

export const titleSlugSchema = z
  .string()
  .trim()
  .min(1, "titleSlug is required.")
  .max(160, "titleSlug is too long.")
  .regex(/^[a-z0-9-]+$/, "titleSlug format is invalid.");

const difficultyValueSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim().toUpperCase() : value),
  z.enum(DIFFICULTIES),
);

export const tagSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/, "tagSlug format is invalid.");

export const recentAcceptedLimitSchema = z
  .number({
    invalid_type_error: "recentAcceptedLimit must be a number.",
  })
  .int("recentAcceptedLimit must be an integer.")
  .min(1, "recentAcceptedLimit must be at least 1.")
  .max(100, "recentAcceptedLimit must be at most 100.")
  .default(100);

export const calendarYearSchema = z.preprocess(
  (value) => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed === "" ? value : Number(trimmed);
    }

    return value;
  },
  z
    .number({
      invalid_type_error: "year must be a number.",
    })
    .int("year must be an integer.")
    .min(2008, "year must be at least 2008.")
    .max(2100, "year must be at most 2100."),
);

export const recommendLeetCodeProblemsRequestSchema = z.object({
  usernames: z.array(usernameSchema).default([]),
  count: z
    .number({
      invalid_type_error: "count must be a number.",
    })
    .int("count must be an integer.")
    .min(1, "count must be at least 1.")
    .max(50, "count must be at most 50."),
  difficulty: z.array(difficultyValueSchema).max(3).default([]),
  tagSlugs: z.array(tagSlugSchema).max(20).default([]),
  skip: z
    .number({
      invalid_type_error: "skip must be a number.",
    })
    .int("skip must be an integer.")
    .min(0, "skip must be at least 0.")
    .default(0),
  recentAcceptedLimit: recentAcceptedLimitSchema,
});

export const verifyLeetCodeProblemRequestSchema = z.object({
  username: usernameSchema,
  titleSlug: titleSlugSchema,
  recentAcceptedLimit: recentAcceptedLimitSchema,
});

function normalizeDifficulty(value: string, ctx: z.RefinementCtx): LeetCodeDifficulty {
  const normalized = value.trim().toUpperCase();

  if (!DIFFICULTIES.includes(normalized as LeetCodeDifficulty)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Unexpected LeetCode difficulty: ${value}`,
    });
    return z.NEVER;
  }

  return normalized as LeetCodeDifficulty;
}

const questionCountSchema = z.object({
  difficulty: z.string(),
  count: z.number().int().nonnegative(),
});

const profileSchema = z
  .object({
    ranking: z.number().nullable(),
    userAvatar: z.string().nullable(),
    realName: z.string().nullable(),
    aboutMe: z.string().nullable(),
    reputation: z.number().int().nullable(),
  })
  .passthrough();

export const leetCodeUserGraphQLDataSchema = z
  .object({
    allQuestionsCount: z.array(questionCountSchema).default([]),
    matchedUser: z
      .object({
        username: z.string(),
        profile: profileSchema,
        submitStatsGlobal: z.object({
          acSubmissionNum: z.array(questionCountSchema),
        }),
      })
      .passthrough()
      .nullable()
      .optional(),
  })
  .passthrough();

export const leetCodeRecentAcceptedGraphQLDataSchema = z
  .object({
    recentAcSubmissionList: z.array(
      z
        .object({
          titleSlug: titleSlugSchema,
          timestamp: z.union([z.string(), z.number()]).transform(String),
        })
        .passthrough(),
    ),
  })
  .passthrough();

const topicTagSchema = z
  .object({
    name: z.string(),
    slug: tagSlugSchema,
  })
  .passthrough();

const upstreamProblemSchema = z
  .object({
    titleSlug: titleSlugSchema,
    title: z.string(),
    difficulty: z.string().transform(normalizeDifficulty),
    questionFrontendId: z.string(),
    acRate: z.number().nonnegative(),
    paidOnly: z.boolean(),
    topicTags: z.array(topicTagSchema).default([]),
  })
  .passthrough();

export const leetCodeProblemsetGraphQLDataSchema = z
  .object({
    problemsetQuestionList: z
      .object({
        total: z.number().int().nonnegative(),
        questions: z.array(upstreamProblemSchema),
      })
      .passthrough(),
  })
  .passthrough();

const languageStatSchema = z
  .object({
    languageName: z.string(),
    problemsSolved: z.number().int().nonnegative(),
  })
  .passthrough();

export const leetCodeLanguageGraphQLDataSchema = z
  .object({
    matchedUser: z
      .object({
        username: z.string(),
        languageProblemCount: z.array(languageStatSchema),
      })
      .passthrough()
      .nullable()
      .optional(),
  })
  .passthrough();

const skillStatSchema = z
  .object({
    tagName: z.string(),
    tagSlug: tagSlugSchema,
    problemsSolved: z.number().int().nonnegative(),
  })
  .passthrough();

export const leetCodeSkillGraphQLDataSchema = z
  .object({
    matchedUser: z
      .object({
        username: z.string(),
        tagProblemCounts: z.object({
          fundamental: z.array(skillStatSchema),
          intermediate: z.array(skillStatSchema),
          advanced: z.array(skillStatSchema),
        }),
      })
      .passthrough()
      .nullable()
      .optional(),
  })
  .passthrough();

const calendarBadgeSchema = z
  .object({
    timestamp: z.union([z.string(), z.number()]).transform(String),
    badge: z
      .object({
        name: z.string(),
        icon: z.string().nullable().transform((value) => value ?? ""),
      })
      .passthrough(),
  })
  .passthrough();

export const leetCodeCalendarGraphQLDataSchema = z
  .object({
    matchedUser: z
      .object({
        username: z.string(),
        userCalendar: z
          .object({
            activeYears: z.array(z.number().int()),
            streak: z.number().int().nonnegative(),
            totalActiveDays: z.number().int().nonnegative(),
            dccBadges: z.array(calendarBadgeSchema),
            submissionCalendar: z.string(),
          })
          .passthrough(),
      })
      .passthrough()
      .nullable()
      .optional(),
  })
  .passthrough();

const contestBadgeSchema = z
  .object({
    name: z.string(),
  })
  .passthrough();

const contestRankingSchema = z
  .object({
    attendedContestsCount: z.number().int().nonnegative(),
    rating: z.number().nonnegative(),
    globalRanking: z.number().int().nonnegative(),
    totalParticipants: z.number().int().nonnegative(),
    topPercentage: z.number().nonnegative(),
    badge: contestBadgeSchema.nullable().default(null),
  })
  .passthrough();

const contestHistoryItemSchema = z
  .object({
    attended: z.boolean(),
    trendDirection: z.string(),
    problemsSolved: z.number().int().nonnegative(),
    totalProblems: z.number().int().nonnegative(),
    finishTimeInSeconds: z.number().int().nonnegative(),
    rating: z.number().nonnegative(),
    ranking: z.number().int().nonnegative(),
    contest: z
      .object({
        title: z.string(),
        startTime: z.number().int().nonnegative(),
      })
      .passthrough(),
  })
  .passthrough();

export const leetCodeContestGraphQLDataSchema = z
  .object({
    matchedUser: z
      .object({
        username: z.string(),
      })
      .passthrough()
      .nullable()
      .optional(),
    userContestRanking: contestRankingSchema.nullable().optional(),
    userContestRankingHistory: z.array(contestHistoryItemSchema),
  })
  .passthrough();

export type LeetCodeUserGraphQLData = z.infer<typeof leetCodeUserGraphQLDataSchema>;
export type LeetCodeRecentAcceptedGraphQLData = z.infer<typeof leetCodeRecentAcceptedGraphQLDataSchema>;
export type LeetCodeProblemsetGraphQLData = z.infer<typeof leetCodeProblemsetGraphQLDataSchema>;
export type LeetCodeLanguageGraphQLData = z.infer<typeof leetCodeLanguageGraphQLDataSchema>;
export type LeetCodeSkillGraphQLData = z.infer<typeof leetCodeSkillGraphQLDataSchema>;
export type LeetCodeCalendarGraphQLData = z.infer<typeof leetCodeCalendarGraphQLDataSchema>;
export type LeetCodeContestGraphQLData = z.infer<typeof leetCodeContestGraphQLDataSchema>;
