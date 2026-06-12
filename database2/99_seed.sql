create extension if not exists pgcrypto;

-- Development seed accounts.
-- Password for every account: password123
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000101',
    'authenticated',
    'authenticated',
    'alice@example.com',
    crypt('password123', gen_salt('bf')),
    now() - interval '20 days',
    now() - interval '1 day',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Alice Kim","leetcode_username":"lee215","boj_handle":"alice_boj"}'::jsonb,
    now() - interval '20 days',
    now() - interval '1 day',
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000102',
    'authenticated',
    'authenticated',
    'bob@example.com',
    crypt('password123', gen_salt('bf')),
    now() - interval '18 days',
    now() - interval '2 days',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Bob Park","leetcode_username":"walkccc","boj_handle":"bob_boj"}'::jsonb,
    now() - interval '18 days',
    now() - interval '2 days',
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000103',
    'authenticated',
    'authenticated',
    'carol@example.com',
    crypt('password123', gen_salt('bf')),
    now() - interval '14 days',
    now() - interval '3 days',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Carol Lee","leetcode_username":"awice","boj_handle":"carol_boj"}'::jsonb,
    now() - interval '14 days',
    now() - interval '3 days',
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000104',
    'authenticated',
    'authenticated',
    'dave@example.com',
    crypt('password123', gen_salt('bf')),
    now() - interval '10 days',
    now() - interval '4 days',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Dave Choi","leetcode_username":"StefanPochmann","boj_handle":"dave_boj"}'::jsonb,
    now() - interval '10 days',
    now() - interval '4 days',
    '',
    '',
    '',
    ''
  )
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  last_sign_in_at = excluded.last_sign_in_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = excluded.updated_at;

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    '10000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000101',
    '{"sub":"00000000-0000-0000-0000-000000000101","email":"alice@example.com","email_verified":true,"phone_verified":false}'::jsonb,
    'email',
    now() - interval '1 day',
    now() - interval '20 days',
    now() - interval '1 day'
  ),
  (
    '10000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000102',
    '{"sub":"00000000-0000-0000-0000-000000000102","email":"bob@example.com","email_verified":true,"phone_verified":false}'::jsonb,
    'email',
    now() - interval '2 days',
    now() - interval '18 days',
    now() - interval '2 days'
  ),
  (
    '10000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000103',
    '{"sub":"00000000-0000-0000-0000-000000000103","email":"carol@example.com","email_verified":true,"phone_verified":false}'::jsonb,
    'email',
    now() - interval '3 days',
    now() - interval '14 days',
    now() - interval '3 days'
  ),
  (
    '10000000-0000-0000-0000-000000000104',
    '00000000-0000-0000-0000-000000000104',
    '00000000-0000-0000-0000-000000000104',
    '{"sub":"00000000-0000-0000-0000-000000000104","email":"dave@example.com","email_verified":true,"phone_verified":false}'::jsonb,
    'email',
    now() - interval '4 days',
    now() - interval '10 days',
    now() - interval '4 days'
  )
on conflict (provider_id, provider) do update
set
  user_id = excluded.user_id,
  identity_data = excluded.identity_data,
  last_sign_in_at = excluded.last_sign_in_at,
  updated_at = excluded.updated_at;

insert into public.profiles (
  id,
  display_name,
  leetcode_username,
  boj_handle,
  signup_at,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000101',
    'Alice Kim',
    'lee215',
    'alice_boj',
    now() - interval '20 days',
    now() - interval '20 days',
    now() - interval '1 day'
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'Bob Park',
    'walkccc',
    'bob_boj',
    now() - interval '18 days',
    now() - interval '18 days',
    now() - interval '2 days'
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    'Carol Lee',
    'awice',
    'carol_boj',
    now() - interval '14 days',
    now() - interval '14 days',
    now() - interval '3 days'
  ),
  (
    '00000000-0000-0000-0000-000000000104',
    'Dave Choi',
    'StefanPochmann',
    'dave_boj',
    now() - interval '10 days',
    now() - interval '10 days',
    now() - interval '4 days'
  )
on conflict (id) do update
set
  display_name = excluded.display_name,
  leetcode_username = excluded.leetcode_username,
  boj_handle = excluded.boj_handle,
  signup_at = excluded.signup_at,
  updated_at = excluded.updated_at;

insert into public.team (
  rid,
  "teamName",
  description,
  "teamLeader",
  "isActivated",
  "UserList",
  "createdAt",
  solved
)
values
  (
    101,
    'Algorithm Core',
    'Daily LeetCode practice group focused on arrays, dynamic programming, and graph problems.',
    'Alice Kim',
    1,
    array['lee215', 'walkccc'],
    now() - interval '12 days',
    3
  ),
  (
    102,
    'Interview Sprint',
    'Small team for weekly mock interviews and code review feedback.',
    'Carol Lee',
    1,
    array['awice', 'StefanPochmann'],
    now() - interval '8 days',
    2
  )
