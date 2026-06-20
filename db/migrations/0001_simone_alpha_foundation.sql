create extension if not exists pgcrypto;

create table if not exists early_access_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null default '',
  use_case text not null default '',
  source text not null default 'simone-landing',
  notification_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists ventures (
  id uuid primary key default gen_random_uuid(),
  owner_email text not null,
  name text not null,
  idea text not null default '',
  audience text not null default '',
  intent text not null default '',
  engines jsonb not null,
  drivers jsonb not null,
  assumptions jsonb not null,
  decision_gates jsonb not null,
  experiments jsonb not null,
  coherence_review text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists agent_runs (
  id uuid primary key default gen_random_uuid(),
  venture_id uuid not null references ventures(id),
  engine_or_driver text not null,
  task text not null,
  status text not null default 'draft',
  model_provider text not null default 'openrouter',
  retrieval_source text not null default 'dify',
  human_approval text not null default 'required',
  trace jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists early_access_leads_email_idx on early_access_leads (email);
create index if not exists ventures_owner_email_idx on ventures (owner_email);
create index if not exists agent_runs_venture_id_idx on agent_runs (venture_id);
