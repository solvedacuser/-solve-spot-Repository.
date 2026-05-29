import { z } from "zod";

export const recordDifficultySchema = z.enum(["Easy", "Medium", "Hard"]);
export const recordStatusSchema = z.enum(["Verified", "Review Requested", "Draft"]);
export const recordRoleSchema = z.enum(["Team Lead", "Member"]);
export const teamMembershipRoleSchema = z.enum(["Leader", "Member"]);
export const recordScopeSchema = z.enum(["mine", "team", "allTeams"]);

const emptyStringToNull = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  return value;
};

const optionalNullableText = (maxLength: number) =>
  z.preprocess(emptyStringToNull, z.string().trim().max(maxLength).nullable().optional());

const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);

    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Use a valid calendar date.");

export const recordIdSchema = z.string().uuid();
export const recordTeamIdSchema = z.coerce.number().int().positive();

export const recordTagSchema = z.string().trim().min(1).max(40);

export const createRecordRequestSchema = z.object({
  problemTitle: z.string().trim().min(1).max(200),
  titleSlug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a LeetCode-style title slug such as two-sum."),
  difficulty: recordDifficultySchema,
  tags: z.array(recordTagSchema).max(12).default([]),
  language: z.string().trim().min(1).max(40),
  runtime: optionalNullableText(40),
  memory: optionalNullableText(40),
  code: z.string().trim().min(1).max(100_000),
  status: recordStatusSchema.default("Review Requested"),
  reviewNote: optionalNullableText(2_000),
  teamId: recordTeamIdSchema.optional(),
});

const teamNameSchema = z.string().trim().min(1).max(100);

export const createRecordTeamRequestSchema = z.preprocess(
  (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return value;
    }

    const record = value as Record<string, unknown>;

    return {
      ...record,
      name: record.name ?? record.teamName,
    };
  },
  z.object({
    name: teamNameSchema,
    description: optionalNullableText(1_000),
    invitedUsers: z.array(z.unknown()).max(100).default([]),
  }),
);

export const listRecordsQuerySchema = z.object({
  scope: recordScopeSchema.default("mine"),
  teamId: recordTeamIdSchema.optional(),
  from: dateOnlySchema.optional(),
  to: dateOnlySchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  q: z.string().trim().max(100).optional(),
  difficulty: recordDifficultySchema.optional(),
  language: z.string().trim().min(1).max(40).optional(),
  status: recordStatusSchema.optional(),
}).superRefine((query, context) => {
  if (query.scope === "team" && query.teamId === undefined) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["teamId"],
      message: "teamId is required when scope is team.",
    });
  }

  if (query.scope !== "team" && query.teamId !== undefined) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["teamId"],
      message: "teamId is only supported when scope is team.",
    });
  }

  if (query.from && query.to && query.from > query.to) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["to"],
      message: "to must be on or after from.",
    });
  }
});

export const recordInsightsQuerySchema = z.object({
  scope: z.enum(["team", "allTeams"]),
  teamId: recordTeamIdSchema.optional(),
}).superRefine((query, context) => {
  if (query.scope === "team" && query.teamId === undefined) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["teamId"],
      message: "teamId is required when scope is team.",
    });
  }

  if (query.scope === "allTeams" && query.teamId !== undefined) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["teamId"],
      message: "teamId is only supported when scope is team.",
    });
  }
});

export const createFeedbackRequestSchema = z.object({
  content: z.string().trim().min(1).max(5_000),
});

export const recordAuthorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  avatarLabel: z.string(),
  role: recordRoleSchema,
});

export const recordDtoSchema = z.object({
  id: z.string().uuid(),
  author: recordAuthorSchema,
  submittedAt: z.string(),
  problem: z.object({
    title: z.string(),
    titleSlug: z.string(),
    difficulty: recordDifficultySchema,
    tags: z.array(z.string()),
  }),
  status: recordStatusSchema,
  language: z.string(),
  runtime: z.string().nullable(),
  memory: z.string().nullable(),
  comments: z.number().int().min(0),
  code: z.string(),
  reviewNote: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const feedbackCommentDtoSchema = z.object({
  id: z.string().uuid(),
  recordId: z.string().uuid(),
  author: recordAuthorSchema,
  submittedAt: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const listRecordsResponseSchema = z.object({
  items: z.array(recordDtoSchema),
});

export const recordTeamDtoSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
});

export const recordTeamsResponseSchema = z.array(recordTeamDtoSchema);

export const teamStreakDtoSchema = z.object({
  currentStreakDays: z.number().int().min(0),
  lastVerifiedAt: z.string().nullable(),
});

export const topContributorDtoSchema = z.object({
  userId: z.string().uuid(),
  name: z.string(),
  avatarLabel: z.string(),
  score: z.number().int().min(0),
  records: z.number().int().min(0),
  verifiedRecords: z.number().int().min(0),
  feedbackComments: z.number().int().min(0),
});

export const recordInsightsResponseSchema = z.object({
  streak: teamStreakDtoSchema,
  topContributors: z.array(topContributorDtoSchema),
});

export const recordDetailResponseSchema = z.object({
  record: recordDtoSchema,
  comments: z.array(feedbackCommentDtoSchema),
});

export const recordRowSchema = z.object({
  id: z.string().uuid(),
  author_id: z.string().uuid(),
  team_id: z.number().nullable(),
  problem_title: z.string(),
  title_slug: z.string(),
  difficulty: recordDifficultySchema,
  tags: z.array(z.string()),
  language: z.string(),
  runtime: z.string().nullable(),
  memory: z.string().nullable(),
  code: z.string(),
  status: recordStatusSchema,
  review_note: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const feedbackCommentRowSchema = z.object({
  id: z.string().uuid(),
  record_id: z.string().uuid(),
  author_id: z.string().uuid(),
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const profileRowSchema = z.object({
  id: z.string().uuid(),
  display_name: z.string().nullable(),
  leetcode_username: z.string().nullable().optional(),
  boj_handle: z.string().nullable(),
});

export const recordTeamRowSchema = z.object({
  rid: z.number().int().positive(),
  teamName: z.string().nullable(),
});

export const createdTeamRowSchema = recordTeamRowSchema.extend({
  description: z.string().nullable(),
  teamLeader: z.string().nullable(),
  UserList: z.array(z.string()).nullable(),
});

export const teamMembershipRowSchema = z.object({
  team_id: z.number().int().positive(),
  user_id: z.string().uuid(),
  role: teamMembershipRoleSchema,
});

export const recordInsightRecordRowSchema = z.object({
  id: z.string().uuid(),
  author_id: z.string().uuid(),
  team_id: z.number().int().positive(),
  status: recordStatusSchema,
  created_at: z.string(),
});

export const feedbackContributionRowSchema = z.object({
  author_id: z.string().uuid(),
});
