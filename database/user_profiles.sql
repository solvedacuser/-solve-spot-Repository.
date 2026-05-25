create table if not exists public.user_profiles(
  id uuid not null,
  nickname text not null,
  username text not null, 
  email text not null,
  num_solved_daily_last_7days integer[] default array[0, 0, 0, 0, 0, 0, 0],
  num_solved_easy integer default 0,
  num_solved_medium integer default 0,
  num_solved_hard integer default 0,
  num_solved_monthly integer[] default array[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  annual_activity jsonb not null default '[]'::jsonb,
  date_signup timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint user_profiles_pkey primary key (id),
  constraint user_profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade
);