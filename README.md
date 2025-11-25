# EigoKit Platform Admin App

Web application for platform administrators to manage schools, payments, and feature flags.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_PROJECT_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_key_here  # "Publishable key" in Project Settings > API keys
```

## Running Locally

```bash
npm run dev
```

## Building

```bash
npm run build
```

## Features

- School Management (view, activate, suspend)
- Payment Management & Adjustments
- Feature Flag Control
- Platform Dashboard

## Deployment

Deploy to Vercel, Netlify, Render, or any static hosting service.