on conflict (rid) do update
set
  "teamName" = excluded."teamName",
  description = excluded.description,
  "teamLeader" = excluded."teamLeader",
  "isActivated" = excluded."isActivated",
  "UserList" = excluded."UserList",
  solved = excluded.solved;

select setval(
  pg_get_serial_sequence('public.team', 'rid'),
  greatest((select coalesce(max(rid), 1) from public.team), 1),
  true
);

insert into public.team_members (
  team_id,
  user_id,
  role,
  created_at,
  updated_at
)
values
  (101, '00000000-0000-0000-0000-000000000101', 'Leader', now() - interval '12 days', now() - interval '1 day'),
  (101, '00000000-0000-0000-0000-000000000102', 'Member', now() - interval '11 days', now() - interval '2 days'),
  (102, '00000000-0000-0000-0000-000000000103', 'Leader', now() - interval '8 days', now() - interval '3 days'),
  (102, '00000000-0000-0000-0000-000000000104', 'Member', now() - interval '7 days', now() - interval '4 days')
on conflict (team_id, user_id) do update
set
  role = excluded.role,
  updated_at = excluded.updated_at;

insert into public."teamMission" (
  rid,
  "created_At",
  missions,
  "solvedList",
  "teamId",
  difficulty
)
values
  (
    1001,
    now() - interval '6 days',
    '[
      {
        "title": "Two Sum",
        "titleSlug": "two-sum",
        "questionFrontendId": "1",
        "difficulty": "Easy",
        "tags": ["Array", "Hash Table"],
        "url": "https://leetcode.com/problems/two-sum/"
      },
      {
        "title": "Longest Substring Without Repeating Characters",
        "titleSlug": "longest-substring-without-repeating-characters",
        "questionFrontendId": "3",
        "difficulty": "Medium",
        "tags": ["Hash Table", "String", "Sliding Window"],
        "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
      }
    ]'::jsonb,
    '[
      {
        "leetcodeUsername": "lee215",
        "titleSlugs": ["two-sum", "longest-substring-without-repeating-characters"]
      },
      {
        "leetcodeUsername": "walkccc",
        "titleSlugs": ["two-sum"]
      }
    ]'::jsonb,
    101,
    'Mixed'
  ),
  (
    1002,
    now() - interval '5 days',
    '[
      {
        "title": "Number of Islands",
        "titleSlug": "number-of-islands",
        "questionFrontendId": "200",
        "difficulty": "Medium",
        "tags": ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"],
        "url": "https://leetcode.com/problems/number-of-islands/"
      },
      {
        "title": "Merge Intervals",
        "titleSlug": "merge-intervals",
        "questionFrontendId": "56",
        "difficulty": "Medium",
        "tags": ["Array", "Sorting"],
        "url": "https://leetcode.com/problems/merge-intervals/"
      }
    ]'::jsonb,
    '[
      {
        "leetcodeUsername": "awice",
        "titleSlugs": ["number-of-islands"]
      },
      {
        "leetcodeUsername": "StefanPochmann",
        "titleSlugs": ["merge-intervals"]
      }
    ]'::jsonb,
    102,
    'Medium'
  )
on conflict (rid) do update
set
  missions = excluded.missions,
  "solvedList" = excluded."solvedList",
  "teamId" = excluded."teamId",
  difficulty = excluded.difficulty;

select setval(
  pg_get_serial_sequence('public."teamMission"', 'rid'),
  greatest((select coalesce(max(rid), 1) from public."teamMission"), 1),
  true
);

insert into public.team_mission_solves (
  id,
  team_mission_id,
  team_id,
  leetcode_username,
  title_slug,
  solved_at,
  difficulty
)
values
  ('20000000-0000-0000-0000-000000001001', 1001, 101, 'lee215', 'two-sum', now() - interval '5 days', 'Easy'),
  ('20000000-0000-0000-0000-000000001002', 1001, 101, 'lee215', 'longest-substring-without-repeating-characters', now() - interval '4 days', 'Medium'),
  ('20000000-0000-0000-0000-000000001003', 1001, 101, 'walkccc', 'two-sum', now() - interval '4 days', 'Easy'),
  ('20000000-0000-0000-0000-000000001004', 1002, 102, 'awice', 'number-of-islands', now() - interval '3 days', 'Medium'),
  ('20000000-0000-0000-0000-000000001005', 1002, 102, 'StefanPochmann', 'merge-intervals', now() - interval '2 days', 'Medium')
