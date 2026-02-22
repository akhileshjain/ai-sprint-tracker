# AI Sprint Tracker 🚀

A personal sprint tracker for the 6-Month AI Engineering Upskilling Plan. Built with React + Vite. Progress saves automatically to `localStorage`.

## Features

- 6 sprints across 6 months, 48 tasks with story points
- Sprint View (week-by-week), Board View (Kanban), Overview (progress dashboard)
- Per-task status (To Do / In Progress / Done), notes, and course links
- Progress auto-saves to localStorage — no backend needed

## Local Setup

```bash
# 1. Clone your repo
git clone https://github.com/YOUR_USERNAME/ai-sprint-tracker.git
cd ai-sprint-tracker

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev
# → Opens at http://localhost:5173
```

## Deploy to Netlify (free)

### Option A — Netlify UI (easiest)
1. Push this repo to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → "Add new site" → "Import an existing project"
3. Connect your GitHub account and select this repo
4. Build settings are auto-detected from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site** — live in ~60 seconds

### Option B — Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial AI sprint tracker"
git remote add origin https://github.com/YOUR_USERNAME/ai-sprint-tracker.git
git branch -M main
git push -u origin main
```

## Tech Stack

- React 18
- Vite 5
- localStorage for persistence (no backend)
- Google Fonts: DM Mono + Syne
