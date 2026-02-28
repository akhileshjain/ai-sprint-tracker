# AI Sprint Tracker

A team-wide progress tracker for a 6-month AI Engineering upskilling plan. Each employee tracks their own sprint tasks; admins see the whole team's progress in real time.

Built with **React + Vite**, **Supabase** (auth + database), and deployed on **Netlify** — all free tier.

---

## Features

| Role | Capabilities |
|------|-------------|
| **Employee** | Magic-link sign-in, per-sprint task board, status cycling (To Do → In Progress → Done), inline notes, progress rings |
| **Admin** | Team overview dashboard, per-employee drill-down, risk indicators, invite employees by email, export to CSV |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5 |
| Auth | Supabase Auth (magic link / email OTP) |
| Database | Supabase (PostgreSQL) with Row Level Security |
| Hosting | Netlify (static deploy) |

---

## Project Structure

```
ai-tracker-v2/
├── database.sql          # Full Supabase schema — run once to set up
├── .env.example          # Environment variable template
├── netlify.toml          # Netlify build + SPA redirect config
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx            # Auth routing (Login / Tracker / AdminDashboard)
    ├── supabaseClient.js  # Supabase singleton client
    ├── data.js            # Sprint & task definitions (all content lives here)
    └── pages/
        ├── Login.jsx           # Email magic-link sign-in page
        ├── Tracker.jsx         # Employee sprint board
        └── AdminDashboard.jsx  # Admin team overview
```

---

## Database Schema

### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | References `auth.users(id)` |
| `email` | `text` | |
| `full_name` | `text` | |
| `is_admin` | `boolean` | Default `false` |
| `created_at` | `timestamptz` | |

### `task_progress`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | References `profiles(id)` |
| `task_id` | `text` | e.g. `s1-3` |
| `status` | `text` | `todo` \| `inprog` \| `done` |
| `note` | `text` | Optional free-text note |
| `updated_at` | `timestamptz` | |

### Row Level Security
- Users can only read/write their own `profiles` and `task_progress` rows.
- Admins can read all rows via a `security definer` helper function (`is_admin()`) that avoids recursive policy evaluation.
- A `handle_new_user` trigger auto-creates a `profiles` row whenever a new user signs up.

---

## Local Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project** — name it `ai-sprint-tracker`.
3. Wait ~2 minutes for provisioning.

### 2. Run the database schema

1. In your Supabase project → **SQL Editor** → **New query**.
2. Paste the entire contents of `database.sql`.
3. Click **Run**. You should see "Success. No rows returned."

### 3. Get your API keys

In Supabase → **Project Settings → API**, copy:
- **Project URL** (`https://xxxx.supabase.co`)
- **anon / public key** (starts with `eyJ...`)

### 4. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ALLOWED_EMAIL_DOMAIN=@yourcompany.com
```

> `VITE_ALLOWED_EMAIL_DOMAIN` restricts sign-ups to a single email domain. Leave it blank to allow any email.

### 5. Run locally

```bash
npm install
npm run dev
# App available at http://localhost:5173
```

### 6. Make yourself an admin

1. Sign in via magic link with your own email.
2. In Supabase → **SQL Editor**, run:

```sql
update public.profiles set is_admin = true where email = 'your@email.com';
```

3. Sign out and back in — you will be routed to the Admin Dashboard.

---

## Deploying to Netlify

### Option A — Netlify UI (recommended)

1. Push this repo to GitHub:

```bash
git init
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ai-sprint-tracker.git
git branch -M main
git push -u origin main
```

2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import from GitHub**.
3. Select your repo. Build settings are auto-detected from `netlify.toml`.
4. Before deploying, add environment variables under **Site settings → Environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ALLOWED_EMAIL_DOMAIN`
5. Click **Deploy site**.

### Option B — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "eyJ..."
netlify env:set VITE_ALLOWED_EMAIL_DOMAIN "@yourcompany.com"
netlify deploy --prod
```

### Update Supabase redirect URLs

After deploying, go to Supabase → **Authentication → URL Configuration** and add your Netlify URL to **Redirect URLs**:
```
https://your-app.netlify.app
https://your-app.netlify.app/**
```

---

## Inviting Employees

1. Log in as admin.
2. Use the **Invite Employee** panel and enter their name and work email.
3. They receive a magic-link email to set up their account.
4. Their progress appears automatically in the admin dashboard.

---

## Files to Exclude from Git

The following are already covered by `.gitignore`:

| File / Folder | Reason |
|--------------|--------|
| `.env` | Contains your real Supabase URL and anon key |
| `node_modules/` | Dependencies — restored via `npm install` |
| `dist/` | Build output — generated by Netlify on deploy |
| `.DS_Store` | macOS metadata |

> **Important:** Never commit `.env`. The `.env.example` file (which contains only placeholder values) is safe to commit and serves as documentation for other developers.

---

## Cost

| Service | Plan | Cost |
|---------|------|------|
| Supabase | Free — 50,000 active users, 500 MB DB | $0/mo |
| Netlify | Free — 100 GB bandwidth, 300 build minutes | $0/mo |
| **Total** | | **$0/mo** |
