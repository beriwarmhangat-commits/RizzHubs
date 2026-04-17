-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  avatar_url text,
  full_name text,
  created_at timestamptz default now()
);

-- Create codes table (the pastes)
create table public.pastes (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete cascade,
  title text not null default 'Untitled',
  content text not null,
  language text not null default 'plaintext',
  is_public boolean default true,
  slug text unique,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.pastes enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Policies for Pastes
create policy "Public pastes are viewable by everyone"
  on public.pastes for select
  using ( is_public = true or auth.uid() = author_id );

create policy "Authenticated users can create pastes"
  on public.pastes for insert
  with check ( auth.role() = 'authenticated' );

create policy "Authors can update their own pastes"
  on public.pastes for update
  using ( auth.uid() = author_id );

create policy "Authors can delete their own pastes"
  on public.pastes for delete
  using ( auth.uid() = author_id );

-- Handle new user profile creation
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (new.id, split_part(new.email, '@', 1), new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
