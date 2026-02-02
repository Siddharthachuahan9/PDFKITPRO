-- PDFKit Pro Database Schema for Supabase
-- This schema supports the @auth/supabase-adapter

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- AUTH.JS / NEXTAUTH TABLES
-- These tables are required by the Supabase adapter
-- ============================================

-- Users table (extends NextAuth defaults)
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text unique,
  email_verified timestamp with time zone,
  image text,
  -- Custom fields for PDFKit Pro
  plan text default 'free' check (plan in ('free', 'pro', 'business')),
  stripe_customer_id text unique,
  dodo_customer_id text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Accounts table (OAuth providers)
create table if not exists public.accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null,
  provider text not null,
  provider_account_id text not null,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  unique (provider, provider_account_id)
);

-- Sessions table
create table if not exists public.sessions (
  id uuid primary key default uuid_generate_v4(),
  session_token text unique not null,
  user_id uuid not null references public.users(id) on delete cascade,
  expires timestamp with time zone not null
);

-- Verification tokens (for email verification)
create table if not exists public.verification_tokens (
  identifier text not null,
  token text unique not null,
  expires timestamp with time zone not null,
  primary key (identifier, token)
);

-- ============================================
-- PDFKIT PRO CUSTOM TABLES
-- ============================================

-- Subscriptions table (for Dodo Payments)
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  dodo_subscription_id text unique,
  plan text not null check (plan in ('free', 'pro', 'business')),
  status text not null check (status in ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Usage tracking table
create table if not exists public.usage (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null default current_date,
  files_processed integer default 0,
  operations_count integer default 0,
  storage_used_mb numeric(10, 2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique (user_id, date)
);

-- Cloud files table (for encrypted cloud storage feature)
create table if not exists public.cloud_files (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  encrypted_key text not null, -- AES key encrypted with user's master key
  storage_path text not null,
  size_bytes bigint not null,
  mime_type text default 'application/pdf',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  expires_at timestamp with time zone
);

-- ============================================
-- INDEXES
-- ============================================

create index if not exists idx_accounts_user_id on public.accounts(user_id);
create index if not exists idx_sessions_user_id on public.sessions(user_id);
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_usage_user_date on public.usage(user_id, date);
create index if not exists idx_cloud_files_user_id on public.cloud_files(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

alter table public.users enable row level security;
alter table public.accounts enable row level security;
alter table public.sessions enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage enable row level security;
alter table public.cloud_files enable row level security;

-- Users can only read their own data
create policy "Users can read own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own data" on public.users
  for update using (auth.uid() = id);

-- Accounts policies
create policy "Users can read own accounts" on public.accounts
  for select using (auth.uid() = user_id);

-- Sessions policies
create policy "Users can read own sessions" on public.sessions
  for select using (auth.uid() = user_id);

-- Subscriptions policies
create policy "Users can read own subscriptions" on public.subscriptions
  for select using (auth.uid() = user_id);

-- Usage policies
create policy "Users can read own usage" on public.usage
  for select using (auth.uid() = user_id);

create policy "Users can insert own usage" on public.usage
  for insert with check (auth.uid() = user_id);

create policy "Users can update own usage" on public.usage
  for update using (auth.uid() = user_id);

-- Cloud files policies
create policy "Users can read own files" on public.cloud_files
  for select using (auth.uid() = user_id);

create policy "Users can insert own files" on public.cloud_files
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own files" on public.cloud_files
  for delete using (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger set_users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.handle_updated_at();

-- Function to increment usage
create or replace function public.increment_usage(
  p_user_id uuid,
  p_files integer default 1,
  p_operations integer default 1
)
returns void as $$
begin
  insert into public.usage (user_id, date, files_processed, operations_count)
  values (p_user_id, current_date, p_files, p_operations)
  on conflict (user_id, date)
  do update set
    files_processed = public.usage.files_processed + p_files,
    operations_count = public.usage.operations_count + p_operations;
end;
$$ language plpgsql security definer;
