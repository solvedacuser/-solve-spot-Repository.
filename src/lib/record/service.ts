import type { User } from "@supabase/supabase-js";
import { z } from "zod";
import { RecordAppError, mapRecordDatabaseError } from "@/lib/record/errors";
import {
  createdTeamRowSchema,
  createFeedbackRequestSchema,
  createRecordTeamRequestSchema,
  createRecordRequestSchema,
  feedbackContributionRowSchema,
  recordTeamDtoSchema,
  recordTeamIdSchema,
  recordTeamRowSchema,
  recordTeamsResponseSchema,
  feedbackCommentDtoSchema,
  feedbackCommentRowSchema,
  recordInsightRecordRowSchema,
  recordInsightsQuerySchema,
  recordInsightsResponseSchema,
  listRecordsQuerySchema,
  listRecordsResponseSchema,
  profileRowSchema,
  recordDetailResponseSchema,
  recordDtoSchema,
  recordIdSchema,
  recordRowSchema,
} from "@/lib/record/schemas";
import {
  checkRecordTeamMembership,
  createFeedbackCommentRow,
  createRecordRow,
  createTeamMembershipRow,
  createTeamRow,
  listCommentCountsByRecordId,
  listFeedbackContributionRowsByRecordIds,
  listFeedbackCommentRows,
  listInsightRecordRowsByTeams,
  listProfilesByIds,
  listRecordRows,
  listRecordRowsByTeam,
  listRecordRowsByTeams,
  listRecordTeamIdsForUser,
  listRecordTeamsForUser,
  loadRecordRow,
  type RecordSupabaseClient,
  type RepositoryResult,
} from "@/lib/record/repository";
import type {
  FeedbackCommentDto,
  FeedbackCommentRow,
  CreateRecordTeamRequest,
  FeedbackContributionRow,
  ListRecordsResponse,
  ProfileRow,
  RecordDetailResponse,
  RecordDto,
  RecordInsightRecordRow,
  RecordInsightsResponse,
  RecordRow,
  RecordTeamDto,
} from "@/lib/record/types";

type AuthResult = {
  data: {
    user: User | null;
  };
  error: {
    message: string;
  } | null;
};

function assertRepositoryResult<T>(result: RepositoryResult<T>, fallbackMessage: string): T {
  if (result.error) {
    throw mapRecordDatabaseError(result.error.message || fallbackMessage);
  }

  return result.data;
}

async function getAuthenticatedUser(supabase: RecordSupabaseClient) {
  const { data, error } = (await supabase.auth.getUser()) as AuthResult;

  if (error) {
    throw new RecordAppError("UNAUTHORIZED", 401, error.message);
  }

  if (!data.user) {
    throw new RecordAppError("UNAUTHORIZED", 401);
  }

  return data.user;
}

