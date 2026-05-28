create table if not exists public.team_mission_solves (
  id uuid not null default gen_random_uuid(),
  team_mission_id bigint not null,
  team_id bigint not null,
  leetcode_username text not null,
  title_slug text not null,
  solved_at timestamptz not null default now(),
  constraint team_mission_solves_pkey primary key (id),
  constraint team_mission_solves_team_mission_id_fkey foreign key (team_mission_id) references public."teamMission" (rid) on delete cascade,
  constraint team_mission_solves_team_id_fkey foreign key (team_id) references public.team (rid) on delete cascade,
  constraint team_mission_solves_unique unique (team_mission_id, leetcode_username, title_slug)
);

alter table public.team_mission_solves
  add column if not exists team_mission_id bigint,
  add column if not exists team_id bigint,
  add column if not exists leetcode_username text,
  add column if not exists title_slug text,
  add column if not exists solved_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'team_mission_solves_team_mission_id_fkey'
      and conrelid = 'public.team_mission_solves'::regclass
  ) then
    alter table public.team_mission_solves
      add constraint team_mission_solves_team_mission_id_fkey
      foreign key (team_mission_id) references public."teamMission" (rid) on delete cascade;
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'team_mission_solves_team_id_fkey'
      and conrelid = 'public.team_mission_solves'::regclass
  ) then
    alter table public.team_mission_solves
      add constraint team_mission_solves_team_id_fkey
      foreign key (team_id) references public.team (rid) on delete cascade;
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'team_mission_solves_unique'
      and conrelid = 'public.team_mission_solves'::regclass
  ) then
    alter table public.team_mission_solves
      add constraint team_mission_solves_unique
      unique (team_mission_id, leetcode_username, title_slug);
  end if;
end;
$$;

create index if not exists team_mission_solves_team_id_idx
on public.team_mission_solves (team_id);

create index if not exists team_mission_solves_title_slug_idx
on public.team_mission_solves (title_slug);

alter table public.team_mission_solves enable row level security;

drop policy if exists "team_mission_solves_select_members" on public.team_mission_solves;
create policy "team_mission_solves_select_members"
on public.team_mission_solves
for select
to authenticated
using (public.is_team_member(team_id, (select auth.uid())));

drop policy if exists "team_mission_solves_insert_members" on public.team_mission_solves;
create policy "team_mission_solves_insert_members"
on public.team_mission_solves
for insert
to authenticated
with check (public.is_team_member(team_id, (select auth.uid())));

drop policy if exists "team_mission_solves_delete_leaders" on public.team_mission_solves;
create policy "team_mission_solves_delete_leaders"
on public.team_mission_solves
for delete
to authenticated
using (public.is_team_leader(team_id, (select auth.uid())));
