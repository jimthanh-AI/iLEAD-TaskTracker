# iLEAD PM — Project Manager for Catalyste+ Vietnam

A modern web application for managing iLEAD program assignments, activities, and tasks across Vietnamese partners.

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript & Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Hosting**: Vercel (frontend) + Supabase Cloud (backend)
- **Auth**: Supabase Magic Link (email-based login)

## Quick Start

### 1. Copy Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials.

### 2. Create Database (Supabase SQL Editor)

See README section "Database Schema SQL" below for full schema.

### 3. Run Locally
```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### 4. Deploy to Vercel

```bash
git init && git add . && git commit -m "initial"
git remote add origin https://github.com/YOUR_REPO
git push -u origin main
```

In Vercel: Add project → select repo → add env vars → deploy

## Database Schema (Supabase SQL)

```sql
create table partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text default '#2563eb',
  sector text, region text, notes text,
  created_at timestamptz default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references partners(id) on delete cascade,
  name text not null, status text default 'not_started',
  sub_code text, start_date date, end_date date, description text,
  pos integer default 0, created_at timestamptz default now()
);

create table activities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  name text not null, status text default 'not_started',
  stage text default 'S1', ball_owner text, ca text, type text,
  sub_code text, next_action text, start_date date, end_date date, notes text,
  pos integer default 0, created_at timestamptz default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid references activities(id) on delete cascade,
  name text not null, status text default 'todo',
  assignee text, due_date date, notes text,
  pos integer default 0, created_at timestamptz default now()
);
```

## Features

✅ Magic link login (email-based, no password)
✅ Dashboard with stats
✅ Partner/Project/Activity/Task management
✅ iLEAD Logic Model stages (S1-S7)
✅ Responsive design
✅ Real-time Supabase sync

## Structure

```
src/
├── app/dashboard/         # Protected pages
│   ├── page.tsx          # Dashboard home
│   ├── partners/
│   ├── projects/
│   ├── activities/
│   └── tasks/
├── app/login/            # Login page
├── app/auth/callback/    # Magic link callback
├── components/           # Auth provider, Sidebar
└── lib/supabase.ts       # Client & types
```

## Next Steps (Phase 4 onwards)

- [ ] Full CRUD for all entities
- [ ] Kanban board view
- [ ] Search & filtering
- [ ] Data export (CSV)
- [ ] Mobile PWA
- [ ] Multi-role auth
- [ ] Audit logs
- [ ] Google Calendar sync
