create table if not exists public.team_members (
  team_id bigint not null,
  user_id uuid not null,
  role text not null default 'Member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint team_members_pkey primary key (team_id, user_id),
  constraint team_members_team_id_fkey foreign key (team_id) references public.team (rid) on delete cascade,
  constraint team_members_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint team_members_role_check check (role in ('Leader', 'Member'))
);

alter table public.team_members
  add column if not exists role text not null default 'Member',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'team_members_team_id_fkey'
      and conrelid = 'public.team_members'::regclass
  ) then
    alter table public.team_members
      add constraint team_members_team_id_fkey
      foreign key (team_id) references public.team (rid) on delete cascade;
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'team_members_user_id_fkey'
      and conrelid = 'public.team_members'::regclass
  ) then
    alter table public.team_members
      add constraint team_members_user_id_fkey
      foreign key (user_id) references auth.users (id) on delete cascade;
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'team_members_role_check'
      and conrelid = 'public.team_members'::regclass
  ) then
    alter table public.team_members
      add constraint team_members_role_check
      check (role in ('Leader', 'Member'));
  end if;
end;
$$;

create index if not exists team_members_user_id_idx
on public.team_members (user_id);

drop trigger if exists team_members_set_updated_at on public.team_members;

create trigger team_members_set_updated_at
before update on public.team_members
for each row
execute function public.set_updated_at();

alter table public.team_members enable row level security;

drop policy if exists "team_members_select_self_or_leader" on public.team_members;
create policy "team_members_select_self_or_leader"
on public.team_members
for select
to authenticated
using (
  user_id = (select auth.uid())
  or public.is_team_leader(team_id, (select auth.uid()))
);

drop policy if exists "team_members_insert_leaders" on public.team_members;
create policy "team_members_insert_leaders"
on public.team_members
for insert
to authenticated
with check (public.is_team_leader(team_id, (select auth.uid())));

drop policy if exists "team_members_update_leaders" on public.team_members;
create policy "team_members_update_leaders"
on public.team_members
for update
to authenticated
using (public.is_team_leader(team_id, (select auth.uid())))
with check (public.is_team_leader(team_id, (select auth.uid())));

drop policy if exists "team_members_delete_leaders" on public.team_members;
create policy "team_members_delete_leaders"
on public.team_members
for delete
to authenticated
using (public.is_team_leader(team_id, (select auth.uid())));
