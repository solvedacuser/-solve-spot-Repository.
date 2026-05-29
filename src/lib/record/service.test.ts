import type { User } from "@supabase/supabase-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RecordAppError } from "@/lib/record/errors";
import type { RecordSupabaseClient } from "@/lib/record/repository";

vi.mock("@/lib/record/repository", () => ({
  checkRecordTeamMembership: vi.fn(),
  createFeedbackCommentRow: vi.fn(),
  createRecordRow: vi.fn(),
  createTeamMembershipRow: vi.fn(),
  createTeamRow: vi.fn(),
  listCommentCountsByRecordId: vi.fn(),
  listFeedbackContributionRowsByRecordIds: vi.fn(),
  listFeedbackCommentRows: vi.fn(),
  listInsightRecordRowsByTeams: vi.fn(),
  listProfilesByIds: vi.fn(),
  listRecordRows: vi.fn(),
  listRecordRowsByTeam: vi.fn(),
  listRecordRowsByTeams: vi.fn(),
  listRecordTeamIdsForUser: vi.fn(),
  listRecordTeamsForUser: vi.fn(),
  loadRecordRow: vi.fn(),
}));

const repository = await import("@/lib/record/repository");
const {
  assertRecordTeamMember,
  createFeedbackComment,
  createRecord,
  createRecordTeam,
  listRecordTeamIds,
  listRecordTeams,
  listRecords,
  loadRecordInsights,
  loadRecordDetail,
} = await import("@/lib/record/service");

const user = {
  id: "22222222-2222-4222-8222-222222222222",
  email: "alice@example.com",
  user_metadata: {
    display_name: "Alice",
  },
} as unknown as User;

const otherUserId = "55555555-5555-4555-8555-555555555555";

const recordRow = {
  id: "11111111-1111-4111-8111-111111111111",
  author_id: user.id,
  team_id: null,
  problem_title: "Two Sum",
  title_slug: "two-sum",
  difficulty: "Easy" as const,
  tags: ["Array"],
  language: "TypeScript",
  runtime: null,
  memory: null,
  code: "return [];",
  status: "Review Requested" as const,
  review_note: null,
  created_at: "2026-05-25T00:00:00.000Z",
  updated_at: "2026-05-25T00:00:00.000Z",
};

const teamRecordRow = {
  ...recordRow,
  team_id: 123,
};

const commentRow = {
  id: "33333333-3333-4333-8333-333333333333",
  record_id: recordRow.id,
  author_id: user.id,
  content: "Looks good.",
  created_at: "2026-05-25T00:00:00.000Z",
  updated_at: "2026-05-25T00:00:00.000Z",
};

const teamRow = {
  rid: 123,
  teamName: "Algorithms",
};

const createdTeamRow = {
  ...teamRow,
  description: "Practice together",
  teamLeader: "alice",
  UserList: [],
};

const todayInsightRecordRow = {
  id: "66666666-6666-4666-8666-666666666666",
  author_id: user.id,
  team_id: 123,
  status: "Verified" as const,
  created_at: "2026-05-27T01:00:00.000Z",
};

const yesterdayInsightRecordRow = {
  id: "77777777-7777-4777-8777-777777777777",
  author_id: otherUserId,
  team_id: 123,
  status: "Verified" as const,
  created_at: "2026-05-26T01:00:00.000Z",
};

const draftInsightRecordRow = {
  id: "88888888-8888-4888-8888-888888888888",
  author_id: otherUserId,
  team_id: 456,
  status: "Draft" as const,
  created_at: "2026-05-25T01:00:00.000Z",
};

function createSupabase(userValue: User | null = user) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: userValue,
        },
        error: null,
      }),
    },
  } as unknown as RecordSupabaseClient;
}