function getMetadataValue(user: User, key: string) {
  const value = user.user_metadata?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getAuthorName(profile: ProfileRow | undefined, user: User | null) {
  return (
    profile?.display_name?.trim() ||
    profile?.leetcode_username?.trim() ||
    profile?.boj_handle?.trim() ||
    (user ? getMetadataValue(user, "display_name") : null) ||
    (user ? getMetadataValue(user, "name") : null) ||
    (user ? getMetadataValue(user, "leetcode_username") : null) ||
    (user ? getMetadataValue(user, "boj_handle") : null) ||
    user?.email ||
    "Unknown user"
  );
}

function getAvatarLabel(name: string) {
  return Array.from(name.trim())[0]?.toUpperCase() ?? "?";
}

function createProfileMap(rows: ProfileRow[]) {
  return new Map(rows.map((row) => [row.id, profileRowSchema.parse(row)]));
}

const authUserIdSchema = z.string().uuid();

function toRecordDto({
  row,
  profile,
  currentUser,
  comments,
}: {
  row: RecordRow;
  profile: ProfileRow | undefined;
  currentUser: User | null;
  comments: number;
}): RecordDto {
  const parsedRow = recordRowSchema.parse(row);
  const authorName = getAuthorName(profile, currentUser?.id === parsedRow.author_id ? currentUser : null);

  return recordDtoSchema.parse({
    id: parsedRow.id,
    author: {
      id: parsedRow.author_id,
      name: authorName,
      avatarLabel: getAvatarLabel(authorName),
      role: "Member",
    },
    submittedAt: parsedRow.created_at,
    problem: {
      title: parsedRow.problem_title,
      titleSlug: parsedRow.title_slug,
      difficulty: parsedRow.difficulty,
      tags: parsedRow.tags,
    },
    status: parsedRow.status,
    language: parsedRow.language,
    runtime: parsedRow.runtime,
    memory: parsedRow.memory,
    comments,
    code: parsedRow.code,
    reviewNote: parsedRow.review_note,
    createdAt: parsedRow.created_at,
    updatedAt: parsedRow.updated_at,
  });
}

function toFeedbackCommentDto({
  row,
  profile,
  currentUser,
}: {
  row: FeedbackCommentRow;
  profile: ProfileRow | undefined;
  currentUser: User | null;
}): FeedbackCommentDto {
  const parsedRow = feedbackCommentRowSchema.parse(row);
  const authorName = getAuthorName(profile, currentUser?.id === parsedRow.author_id ? currentUser : null);

  return feedbackCommentDtoSchema.parse({
    id: parsedRow.id,
    recordId: parsedRow.record_id,
    author: {
      id: parsedRow.author_id,
      name: authorName,
      avatarLabel: getAvatarLabel(authorName),
      role: "Member",
    },
    submittedAt: parsedRow.created_at,
    content: parsedRow.content,
    createdAt: parsedRow.created_at,
    updatedAt: parsedRow.updated_at,
  });
}

async function loadProfileMap(supabase: RecordSupabaseClient, ids: string[]) {
  const profileRows = assertRepositoryResult(
    await listProfilesByIds(supabase, ids),
    "Failed to load record profiles.",
  );
  return createProfileMap(profileRows);
}

function toRecordTeamDto(row: unknown): RecordTeamDto {
  const parsedRow = recordTeamRowSchema.parse(row);
  const name = parsedRow.teamName?.trim() || `Team #${parsedRow.rid}`;

  return recordTeamDtoSchema.parse({
    id: parsedRow.rid,
    name,
  });
}

function toLegacyUserList(values: unknown[]) {
  return values
    .map((value) => {
      if (typeof value === "string") {
        return value.trim();
      }

      if (value && typeof value === "object") {
        return JSON.stringify(value);
      }

      return "";
    })
    .filter(Boolean);
}

function collectAuthUserIds(values: unknown[]) {
  const candidateKeys = ["id", "user_id", "userId", "auth_user_id", "authUserId"];
  const ids = new Set<string>();

  for (const value of values) {
    if (typeof value === "string") {
      const parsed = authUserIdSchema.safeParse(value.trim());

      if (parsed.success) {
        ids.add(parsed.data);
      }

      continue;
    }

    if (!value || typeof value !== "object" || Array.isArray(value)) {
      continue;
    }

    const record = value as Record<string, unknown>;

    for (const key of candidateKeys) {
      const candidate = record[key];

      if (typeof candidate !== "string") {
        continue;
      }

      const parsed = authUserIdSchema.safeParse(candidate.trim());

      if (parsed.success) {
        ids.add(parsed.data);
      }
    }
  }

  return Array.from(ids);
}

async function getCurrentProfile(supabase: RecordSupabaseClient, userId: string) {
  const profiles = assertRepositoryResult(
    await listProfilesByIds(supabase, [userId]),
    "Failed to load the current profile.",
  );

  return profiles[0] ? profileRowSchema.parse(profiles[0]) : null;
}

export async function listRecordTeams(supabase: RecordSupabaseClient): Promise<RecordTeamDto[]> {
  const user = await getAuthenticatedUser(supabase);
  const rows = assertRepositoryResult(
    await listRecordTeamsForUser(supabase, user.id),
    "Failed to load record teams.",
  );

  return recordTeamsResponseSchema.parse(rows.map((row) => toRecordTeamDto(row)));
}

export async function listRecordTeamIds(supabase: RecordSupabaseClient): Promise<number[]> {
  const user = await getAuthenticatedUser(supabase);
  const teamIds = assertRepositoryResult(
    await listRecordTeamIdsForUser(supabase, user.id),
    "Failed to load record team ids.",
  );

  return teamIds.map((teamId) => recordTeamIdSchema.parse(teamId));
}

export async function assertRecordTeamMember(
  supabase: RecordSupabaseClient,
  teamId: unknown,
): Promise<number> {
  const user = await getAuthenticatedUser(supabase);
  const parsedTeamId = recordTeamIdSchema.parse(teamId);
  const isMember = assertRepositoryResult(
    await checkRecordTeamMembership(supabase, user.id, parsedTeamId),
    "Failed to verify record team membership.",
  );

  if (!isMember) {
    throw new RecordAppError("FORBIDDEN", 403, "You do not belong to this team.");
  }

  return parsedTeamId;
}

export async function createRecordTeam(
  supabase: RecordSupabaseClient,
  input: unknown,
): Promise<RecordTeamDto> {
  const user = await getAuthenticatedUser(supabase);
  const parsedInput: CreateRecordTeamRequest = createRecordTeamRequestSchema.parse(input);
  const profile = await getCurrentProfile(supabase, user.id);
  const leaderUsername = profile?.leetcode_username?.trim() || getMetadataValue(user, "leetcode_username");

  if (!leaderUsername) {
    throw new RecordAppError("BAD_REQUEST", 400, "Set your LeetCode username before creating a team.");
  }

  const legacyUserList = toLegacyUserList(parsedInput.invitedUsers);
  const team = assertRepositoryResult(
    await createTeamRow(supabase, parsedInput, leaderUsername, legacyUserList),
    "Failed to create the team.",
  );

  if (!team) {
    throw new RecordAppError("INTERNAL_ERROR", 500, "The created team was not returned.");
  }

  const parsedTeam = createdTeamRowSchema.parse(team);
  const leaderMembership = assertRepositoryResult(
    await createTeamMembershipRow(supabase, parsedTeam.rid, user.id, "Leader"),
    "Failed to create the team leader membership.",
  );

  if (!leaderMembership) {
    throw new RecordAppError("INTERNAL_ERROR", 500, "The created team leader membership was not returned.");
  }

  const invitedUserIds = collectAuthUserIds(parsedInput.invitedUsers).filter((userId) => userId !== user.id);

  for (const invitedUserId of invitedUserIds) {
    await createTeamMembershipRow(supabase, parsedTeam.rid, invitedUserId, "Member");
  }

  return toRecordTeamDto(parsedTeam);
}

type ContributorStats = {
  records: number;
  verifiedRecords: number;
  feedbackComments: number;
};

const CONTRIBUTOR_LIMIT = 5;
const koreanDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function getKoreanDateKey(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  const parts = koreanDateFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function addUtcDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function computeTeamStreak(rows: RecordInsightRecordRow[], now = new Date()) {
  const verifiedRows = rows.filter((row) => row.status === "Verified");
  const verifiedDays = new Set(verifiedRows.map((row) => getKoreanDateKey(row.created_at)));
  const lastVerifiedAt =
    verifiedRows
      .map((row) => row.created_at)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ?? null;
  let currentStreakDays = 0;
  let cursor = now;

  while (verifiedDays.has(getKoreanDateKey(cursor))) {
    currentStreakDays += 1;
    cursor = addUtcDays(cursor, -1);
  }

  return {
    currentStreakDays,
    lastVerifiedAt,
  };
}

function getContributor(stats: Map<string, ContributorStats>, userId: string) {
  const existing = stats.get(userId);

  if (existing) {
    return existing;
  }

  const next = {
    records: 0,
    verifiedRecords: 0,
    feedbackComments: 0,
  };

  stats.set(userId, next);
  return next;
}

function scoreContributor(stats: ContributorStats) {
  return stats.records + stats.verifiedRecords * 2 + stats.feedbackComments;
}

async function resolveInsightTeamIds(
  supabase: RecordSupabaseClient,
  userId: string,
  query: { scope: "team" | "allTeams"; teamId?: number },
) {
  if (query.scope === "team") {
    const teamId = query.teamId as number;
    const isMember = assertRepositoryResult(
      await checkRecordTeamMembership(supabase, userId, teamId),
      "Failed to verify record team membership.",
    );

    if (!isMember) {
      throw new RecordAppError("FORBIDDEN", 403, "You do not belong to this team.");
    }

    return [teamId];
  }

  return assertRepositoryResult(
    await listRecordTeamIdsForUser(supabase, userId),
    "Failed to load record team ids.",
  );
}

export async function loadRecordInsights(
  supabase: RecordSupabaseClient,
  input: unknown,
): Promise<RecordInsightsResponse> {
  const user = await getAuthenticatedUser(supabase);
  const query = recordInsightsQuerySchema.parse(input ?? {});
  const teamIds = await resolveInsightTeamIds(supabase, user.id, query);
  const recordRows = assertRepositoryResult(
    await listInsightRecordRowsByTeams(supabase, teamIds),
    "Failed to load record insight rows.",
  ).map((row) => recordInsightRecordRowSchema.parse(row));
  const feedbackRows = assertRepositoryResult(
    await listFeedbackContributionRowsByRecordIds(
      supabase,
      recordRows.map((row) => row.id),
    ),
    "Failed to load record feedback insight rows.",
  ).map((row) => feedbackContributionRowSchema.parse(row));
  const contributorStats = new Map<string, ContributorStats>();

  for (const row of recordRows) {
    const stats = getContributor(contributorStats, row.author_id);
    stats.records += 1;

    if (row.status === "Verified") {
      stats.verifiedRecords += 1;
    }
  }

  for (const row of feedbackRows) {
    getContributor(contributorStats, row.author_id).feedbackComments += 1;
  }

  const profileMap = await loadProfileMap(supabase, Array.from(contributorStats.keys()));
  const topContributors = Array.from(contributorStats.entries())
    .map(([userId, stats]) => {
      const profile = profileMap.get(userId);
      const name = getAuthorName(profile, userId === user.id ? user : null);

      return {
        userId,
        name,
        avatarLabel: getAvatarLabel(name),
        score: scoreContributor(stats),
        records: stats.records,
        verifiedRecords: stats.verifiedRecords,
        feedbackComments: stats.feedbackComments,
      };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.verifiedRecords - a.verifiedRecords ||
        b.records - a.records ||
        a.name.localeCompare(b.name),
    )
    .slice(0, CONTRIBUTOR_LIMIT);

  return recordInsightsResponseSchema.parse({
    streak: computeTeamStreak(recordRows),
    topContributors,
  });
}

export async function listRecords(
  supabase: RecordSupabaseClient,
  input: unknown,
): Promise<ListRecordsResponse> {
  const user = await getAuthenticatedUser(supabase);
  const query = listRecordsQuerySchema.parse(input ?? {});
  let rowResult: RepositoryResult<RecordRow[]>;

  if (query.scope === "team") {
    const teamId = query.teamId as number;
    const isMember = assertRepositoryResult(
      await checkRecordTeamMembership(supabase, user.id, teamId),
      "Failed to verify record team membership.",
    );

    if (!isMember) {
      throw new RecordAppError("FORBIDDEN", 403, "You do not belong to this team.");
    }

    rowResult = await listRecordRowsByTeam(supabase, teamId, query);
  } else if (query.scope === "allTeams") {
    const teamIds = assertRepositoryResult(
      await listRecordTeamIdsForUser(supabase, user.id),
      "Failed to load record team ids.",
    );

    rowResult = await listRecordRowsByTeams(supabase, teamIds, query);
  } else {
    rowResult = await listRecordRows(supabase, user.id, query);
  }

  const rows = assertRepositoryResult(rowResult, "Failed to load records.").map((row) =>
    recordRowSchema.parse(row),
  );
  const profileMap = await loadProfileMap(
    supabase,
    rows.map((row) => row.author_id),
  );
  const commentCounts = assertRepositoryResult(
    await listCommentCountsByRecordId(
      supabase,
      rows.map((row) => row.id),
    ),
    "Failed to count record feedback comments.",
  );
  const items = rows.map((row) =>
    toRecordDto({
      row,
      profile: profileMap.get(row.author_id),
      currentUser: user,
      comments: commentCounts.get(row.id) ?? 0,
    }),
  );

  return listRecordsResponseSchema.parse({ items });
}

export async function createRecord(
  supabase: RecordSupabaseClient,
  input: unknown,
): Promise<RecordDto> {
  const user = await getAuthenticatedUser(supabase);
  const parsedInput = createRecordRequestSchema.parse(input);

  if (parsedInput.teamId !== undefined) {
    const isMember = assertRepositoryResult(
      await checkRecordTeamMembership(supabase, user.id, parsedInput.teamId),
      "Failed to verify record team membership.",
    );

    if (!isMember) {
      throw new RecordAppError("FORBIDDEN", 403, "You do not belong to this team.");
    }
  }

  const row = assertRepositoryResult(
    await createRecordRow(supabase, user.id, parsedInput),
    "Failed to create record.",
  );

  if (!row) {
    throw new RecordAppError("INTERNAL_ERROR", 500, "The created record was not returned.");
  }

  const parsedRow = recordRowSchema.parse(row);
  const profileMap = await loadProfileMap(supabase, [parsedRow.author_id]);

  return toRecordDto({
    row: parsedRow,
    profile: profileMap.get(parsedRow.author_id),
    currentUser: user,
    comments: 0,
  });
}

export async function loadRecordDetail(
  supabase: RecordSupabaseClient,
  recordId: unknown,
): Promise<RecordDetailResponse> {
  const user = await getAuthenticatedUser(supabase);
  const parsedRecordId = recordIdSchema.parse(recordId);
  const row = assertRepositoryResult(
    await loadRecordRow(supabase, parsedRecordId),
    "Failed to load record.",
  );

  if (!row) {
    throw new RecordAppError("NOT_FOUND", 404);
  }

  const parsedRow = recordRowSchema.parse(row);
  const comments = assertRepositoryResult(
    await listFeedbackCommentRows(supabase, parsedRow.id),
    "Failed to load record feedback comments.",
  ).map((comment) => feedbackCommentRowSchema.parse(comment));
  const profileMap = await loadProfileMap(supabase, [
    parsedRow.author_id,
    ...comments.map((comment) => comment.author_id),
  ]);
  const record = toRecordDto({
    row: parsedRow,
    profile: profileMap.get(parsedRow.author_id),
    currentUser: user,
    comments: comments.length,
  });
  const commentDtos = comments.map((comment) =>
    toFeedbackCommentDto({
      row: comment,
      profile: profileMap.get(comment.author_id),
      currentUser: user,
    }),
  );

  return recordDetailResponseSchema.parse({
    record,
    comments: commentDtos,
  });
}

export async function createFeedbackComment(
  supabase: RecordSupabaseClient,
  recordId: unknown,
  input: unknown,
): Promise<FeedbackCommentDto> {
  const user = await getAuthenticatedUser(supabase);
  const parsedRecordId = recordIdSchema.parse(recordId);
  const parsedInput = createFeedbackRequestSchema.parse(input);
  const existingRecord = assertRepositoryResult(
    await loadRecordRow(supabase, parsedRecordId),
    "Failed to load record.",
  );

  if (!existingRecord) {
    throw new RecordAppError("NOT_FOUND", 404);
  }

  const comment = assertRepositoryResult(
    await createFeedbackCommentRow(supabase, parsedRecordId, user.id, parsedInput),
    "Failed to create record feedback comment.",
  );

  if (!comment) {
    throw new RecordAppError("INTERNAL_ERROR", 500, "The created feedback comment was not returned.");
  }

  const parsedComment = feedbackCommentRowSchema.parse(comment);
  const profileMap = await loadProfileMap(supabase, [parsedComment.author_id]);

  return toFeedbackCommentDto({
    row: parsedComment,
    profile: profileMap.get(parsedComment.author_id),
    currentUser: user,
  });
}
