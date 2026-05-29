import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CreatedTeamRow,
  CreateFeedbackRequest,
  CreateRecordTeamRequest,
  CreateRecordRequest,
  FeedbackContributionRow,
  FeedbackCommentRow,
  ListRecordsQuery,
  ProfileRow,
  RecordInsightRecordRow,
  RecordRow,
  RecordTeamRow,
  TeamMembershipRow,
} from "@/lib/record/types";

export type RecordSupabaseClient = SupabaseClient;

type SupabaseError = {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
};

type InsertRecordRow = {
  author_id: string;
  team_id: number | null;
  problem_title: string;
  title_slug: string;
  difficulty: CreateRecordRequest["difficulty"];
  tags: string[];
  language: string;
  runtime: string | null;
  memory: string | null;
  code: string;
  status: CreateRecordRequest["status"];
  review_note: string | null;
};

type InsertFeedbackCommentRow = {
  record_id: string;
  author_id: string;
  content: string;
};

type InsertTeamRow = {
  teamName: string;
  description: string | null;
  teamLeader: string;
  UserList: string[];
  isActivated: number;
};

type InsertTeamMemberRow = {
  team_id: number;
  user_id: string;
  role: TeamMembershipRow["role"];
};

export type RepositoryResult<T> = {
  data: T;
  error: SupabaseError | null;
};

function toNullableText(value: string | null | undefined) {
  return value ?? null;
}

function normalizeSearchTerm(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? `%${trimmed}%` : null;
}

function toStartOfUtcDay(value: string) {
  return `${value}T00:00:00.000Z`;
}

function toExclusiveEndOfUtcDay(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day + 1)).toISOString();
}

export async function listRecordRows(
  supabase: RecordSupabaseClient,
  authorId: string,
  query: ListRecordsQuery,
): Promise<RepositoryResult<RecordRow[]>> {
  let request = supabase
    .from("code_records")
    .select("*")
    .eq("author_id", authorId)
    .order("created_at", { ascending: false })
    .limit(query.limit);

  const searchTerm = normalizeSearchTerm(query.q);

  if (searchTerm) {
    request = request.ilike("problem_title", searchTerm);
  }

  if (query.difficulty) {
    request = request.eq("difficulty", query.difficulty);
  }

  if (query.language) {
    request = request.eq("language", query.language);
  }

  if (query.status) {
    request = request.eq("status", query.status);
  }

  if (query.from) {
    request = request.gte("created_at", toStartOfUtcDay(query.from));
  }

  if (query.to) {
    request = request.lt("created_at", toExclusiveEndOfUtcDay(query.to));
  }

  const { data, error } = await request;

  return {
    data: (data ?? []) as RecordRow[],
    error,
  };
}

export async function listRecordRowsByTeam(
  supabase: RecordSupabaseClient,
  teamId: number,
  query: ListRecordsQuery,
): Promise<RepositoryResult<RecordRow[]>> {
  let request = supabase
    .from("code_records")
    .select("*")
    .eq("team_id", teamId)
    .order("created_at", { ascending: false })
    .limit(query.limit);

  const searchTerm = normalizeSearchTerm(query.q);

  if (searchTerm) {
    request = request.ilike("problem_title", searchTerm);
  }

  if (query.difficulty) {
    request = request.eq("difficulty", query.difficulty);
  }

  if (query.language) {
    request = request.eq("language", query.language);
  }

  if (query.status) {
    request = request.eq("status", query.status);
  }

  if (query.from) {
    request = request.gte("created_at", toStartOfUtcDay(query.from));
  }

  if (query.to) {
    request = request.lt("created_at", toExclusiveEndOfUtcDay(query.to));
  }

  const { data, error } = await request;

  return {
    data: (data ?? []) as RecordRow[],
    error,
  };
}