describe("record service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("rejects unauthenticated users", async () => {
    await expect(listRecords(createSupabase(null), {})).rejects.toMatchObject({
      code: "UNAUTHORIZED",
      status: 401,
    });
  });

  it("creates a record DTO", async () => {
    vi.mocked(repository.createRecordRow).mockResolvedValue({ data: recordRow, error: null });
    vi.mocked(repository.listProfilesByIds).mockResolvedValue({
      data: [{ id: user.id, display_name: "Alice", boj_handle: "alice" }],
      error: null,
    });

    const result = await createRecord(createSupabase(), {
      problemTitle: "Two Sum",
      titleSlug: "two-sum",
      difficulty: "Easy",
      tags: ["Array"],
      language: "TypeScript",
      code: "return [];",
    });

    expect(result.id).toBe(recordRow.id);
    expect(result.author.name).toBe("Alice");
    expect(result.problem.titleSlug).toBe("two-sum");
  });

  it("creates a team record when the author belongs to the team", async () => {
    vi.mocked(repository.checkRecordTeamMembership).mockResolvedValue({
      data: true,
      error: null,
    });
    vi.mocked(repository.createRecordRow).mockResolvedValue({ data: teamRecordRow, error: null });
    vi.mocked(repository.listProfilesByIds).mockResolvedValue({
      data: [{ id: user.id, display_name: "Alice", boj_handle: "alice" }],
      error: null,
    });

    const result = await createRecord(createSupabase(), {
      problemTitle: "Two Sum",
      titleSlug: "two-sum",
      difficulty: "Easy",
      tags: ["Array"],
      language: "TypeScript",
      code: "return [];",
      teamId: 123,
    });

    expect(result.id).toBe(recordRow.id);
    expect(repository.checkRecordTeamMembership).toHaveBeenCalledWith(expect.anything(), user.id, 123);
    expect(repository.createRecordRow).toHaveBeenCalledWith(
      expect.anything(),
      user.id,
      expect.objectContaining({ teamId: 123 }),
    );
  });

  it("rejects team record creation for non-members", async () => {
    vi.mocked(repository.checkRecordTeamMembership).mockResolvedValue({
      data: false,
      error: null,
    });

    await expect(
      createRecord(createSupabase(), {
        problemTitle: "Two Sum",
        titleSlug: "two-sum",
        difficulty: "Easy",
        tags: ["Array"],
        language: "TypeScript",
        code: "return [];",
        teamId: 123,
      }),
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
      status: 403,
    });
    expect(repository.createRecordRow).not.toHaveBeenCalled();
  });

  it("rejects invalid create payloads before repository writes", async () => {
    await expect(createRecord(createSupabase(), { titleSlug: "not enough data" })).rejects.toHaveProperty("issues");
    expect(repository.createRecordRow).not.toHaveBeenCalled();
  });

  it("creates a team and normalized memberships", async () => {
    const invitedUserId = "44444444-4444-4444-8444-444444444444";
    vi.mocked(repository.listProfilesByIds).mockResolvedValue({
      data: [{ id: user.id, display_name: "Alice", leetcode_username: "alice-lc", boj_handle: "alice" }],
      error: null,
    });
    vi.mocked(repository.createTeamRow).mockResolvedValue({
      data: createdTeamRow,
      error: null,
    });
    vi.mocked(repository.createTeamMembershipRow).mockResolvedValue({
      data: { team_id: 123, user_id: user.id, role: "Leader" },
      error: null,
    });

    const result = await createRecordTeam(createSupabase(), {
      name: "Algorithms",
      description: "Practice together",
      invitedUsers: [{ user_id: invitedUserId }],
    });

    expect(result).toEqual({ id: 123, name: "Algorithms" });
    expect(repository.createTeamRow).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: "Algorithms" }),
      "alice-lc",
      [JSON.stringify({ user_id: invitedUserId })],
    );
    expect(repository.createTeamMembershipRow).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      123,
      user.id,
      "Leader",
    );
    expect(repository.createTeamMembershipRow).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      123,
      invitedUserId,
      "Member",
    );
  });

  it("rejects team creation without a LeetCode username profile", async () => {
    vi.mocked(repository.listProfilesByIds).mockResolvedValue({
      data: [{ id: user.id, display_name: "Alice", leetcode_username: null, boj_handle: "alice" }],
      error: null,
    });

    await expect(
      createRecordTeam(createSupabase(), {
        name: "Algorithms",
        invitedUsers: [],
      }),
    ).rejects.toMatchObject({
      code: "BAD_REQUEST",
      status: 400,
    });
    expect(repository.createTeamRow).not.toHaveBeenCalled();
  });

  it("loads a record list", async () => {
    vi.mocked(repository.listRecordRows).mockResolvedValue({ data: [recordRow], error: null });
    vi.mocked(repository.listProfilesByIds).mockResolvedValue({
      data: [{ id: user.id, display_name: "Alice", boj_handle: null }],
      error: null,
    });
    vi.mocked(repository.listCommentCountsByRecordId).mockResolvedValue({
      data: new Map([[recordRow.id, 2]]),
      error: null,
    });

    const result = await listRecords(createSupabase(), { limit: "10" });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.comments).toBe(2);
  });

  it("loads a team-scoped record list for team members", async () => {
    vi.mocked(repository.checkRecordTeamMembership).mockResolvedValue({
      data: true,
      error: null,
    });
    vi.mocked(repository.listRecordRowsByTeam).mockResolvedValue({ data: [teamRecordRow], error: null });
    vi.mocked(repository.listProfilesByIds).mockResolvedValue({
      data: [{ id: user.id, display_name: "Alice", boj_handle: "alice" }],
      error: null,
    });
    vi.mocked(repository.listCommentCountsByRecordId).mockResolvedValue({
      data: new Map([[teamRecordRow.id, 1]]),
      error: null,
    });

    const result = await listRecords(createSupabase(), {
      scope: "team",
      teamId: "123",
    });

    expect(result.items).toHaveLength(1);
    expect(repository.checkRecordTeamMembership).toHaveBeenCalledWith(expect.anything(), user.id, 123);
    expect(repository.listRecordRowsByTeam).toHaveBeenCalledWith(
      expect.anything(),
      123,
      expect.objectContaining({ scope: "team", teamId: 123 }),
    );
  });

  it("rejects team-scoped record lists for non-members", async () => {
    vi.mocked(repository.checkRecordTeamMembership).mockResolvedValue({
      data: false,
      error: null,
    });

    await expect(
      listRecords(createSupabase(), {
        scope: "team",
        teamId: "123",
      }),
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
      status: 403,
    });
    expect(repository.listRecordRowsByTeam).not.toHaveBeenCalled();
  });

  it("loads all-team records through the user's memberships", async () => {
    vi.mocked(repository.listRecordTeamIdsForUser).mockResolvedValue({
      data: [123, 456],
      error: null,
    });
    vi.mocked(repository.listRecordRowsByTeams).mockResolvedValue({ data: [teamRecordRow], error: null });
    vi.mocked(repository.listProfilesByIds).mockResolvedValue({
      data: [{ id: user.id, display_name: "Alice", boj_handle: "alice" }],
      error: null,
    });
    vi.mocked(repository.listCommentCountsByRecordId).mockResolvedValue({
      data: new Map([[teamRecordRow.id, 0]]),
      error: null,
    });

    const result = await listRecords(createSupabase(), {
      scope: "allTeams",
    });

    expect(result.items).toHaveLength(1);
    expect(repository.listRecordTeamIdsForUser).toHaveBeenCalledWith(expect.anything(), user.id);
    expect(repository.listRecordRowsByTeams).toHaveBeenCalledWith(
      expect.anything(),
      [123, 456],
      expect.objectContaining({ scope: "allTeams" }),
    );
    expect(repository.listRecordRows).not.toHaveBeenCalled();
  });

  it("rejects invalid list scopes before repository queries", async () => {
    await expect(listRecords(createSupabase(), { scope: "team" })).rejects.toHaveProperty("issues");
    expect(repository.listRecordRows).not.toHaveBeenCalled();
  });

  it("lists teams for the current user", async () => {
    vi.mocked(repository.listRecordTeamsForUser).mockResolvedValue({
      data: [teamRow],
      error: null,
    });

    const result = await listRecordTeams(createSupabase());

    expect(result).toEqual([{ id: 123, name: "Algorithms" }]);
    expect(repository.listRecordTeamsForUser).toHaveBeenCalledWith(expect.anything(), user.id);
  });

  it("returns an empty team list when the user has no memberships", async () => {
    vi.mocked(repository.listRecordTeamsForUser).mockResolvedValue({
      data: [],
      error: null,
    });

    await expect(listRecordTeams(createSupabase())).resolves.toEqual([]);
  });

  it("lists team ids for the current user", async () => {
    vi.mocked(repository.listRecordTeamIdsForUser).mockResolvedValue({
      data: [123, 456],
      error: null,
    });

    await expect(listRecordTeamIds(createSupabase())).resolves.toEqual([123, 456]);
  });

  it("allows team members through the membership assertion", async () => {
    vi.mocked(repository.checkRecordTeamMembership).mockResolvedValue({
      data: true,
      error: null,
    });

    await expect(assertRecordTeamMember(createSupabase(), 123)).resolves.toBe(123);
  });

  it("rejects non-members through the membership assertion", async () => {
    vi.mocked(repository.checkRecordTeamMembership).mockResolvedValue({
      data: false,
      error: null,
    });

    await expect(assertRecordTeamMember(createSupabase(), 123)).rejects.toMatchObject({
      code: "FORBIDDEN",
      status: 403,
    });
  });

  it("loads record insights with KST streak and contributor scores", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-27T03:00:00.000Z"));
    vi.mocked(repository.listRecordTeamIdsForUser).mockResolvedValue({
      data: [123, 456],
      error: null,
    });
    vi.mocked(repository.listInsightRecordRowsByTeams).mockResolvedValue({
      data: [todayInsightRecordRow, yesterdayInsightRecordRow, draftInsightRecordRow],
      error: null,
    });
    vi.mocked(repository.listFeedbackContributionRowsByRecordIds).mockResolvedValue({
      data: [{ author_id: user.id }, { author_id: otherUserId }, { author_id: otherUserId }],
      error: null,
    });
    vi.mocked(repository.listProfilesByIds).mockResolvedValue({
      data: [
        { id: user.id, display_name: "Alice", boj_handle: "alice" },
        { id: otherUserId, display_name: "Bob", boj_handle: "bob" },
      ],
      error: null,
    });

    const result = await loadRecordInsights(createSupabase(), { scope: "allTeams" });

    expect(result.streak).toEqual({
      currentStreakDays: 2,
      lastVerifiedAt: "2026-05-27T01:00:00.000Z",
    });
    expect(result.topContributors[0]).toMatchObject({
      userId: otherUserId,
      name: "Bob",
      score: 6,
      records: 2,
      verifiedRecords: 1,
      feedbackComments: 2,
    });
    expect(repository.listInsightRecordRowsByTeams).toHaveBeenCalledWith(expect.anything(), [123, 456]);
  });

  it("returns zero insights when there are no team records", async () => {
    vi.mocked(repository.checkRecordTeamMembership).mockResolvedValue({
      data: true,
      error: null,
    });
    vi.mocked(repository.listInsightRecordRowsByTeams).mockResolvedValue({
      data: [],
      error: null,
    });
    vi.mocked(repository.listFeedbackContributionRowsByRecordIds).mockResolvedValue({
      data: [],
      error: null,
    });
    vi.mocked(repository.listProfilesByIds).mockResolvedValue({
      data: [],
      error: null,
    });

    const result = await loadRecordInsights(createSupabase(), {
      scope: "team",
      teamId: "123",
    });

    expect(result).toEqual({
      streak: {
        currentStreakDays: 0,
        lastVerifiedAt: null,
      },
      topContributors: [],
    });
  });

  it("rejects record insights for non-member teams", async () => {
    vi.mocked(repository.checkRecordTeamMembership).mockResolvedValue({
      data: false,
      error: null,
    });

    await expect(
      loadRecordInsights(createSupabase(), {
        scope: "team",
        teamId: "123",
      }),
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
      status: 403,
    });
    expect(repository.listInsightRecordRowsByTeams).not.toHaveBeenCalled();
  });

  it("returns not found for inaccessible detail", async () => {
    vi.mocked(repository.loadRecordRow).mockResolvedValue({ data: null, error: null });

    await expect(loadRecordDetail(createSupabase(), recordRow.id)).rejects.toBeInstanceOf(RecordAppError);
  });

  it("creates a feedback comment", async () => {
    vi.mocked(repository.loadRecordRow).mockResolvedValue({ data: recordRow, error: null });
    vi.mocked(repository.createFeedbackCommentRow).mockResolvedValue({ data: commentRow, error: null });
    vi.mocked(repository.listProfilesByIds).mockResolvedValue({
      data: [{ id: user.id, display_name: "Alice", boj_handle: null }],
      error: null,
    });

    const result = await createFeedbackComment(createSupabase(), recordRow.id, {
      content: "Looks good.",
    });

    expect(result.id).toBe(commentRow.id);
    expect(result.content).toBe("Looks good.");
  });
});
