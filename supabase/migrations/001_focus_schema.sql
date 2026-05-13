-- supabase/migrations/001_focus_schema.sql

-- Focus Sessions Table
create table focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  
  -- Session metadata
  session_type text check (session_type in ('focus', 'break', 'long_break')),
  duration_seconds int not null,
  completed boolean default false,
  interrupted_count int default 0,
  
  -- Gamification & Mood Tracking
  points_earned int default 0,
  streak_preserved boolean default false,
  pre_session_mood text, -- emoji
  post_session_mood text, -- emoji
  
  -- Timestamps
  started_at timestamp not null,
  ended_at timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  
  -- Soft delete
  deleted_at timestamp
);

-- App Limits Table
create table app_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  
  app_name text not null,
  app_bundle_id text not null,
  daily_limit_seconds int not null,
  
  is_blocked_during_focus boolean default false,
  
  created_at timestamp default now(),
  updated_at timestamp default now(),
  deleted_at timestamp,
  
  unique(user_id, app_bundle_id)
);

-- Daily Usage Stats Table
create table daily_usage_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  
  date date not null,
  
  -- Focus time
  total_focus_seconds int default 0,
  sessions_completed int default 0,
  sessions_interrupted int default 0,
  
  -- Gamification
  points_earned int default 0,
  daily_goal_met boolean default false,
  streak_count int default 0,
  donated_hours numeric default 0.0, -- Social Impact
  
  -- App usage (top distractions)
  total_app_seconds int default 0,
  
  created_at timestamp default now(),
  updated_at timestamp default now(),
  
  unique(user_id, date)
);

-- User Streaks Table
create table streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  
  current_streak int default 0,
  longest_streak int default 0,
  last_completed_date date,
  
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- User Rewards/Achievements Table
create table achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  
  achievement_key text not null,  -- 'perfect_week', '5_day_streak', etc
  achievement_name text not null,
  achievement_description text,
  icon_emoji text,
  
  unlocked_at timestamp default now(),
  
  unique(user_id, achievement_key)
);

-- App Usage Events Table (for interruptions tracking)
create table app_usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  
  app_bundle_id text not null,
  app_name text not null,
  
  duration_seconds int not null,
  session_id uuid references focus_sessions(id),
  
  timestamp timestamp default now(),
  created_at timestamp default now(),
  
  deleted_at timestamp
);

-- Co-Study Rooms (India-specific Social feature)
create table co_study_rooms (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  room_name text not null,
  is_active boolean default true,
  created_at timestamp default now()
);

-- RLS Policies
alter table focus_sessions enable row level security;
alter table app_limits enable row level security;
alter table daily_usage_stats enable row level security;
alter table streaks enable row level security;
alter table achievements enable row level security;
alter table app_usage_events enable row level security;
alter table co_study_rooms enable row level security;

-- Users can only see their own data
create policy "Users can see own focus_sessions" on focus_sessions
  for select using (auth.uid() = user_id);

create policy "Users can see own app_limits" on app_limits
  for select using (auth.uid() = user_id);

create policy "Users can see own stats" on daily_usage_stats
  for select using (auth.uid() = user_id);
