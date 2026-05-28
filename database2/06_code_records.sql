create table if not exists public.code_records (
  id uuid not null default gen_random_uuid(),
  author_id uuid not null,
  team_id bigint,
  problem_title text not null,
  title_slug text not null,
  difficulty public.leetcode_difficulty not null,
  tags text[] not null default '{}',
  language text not null,
  runtime text,
  memory text,
  code text not null,
  status public.code_record_status not null default 'Draft',
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint code_records_pkey primary key (id),
  constraint code_records_author_id_fkey foreign key (author_id) references auth.users (id) on delete cascade,
  constraint code_records_team_id_fkey foreign key (team_id) references public.team (rid) on delete set null
);

alter table public.code_records
  add column if not exists author_id uuid,
  add column if not exists team_id bigint,
  add column if not exists problem_title text,
  add column if not exists title_slug text,
  add column if not exists difficulty public.leetcode_difficulty,
  add column if not exists tags text[] not null default '{}',
  add column if not exists language text,
  add column if not exists runtime text,
  add column if not exists memory text,
  add column if not exists code text,
  add column if not exists status public.code_record_status not null default 'Draft',
  add column if not exists review_note text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'code_records_author_id_fkey'
      and conrelid = 'public.code_records'::regclass
  ) then
    alter table public.code_records
      add constraint code_records_author_id_fkey
      foreign key (author_id) references auth.users (id) on delete cascade;
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'code_records_team_id_fkey'
      and conrelid = 'public.code_records'::regclass
  ) then
    alter table public.code_records
      add constraint code_records_team_id_fkey
      foreign key (team_id) references public.team (rid) on delete set null;
  end if;
end;
$$;

create index if not exists code_records_author_id_created_at_idx
on public.code_records (author_id, created_at desc);

create index if not exists code_records_team_id_created_at_idx
on public.code_records (team_id, created_at desc);

create index if not exists code_records_title_slug_idx
on public.code_records (title_slug);

drop trigger if exists code_records_set_updated_at on public.code_records;

create trigger code_records_set_updated_at
before update on public.code_records
for each row
execute function public.set_updated_at();

alter table public.code_records enable row level security;

drop policy if exists "code_records_select_author_or_team" on public.code_records;
create policy "code_records_select_author_or_team"
on public.code_records
for select
to authenticated
using (
  author_id = (select auth.uid())
  or (
    team_id is not null
    and public.is_team_member(team_id, (select auth.uid()))
  )
);

drop policy if exists "code_records_insert_author" on public.code_records;
create policy "code_records_insert_author"
on public.code_records
for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and (
    team_id is null
    or public.is_team_member(team_id, (select auth.uid()))
  )
);

drop policy if exists "code_records_update_author" on public.code_records;
create policy "code_records_update_author"
on public.code_records
for update
to authenticated
using (author_id = (select auth.uid()))
with check (
  author_id = (select auth.uid())
  and (
    team_id is null
    or public.is_team_member(team_id, (select auth.uid()))
  )
);

drop policy if exists "code_records_delete_author" on public.code_records;
create policy "code_records_delete_author"
on public.code_records
for delete
to authenticated
using (author_id = (select auth.uid()));
