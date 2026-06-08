import { z } from "zod";
import type { RecordSupabaseClient, RepositoryResult } from "@/lib/record/repository";

const TOP_TEAM_LIMIT = 3;

const teamRowSchema = z.object({
  rid: z.number().int().positive(),
  teamName: z.string().nullable(),
  teamLeader: z.string().nullable(),
  UserList: z.array(z.unknown()).nullable(),
  solved: z.number().int().min(0).nullable(),
});

const teamMemberRowSchema = z.object({
  team_id: z.number().int().positive(),
});

export const landingTopTeamSchema = z.object({
  rank: z.number().int().min(1).max(TOP_TEAM_LIMIT),
  teamId: z.number().int().positive(),
  teamName: z.string().min(1),
  teamLeader: z.string().nullable(),
  solved: z.number().int().min(0),
  memberCount: z.number().int().min(0),
});

export const landingTopTeamsResponseSchema = z.object({
  items: z.array(landingTopTeamSchema).max(TOP_TEAM_LIMIT),
});

export type LandingTopTeam = z.infer<typeof landingTopTeamSchema>;
export type LandingTopTeamsResponse = z.infer<typeof landingTopTeamsResponseSchema>;

function assertRepositoryResult<T>(result: RepositoryResult<T>, fallbackMessage: string): T {
  if (result.error) {
    throw new Error(result.error.message || fallbackMessage);
  }

  return result.data;
}

function legacyMemberCount(userList: unknown[] | null) {
  return (userList?.length ?? 0) + 1;
}

async function listActiveTeamRows(supabase: RecordSupabaseClient): Promise<RepositoryResult<unknown[]>> {
  const { data, error } = await supabase
    .from("team")
    .select("rid, teamName, teamLeader, UserList, solved")
    .eq("isActivated", 1)
    .order("solved", { ascending: false })
    .order("createdAt", { ascending: true })
    .limit(TOP_TEAM_LIMIT);

  return {
    data: data ?? [],
    error,
  };
}

async function listTeamMemberRows(
  supabase: RecordSupabaseClient,
  teamIds: number[],
): Promise<RepositoryResult<unknown[]>> {
  if (teamIds.length === 0) {
    return {
      data: [],
      error: null,
    };
  }

  const { data, error } = await supabase.from("team_members").select("team_id").in("team_id", teamIds);

  return {
    data: data ?? [],
    error,
  };
}

export async function loadLandingTopTeams(supabase: RecordSupabaseClient): Promise<LandingTopTeamsResponse> {
  const teamRows = assertRepositoryResult(await listActiveTeamRows(supabase), "Failed to load landing teams.").map(
    (row) => teamRowSchema.parse(row),
  );
  const teamIds = teamRows.map((row) => row.rid);
  const memberRows = assertRepositoryResult(
    await listTeamMemberRows(supabase, teamIds),
    "Failed to load landing team members.",
  ).map((row) => teamMemberRowSchema.parse(row));
  const memberCounts = new Map<number, number>();

  for (const row of memberRows) {
    memberCounts.set(row.team_id, (memberCounts.get(row.team_id) ?? 0) + 1);
  }

  const items = teamRows.map((row, index) =>
    landingTopTeamSchema.parse({
      rank: index + 1,
      teamId: row.rid,
      teamName: row.teamName?.trim() || `Team #${row.rid}`,
      teamLeader: row.teamLeader?.trim() || null,
      solved: row.solved ?? 0,
      memberCount: memberCounts.get(row.rid) ?? legacyMemberCount(row.UserList),
    }),
  );

  return landingTopTeamsResponseSchema.parse({ items });
}
