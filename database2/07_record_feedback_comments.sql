create table if not exists public.record_feedback_comments (
  id uuid not null default gen_random_uuid(),
  record_id uuid not null,
  author_id uuid not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint record_feedback_comments_pkey primary key (id),
  constraint record_feedback_comments_record_id_fkey foreign key (record_id) references public.code_records (id) on delete cascade,
  constraint record_feedback_comments_author_id_fkey foreign key (author_id) references auth.users (id) on delete cascade
);

alter table public.record_feedback_comments
  add column if not exists record_id uuid,
  add column if not exists author_id uuid,
  add column if not exists content text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'record_feedback_comments_record_id_fkey'
      and conrelid = 'public.record_feedback_comments'::regclass
  ) then
    alter table public.record_feedback_comments
      add constraint record_feedback_comments_record_id_fkey
      foreign key (record_id) references public.code_records (id) on delete cascade;
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'record_feedback_comments_author_id_fkey'
      and conrelid = 'public.record_feedback_comments'::regclass
  ) then
    alter table public.record_feedback_comments
      add constraint record_feedback_comments_author_id_fkey
      foreign key (author_id) references auth.users (id) on delete cascade;
  end if;
end;
$$;

create index if not exists record_feedback_comments_record_id_created_at_idx
on public.record_feedback_comments (record_id, created_at);

create index if not exists record_feedback_comments_author_id_idx
on public.record_feedback_comments (author_id);

drop trigger if exists record_feedback_comments_set_updated_at on public.record_feedback_comments;

create trigger record_feedback_comments_set_updated_at
before update on public.record_feedback_comments
for each row
execute function public.set_updated_at();

alter table public.record_feedback_comments enable row level security;

drop policy if exists "record_feedback_comments_select_record_access" on public.record_feedback_comments;
create policy "record_feedback_comments_select_record_access"
on public.record_feedback_comments
for select
to authenticated
using (
  exists (
    select 1
    from public.code_records
    where code_records.id = record_feedback_comments.record_id
  )
);

drop policy if exists "record_feedback_comments_insert_record_access" on public.record_feedback_comments;
create policy "record_feedback_comments_insert_record_access"
on public.record_feedback_comments
for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and exists (
    select 1
    from public.code_records
    where code_records.id = record_feedback_comments.record_id
  )
);

drop policy if exists "record_feedback_comments_update_author" on public.record_feedback_comments;
create policy "record_feedback_comments_update_author"
on public.record_feedback_comments
for update
to authenticated
using (author_id = (select auth.uid()))
with check (author_id = (select auth.uid()));

drop policy if exists "record_feedback_comments_delete_author" on public.record_feedback_comments;
create policy "record_feedback_comments_delete_author"
on public.record_feedback_comments
for delete
to authenticated
using (author_id = (select auth.uid()));