on conflict (team_mission_id, leetcode_username, title_slug) do update
set
  team_id = excluded.team_id,
  solved_at = excluded.solved_at,
  difficulty = excluded.difficulty;

insert into public.code_records (
  id,
  author_id,
  team_id,
  problem_title,
  title_slug,
  difficulty,
  tags,
  language,
  runtime,
  memory,
  code,
  status,
  review_note,
  created_at,
  updated_at
)
values
  (
    '30000000-0000-0000-0000-000000001001',
    '00000000-0000-0000-0000-000000000101',
    101,
    'Two Sum',
    'two-sum',
    'Easy',
    array['Array', 'Hash Table'],
    'TypeScript',
    '61 ms',
    '44.8 MB',
    'function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();

  for (let i = 0; i < nums.length; i += 1) {
    const complement = target - nums[i];

    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }

    seen.set(nums[i], i);
  }

  return [];
}',
    'Verified',
    'Uses the standard one-pass hash map approach.',
    now() - interval '5 days',
    now() - interval '4 days'
  ),
  (
    '30000000-0000-0000-0000-000000001002',
    '00000000-0000-0000-0000-000000000102',
    101,
    'Longest Substring Without Repeating Characters',
    'longest-substring-without-repeating-characters',
    'Medium',
    array['Hash Table', 'String', 'Sliding Window'],
    'JavaScript',
    '82 ms',
    '51.2 MB',
    'var lengthOfLongestSubstring = function(s) {
  const lastSeen = new Map();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right += 1) {
    const ch = s[right];

    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {
      left = lastSeen.get(ch) + 1;
    }

    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }

  return best;
};',
    'Review Requested',
    'Please check whether the window update can be explained more clearly.',
    now() - interval '4 days',
    now() - interval '3 days'
  ),
  (
    '30000000-0000-0000-0000-000000001003',
    '00000000-0000-0000-0000-000000000103',
    102,
    'Number of Islands',
    'number-of-islands',
    'Medium',
    array['Array', 'Depth-First Search', 'Breadth-First Search', 'Matrix'],
    'Python',
    '214 ms',
    '18.4 MB',
    'class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        rows, cols = len(grid), len(grid[0])
        count = 0

        def sink(r: int, c: int) -> None:
            if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != "1":
                return

            grid[r][c] = "0"
            sink(r + 1, c)
            sink(r - 1, c)
            sink(r, c + 1)
            sink(r, c - 1)

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == "1":
                    count += 1
                    sink(r, c)

        return count',
    'Draft',
    null,
    now() - interval '3 days',
    now() - interval '2 days'
  )
on conflict (id) do update
set
  author_id = excluded.author_id,
  team_id = excluded.team_id,
  problem_title = excluded.problem_title,
  title_slug = excluded.title_slug,
  difficulty = excluded.difficulty,
  tags = excluded.tags,
  language = excluded.language,
  runtime = excluded.runtime,
  memory = excluded.memory,
  code = excluded.code,
  status = excluded.status,
  review_note = excluded.review_note,
  updated_at = excluded.updated_at;

insert into public.record_feedback_comments (
  id,
  record_id,
  author_id,
  content,
  created_at,
  updated_at
)
values
  (
    '40000000-0000-0000-0000-000000001001',
    '30000000-0000-0000-0000-000000001002',
    '00000000-0000-0000-0000-000000000101',
    'The sliding window logic is correct. Add a short note about why left never moves backward.',
    now() - interval '3 days',
    now() - interval '3 days'
  ),
  (
    '40000000-0000-0000-0000-000000001002',
    '30000000-0000-0000-0000-000000001002',
    '00000000-0000-0000-0000-000000000102',
    'Updated the explanation request in the review note. I will add an invariant before marking this verified.',
    now() - interval '2 days',
    now() - interval '2 days'
  ),
  (
    '40000000-0000-0000-0000-000000001003',
    '30000000-0000-0000-0000-000000001003',
    '00000000-0000-0000-0000-000000000104',
    'DFS mutation is simple and readable. Consider mentioning recursion depth before sharing this as a final answer.',
    now() - interval '2 days',
    now() - interval '2 days'
  ),
  (
    '40000000-0000-0000-0000-000000001004',
    '30000000-0000-0000-0000-000000001001',
    '00000000-0000-0000-0000-000000000102',
    'This is ready. The complexity note should be O(n) time and O(n) space.',
    now() - interval '1 day',
    now() - interval '1 day'
  )
on conflict (id) do update
set
  record_id = excluded.record_id,
  author_id = excluded.author_id,
  content = excluded.content,
  updated_at = excluded.updated_at;
