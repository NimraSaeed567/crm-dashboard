# CRM Dashboard

A CRM dashboard built with React 19, Vite, Tailwind CSS, and a Supabase backend.

## Features

- **Dashboard** — KPI cards, revenue chart, pipeline chart, lead-source breakdown, recent customers/invoices, and an activity feed
- **Customers** — searchable/paginated customer table with create/edit modals and soft-delete
- **Tasks** — task manager with create/edit modals
- **Invoices** — invoice manager with create/edit modals
- **Ask AI** — natural-language querying over dashboard data, backed by a Vercel serverless function (`api/ask.js`) that calls OpenRouter
- Light/dark theme support and toast notifications throughout

## Tech Stack

- **Frontend:** React 19, React Router, Vite, Tailwind CSS 4
- **Backend:** Supabase (Postgres + auth), schema in `supabase/schema.sql`
- **Charts:** Recharts
- **AI:** OpenRouter, called from a Vercel serverless function so the API key never reaches the client
- **Deployment:** Vercel (`vercel.json`)

## Setup

```bash
npm install
cp .env.example .env   # fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, OPENROUTER_API_KEY
npm run dev
```

Set up the database by running `supabase/schema.sql` against your Supabase project.

## Scripts

```bash
npm run dev       # start the dev server
npm run build     # production build
npm run preview   # preview the production build locally
npm run lint      # lint with oxlint
```
