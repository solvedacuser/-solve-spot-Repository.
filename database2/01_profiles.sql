create table if not exists public.profiles (
  id uuid not null,
  display_name text,
  leetcode_username text,
  boj_handle text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  signup_at timestamptz,
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade
);

alter table public.profiles
  add column if not exists display_name text,
  add column if not exists leetcode_username text,
  add column if not exists boj_handle text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_id_fkey'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_id_fkey
      foreign key (id) references auth.users (id) on delete cascade;
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_boj_handle_key'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_boj_handle_key unique (boj_handle);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_leetcode_username_key'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_leetcode_username_key unique (leetcode_username);
  end if;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    display_name,
    leetcode_username,
    boj_handle
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'name'
    ),
    nullif(trim(new.raw_user_meta_data ->> 'leetcode_username'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'boj_handle'), '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into public.profiles (
  id,
  display_name,
  leetcode_username,
  boj_handle
)
select
  users.id,
  coalesce(
    users.raw_user_meta_data ->> 'display_name',
    users.raw_user_meta_data ->> 'name'
  ),
  nullif(trim(users.raw_user_meta_data ->> 'leetcode_username'), ''),
  nullif(trim(users.raw_user_meta_data ->> 'boj_handle'), '')
from auth.users as users
left join public.profiles as profiles
  on profiles.id = users.id
where profiles.id is null;

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);


create or replace function public.set_signup_at()
returns trigger as $$
begin
  if (old.last_sign_in_at is null and new.last_sign_in_at is not null) then
    insert into public.profiles (id, signup_at)
    values (new.id, new.last_sign_in_at)
    on conflict (id) 
    do update set signup_at = excluded.signup_at;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_first_signup_verification
  after update of last_sign_in_at on auth.users
  for each row
  execute function public.set_signup_at();

create or replace function public.handle_delete_user()
returns trigger as $$
begin
  if exists(select 1 from auth.users where id = old.id)
  then delete from auth.users where id = old.id;
  end if;
  return old;
end;
$$ language plpgsql security definer;

create trigger on_profile_deleted
  after delete on public.profiles
  for each row execute procedure public.handle_delete_user();

alter table public.profiles enable row level security;

create policy "profiles_delete_own"
on public.profiles
for delete 
to authenticated 
using ( (select auth.uid()) = id );