export async function listRecordRowsByTeams(
  supabase: RecordSupabaseClient,
  teamIds: number[],
  query: ListRecordsQuery,
): Promise<RepositoryResult<RecordRow[]>> {
  const uniqueTeamIds = Array.from(new Set(teamIds));

  if (uniqueTeamIds.length === 0) {
    return {
      data: [],
      error: null,
    };
  }

  let request = supabase
    .from("code_records")
    .select("*")
    .in("team_id", uniqueTeamIds)
    .order("created_at", { ascending: false })
    .limit(query.limit);

  const searchTerm = normalizeSearchTerm(query.q);

  if (searchTerm) {
    request = request.ilike("problem_title", searchTerm);
  }

  if (query.difficulty) {
    request = request.eq("difficulty", query.difficulty);
  }

  if (query.language) {
    request = request.eq("language", query.language);
  }

  if (query.status) {
    request = request.eq("status", query.status);
  }

  if (query.from) {
    request = request.gte("created_at", toStartOfUtcDay(query.from));
  }

  if (query.to) {
    request = request.lt("created_at", toExclusiveEndOfUtcDay(query.to));
  }

  const { data, error } = await request;

  return {
    data: (data ?? []) as RecordRow[],
    error,
  };
}

export async function listInsightRecordRowsByTeams(
  supabase: RecordSupabaseClient,
  teamIds: number[],
): Promise<RepositoryResult<RecordInsightRecordRow[]>> {
  const uniqueTeamIds = Array.from(new Set(teamIds));

  if (uniqueTeamIds.length === 0) {
    return {
      data: [],
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("code_records")
    .select("id, author_id, team_id, status, created_at")
    .in("team_id", uniqueTeamIds);

  return {
    data: (data ?? []) as RecordInsightRecordRow[],
    error,
  };
}

export async function listFeedbackContributionRowsByRecordIds(
  supabase: RecordSupabaseClient,
  recordIds: string[],
): Promise<RepositoryResult<FeedbackContributionRow[]>> {
  const uniqueRecordIds = Array.from(new Set(recordIds));

  if (uniqueRecordIds.length === 0) {
    return {
      data: [],
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("record_feedback_comments")
    .select("author_id")
    .in("record_id", uniqueRecordIds);

  return {
    data: (data ?? []) as FeedbackContributionRow[],
    error,
  };
}

export async function createRecordRow(
  supabase: RecordSupabaseClient,
  authorId: string,
  input: CreateRecordRequest,
): Promise<RepositoryResult<RecordRow | null>> {
  const insertRow: InsertRecordRow = {
    author_id: authorId,
    team_id: input.teamId ?? null,
    problem_title: input.problemTitle,
    title_slug: input.titleSlug,
    difficulty: input.difficulty,
    tags: input.tags,
    language: input.language,
    runtime: toNullableText(input.runtime),
    memory: toNullableText(input.memory),
    code: input.code,
    status: input.status,
    review_note: toNullableText(input.reviewNote),
  };

  const { data, error } = await supabase
    .from("code_records")
    .insert(insertRow)
    .select("*")
    .single();

  return {
    data: data as RecordRow | null,
    error,
  };
}

export async function loadRecordRow(
  supabase: RecordSupabaseClient,
  id: string,
): Promise<RepositoryResult<RecordRow | null>> {
  const { data, error } = await supabase
    .from("code_records")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return {
    data: data as RecordRow | null,
    error,
  };
}

export async function listFeedbackCommentRows(
  supabase: RecordSupabaseClient,
  recordId: string,
): Promise<RepositoryResult<FeedbackCommentRow[]>> {
  const { data, error } = await supabase
    .from("record_feedback_comments")
    .select("*")
    .eq("record_id", recordId)
    .order("created_at", { ascending: true });

  return {
    data: (data ?? []) as FeedbackCommentRow[],
    error,
  };
}

export async function createFeedbackCommentRow(
  supabase: RecordSupabaseClient,
  recordId: string,
  authorId: string,
  input: CreateFeedbackRequest,
): Promise<RepositoryResult<FeedbackCommentRow | null>> {
  const insertRow: InsertFeedbackCommentRow = {
    record_id: recordId,
    author_id: authorId,
    content: input.content,
  };

  const { data, error } = await supabase
    .from("record_feedback_comments")
    .insert(insertRow)
    .select("*")
    .single();

  return {
    data: data as FeedbackCommentRow | null,
    error,
  };
}

export async function listCommentCountsByRecordId(
  supabase: RecordSupabaseClient,
  recordIds: string[],
): Promise<RepositoryResult<Map<string, number>>> {
  if (recordIds.length === 0) {
    return {
      data: new Map(),
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("record_feedback_comments")
    .select("record_id")
    .in("record_id", recordIds);

  const counts = new Map<string, number>();

  for (const item of (data ?? []) as Array<{ record_id: string }>) {
    counts.set(item.record_id, (counts.get(item.record_id) ?? 0) + 1);
  }

  return {
    data: counts,
    error,
  };
}

export async function listProfilesByIds(
  supabase: RecordSupabaseClient,
  ids: string[],
): Promise<RepositoryResult<ProfileRow[]>> {
  const uniqueIds = Array.from(new Set(ids));

  if (uniqueIds.length === 0) {
    return {
      data: [],
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, boj_handle")
    .in("id", uniqueIds);

  return {
    data: (data ?? []) as ProfileRow[],
    error,
  };
}

export async function listRecordTeamIdsForUser(
  supabase: RecordSupabaseClient,
  userId: string,
): Promise<RepositoryResult<number[]>> {
  const { data, error } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("user_id", userId)
    .order("team_id", { ascending: true });

  return {
    data: ((data ?? []) as Pick<TeamMembershipRow, "team_id">[]).map((row) => row.team_id),
    error,
  };
}

export async function listRecordTeamsForUser(
  supabase: RecordSupabaseClient,
  userId: string,
): Promise<RepositoryResult<RecordTeamRow[]>> {
  const teamIdsResult = await listRecordTeamIdsForUser(supabase, userId);

  if (teamIdsResult.error) {
    return {
      data: [],
      error: teamIdsResult.error,
    };
  }

  const teamIds = Array.from(new Set(teamIdsResult.data));

  if (teamIds.length === 0) {
    return {
      data: [],
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("team")
    .select("rid, teamName")
    .in("rid", teamIds)
    .order("rid", { ascending: true });

  return {
    data: (data ?? []) as RecordTeamRow[],
    error,
  };
}

export async function checkRecordTeamMembership(
  supabase: RecordSupabaseClient,
  userId: string,
  teamId: number,
): Promise<RepositoryResult<boolean>> {
  const { data, error } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("user_id", userId)
    .eq("team_id", teamId)
    .limit(1);

  return {
    data: ((data ?? []) as Pick<TeamMembershipRow, "team_id">[]).length > 0,
    error,
  };
}

export async function createTeamRow(
  supabase: RecordSupabaseClient,
  input: CreateRecordTeamRequest,
  leaderHandle: string,
  legacyUserList: string[],
): Promise<RepositoryResult<CreatedTeamRow | null>> {
  const insertRow: InsertTeamRow = {
    teamName: input.teamName,
    description: toNullableText(input.description),
    teamLeader: leaderHandle,
    UserList: legacyUserList,
    isActivated: 1,
  };

  const { data, error } = await supabase
    .from("team")
    .insert(insertRow)
    .select("rid, teamName, description, teamLeader, UserList")
    .single();

  return {
    data: data as CreatedTeamRow | null,
    error,
  };
}

export async function createTeamMembershipRow(
  supabase: RecordSupabaseClient,
  teamId: number,
  userId: string,
  role: TeamMembershipRow["role"],
): Promise<RepositoryResult<TeamMembershipRow | null>> {
  const insertRow: InsertTeamMemberRow = {
    team_id: teamId,
    user_id: userId,
    role,
  };

  const { data, error } = await supabase
    .from("team_members")
    .insert(insertRow)
    .select("team_id, user_id, role")
    .single();

  return {
    data: data as TeamMembershipRow | null,
    error,
  };
}
