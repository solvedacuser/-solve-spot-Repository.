import { z } from "zod";

export const usernameSchema = z
  .string()
  .trim()
  .min(1, "username is required.")
  .max(100, "username is too long.")
  .regex(/^[A-Za-z0-9_-]+$/, "username format is invalid.");

export const tagSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/, "tagSlug format is invalid.");

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

export type LeetCodeUserGraphQLData = z.infer<typeof leetCodeUserGraphQLDataSchema>;
export type LeetCodeLanguageGraphQLData = z.infer<typeof leetCodeLanguageGraphQLDataSchema>;
export type LeetCodeSkillGraphQLData = z.infer<typeof leetCodeSkillGraphQLDataSchema>;
export type LeetCodeCalendarGraphQLData = z.infer<typeof leetCodeCalendarGraphQLDataSchema>;
