-- Apply in the dedicated Bula Creation Supabase project before deploying the app.
-- Browser roles have NO table access; app service-role queries enforce ownership.
create table public.bula_accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique check (email = lower(email)),
  name text not null,
  role text not null default 'member' check (role in ('member', 'admin'))
);
create table public.bula_sessions (
  token_hash text primary key,
  user_id uuid not null references public.bula_accounts(id) on delete cascade,
  expires_at timestamptz not null
);
create index on public.bula_sessions(user_id);
create index on public.bula_sessions(expires_at);
create table public.bula_progress (
  user_id uuid primary key references public.bula_accounts(id) on delete cascade,
  data jsonb not null,
  version integer not null default 1,
  updated_at timestamptz not null default now()
);
create table public.bula_audits (
  user_id uuid not null references public.bula_accounts(id) on delete cascade,
  id text not null, data jsonb not null, updated_at timestamptz not null default now(),
  primary key(user_id, id)
);
create table public.bula_snapshots (
  user_id uuid not null references public.bula_accounts(id) on delete cascade,
  id text not null, data jsonb not null, primary key(user_id, id)
);
create table public.bula_entitlements (
  email text primary key check(email = lower(email)),
  plan text not null check(plan in ('free','pro','performance','coach','coach_pro')),
  status text not null check(status in ('active','trialing','cancelled','expired')),
  expires_at timestamptz not null,
  event_time timestamptz not null
);
create table public.bula_billing_events (
  id text primary key, received_at timestamptz not null default now()
);
create table public.bula_usage (
  user_id uuid not null references public.bula_accounts(id) on delete cascade,
  day date not null, count integer not null, primary key(user_id, day)
);

alter table public.bula_accounts enable row level security;
alter table public.bula_sessions enable row level security;
alter table public.bula_progress enable row level security;
alter table public.bula_audits enable row level security;
alter table public.bula_snapshots enable row level security;
alter table public.bula_entitlements enable row level security;
alter table public.bula_billing_events enable row level security;
alter table public.bula_usage enable row level security;
revoke all on public.bula_accounts, public.bula_sessions, public.bula_progress, public.bula_audits,
 public.bula_snapshots, public.bula_entitlements, public.bula_billing_events, public.bula_usage from anon, authenticated;
grant all on public.bula_accounts, public.bula_sessions, public.bula_progress, public.bula_audits,
 public.bula_snapshots, public.bula_entitlements, public.bula_billing_events, public.bula_usage to service_role;

-- Compare-and-swap: stale devices cannot silently overwrite newer progress.
create function public.bula_save_progress(p_user uuid, p_version integer, p_data jsonb)
returns integer language plpgsql security invoker set search_path = '' as $$
declare next_version integer;
begin
  if p_version = 0 then
    insert into public.bula_progress(user_id, data) values(p_user, p_data)
      on conflict do nothing returning version into next_version;
  else
    update public.bula_progress set data = p_data, version = version + 1, updated_at = now()
      where user_id = p_user and version = p_version returning version into next_version;
  end if;
  return next_version;
end $$;

create function public.bula_consume_usage(p_user uuid, p_limit integer)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare consumed integer;
begin
  if p_limit <= 0 then return false; end if;
  insert into public.bula_usage(user_id, day, count) values(p_user, (now() at time zone 'UTC')::date, 1)
    on conflict(user_id, day) do update set count = public.bula_usage.count + 1
      where public.bula_usage.count < p_limit returning count into consumed;
  return consumed is not null;
end $$;

-- One transaction covers replay detection and the entitlement change.
create function public.bula_apply_billing(p_id text, p_email text, p_plan text, p_status text, p_expires timestamptz, p_time timestamptz)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare inserted text;
begin
  insert into public.bula_billing_events(id) values(p_id) on conflict do nothing returning id into inserted;
  if inserted is null then return false; end if;
  insert into public.bula_entitlements(email, plan, status, expires_at, event_time)
    values(p_email, p_plan, p_status, p_expires, p_time)
    on conflict(email) do update set plan = excluded.plan, status = excluded.status,
      expires_at = excluded.expires_at, event_time = excluded.event_time
      where excluded.event_time > public.bula_entitlements.event_time;
  return true;
end $$;
revoke all on function public.bula_save_progress(uuid, integer, jsonb) from public, anon, authenticated;
revoke all on function public.bula_consume_usage(uuid, integer) from public, anon, authenticated;
revoke all on function public.bula_apply_billing(text, text, text, text, timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.bula_save_progress(uuid, integer, jsonb) to service_role;
grant execute on function public.bula_consume_usage(uuid, integer) to service_role;
grant execute on function public.bula_apply_billing(text, text, text, text, timestamptz, timestamptz) to service_role;
