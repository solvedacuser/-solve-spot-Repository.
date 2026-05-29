create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type as typ
    join pg_namespace as nsp
      on nsp.oid = typ.typnamespace
    where nsp.nspname = 'public'
      and typ.typname = 'leetcode_difficulty'
  ) then
    create type public.leetcode_difficulty as enum ('Easy', 'Medium', 'Hard');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type as typ
    join pg_namespace as nsp
      on nsp.oid = typ.typnamespace
    where nsp.nspname = 'public'
      and typ.typname = 'code_record_status'
  ) then
    create type public.code_record_status as enum ('Verified', 'Review Requested', 'Draft');
  end if;
end;
$$;

create or replace function public.is_team_member(target_team_id bigint, target_user_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.team_members
    where team_members.team_id = target_team_id
      and team_members.user_id = target_user_id
  );
end;
$$;

create or replace function public.is_team_leader(target_team_id bigint, target_user_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.team_members
    where team_members.team_id = target_team_id
      and team_members.user_id = target_user_id
      and team_members.role = 'Leader'
  );
end;
$$;

revoke all on function public.is_team_member(bigint, uuid) from public;
revoke all on function public.is_team_leader(bigint, uuid) from public;

grant execute on function public.is_team_member(bigint, uuid) to authenticated;
grant execute on function public.is_team_leader(bigint, uuid) to authenticated;
