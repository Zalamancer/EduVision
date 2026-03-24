-- EduVision initial schema

-- Profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Circuits
create table if not exists public.circuits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Untitled Circuit',
  circuit_json text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.circuits enable row level security;

create policy "Users can CRUD own circuits"
  on public.circuits for all
  using (auth.uid() = user_id);

-- Episodes
create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  chapter int not null default 1,
  episode int not null,
  title text not null,
  description text not null default '',
  duration_seconds int not null default 0,
  video_url text,
  thumbnail_url text,
  created_at timestamptz default now(),
  unique(chapter, episode)
);

alter table public.episodes enable row level security;

create policy "Anyone can read episodes"
  on public.episodes for select
  using (true);

-- Watch progress
create table if not exists public.watch_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  episode_id uuid not null references public.episodes(id) on delete cascade,
  watched_seconds int not null default 0,
  completed boolean not null default false,
  updated_at timestamptz default now(),
  unique(user_id, episode_id)
);

alter table public.watch_progress enable row level security;

create policy "Users can CRUD own progress"
  on public.watch_progress for all
  using (auth.uid() = user_id);

-- Challenges
create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  difficulty text not null default 'beginner',
  instructions_md text not null,
  starter_circuit text,
  solution_circuit text not null,
  created_at timestamptz default now()
);

alter table public.challenges enable row level security;

create policy "Anyone can read challenges"
  on public.challenges for select
  using (true);
