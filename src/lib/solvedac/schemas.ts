import { z } from "zod";

export const handleSchema = z
  .string()
  .trim()
  .min(1, "handle은 비어 있을 수 없습니다.")
  .max(100, "handle 길이가 너무 깁니다.")
  .regex(/^[A-Za-z0-9_.-]+$/, "handle 형식이 올바르지 않습니다.");

export const problemIdSchema = z
  .number({
    invalid_type_error: "problemId는 숫자여야 합니다.",
  })
  .int("problemId는 정수여야 합니다.")
  .positive("problemId는 1 이상이어야 합니다.");

export const levelSchema = z
  .number({
    invalid_type_error: "레벨은 숫자여야 합니다.",
  })
  .int("레벨은 정수여야 합니다.")
  .min(1, "레벨은 1 이상이어야 합니다.")
  .max(30, "레벨은 30 이하여야 합니다.");

export const tagKeySchema = z
  .string()
  .trim()
  .min(1)
  .max(50)
  .regex(/^[A-Za-z0-9_:-]+$/, "tagKey 형식이 올바르지 않습니다.");

export const solvedAcDisplayNameSchema = z.object({
  language: z.string(),
  name: z.string(),
  short: z.string(),
});

export const solvedAcTagInfoSchema = z.object({
  key: z.string(),
  isMeta: z.boolean(),
  bojTagId: z.number().int().nullable(),
  displayNames: z.array(solvedAcDisplayNameSchema).default([]),
});

export const problemInfoSchema = z.object({
  problemId: z.number().int().positive(),
  titleKo: z.string().nullable(),
  level: z.number().int().min(0).max(30),
  acceptedUserCount: z.number().int().nonnegative(),
  averageTries: z.number().nonnegative(),
  tags: z.array(solvedAcTagInfoSchema).optional(),
});

export const problemSearchResponseSchema = z.object({
  items: z.array(problemInfoSchema).default([]),
});

export const solvedAcUserResponseSchema = z.object({
  handle: z.string(),
  tier: z.number().int().nonnegative(),
  solvedCount: z.number().int().nonnegative(),
  maxStreak: z.number().int().nonnegative(),
  rating: z.number().int(),
});

export const solvedAcUserBioResponseSchema = z.object({
  handle: z.string(),
  bio: z.string().nullable().transform((value) => value ?? ""),
});

export const recommendProblemsRequestSchema = z.object({
  handles: z.array(handleSchema).min(1, "최소 한 개의 handle이 필요합니다."),
  count: z
    .number({
      invalid_type_error: "count는 숫자여야 합니다.",
    })
    .int("count는 정수여야 합니다.")
    .min(1, "count는 1 이상이어야 합니다.")
    .max(50, "count는 50 이하여야 합니다."),
  minLevel: levelSchema.optional(),
  maxLevel: levelSchema.optional(),
  tagKeys: z.array(tagKeySchema).optional(),
});

export const verifyProblemRequestSchema = z.object({
  handle: handleSchema,
  problemId: problemIdSchema,
});
