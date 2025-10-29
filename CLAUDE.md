# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a user authentication and onboarding web application built with Supabase. The core flow:
1. Users authenticate via Supabase (social login: Google, GitHub, etc.)
2. New users complete a one-time 3-question onboarding questionnaire
3. Returning users bypass the questionnaire and go directly to the landing page

## Architecture

### Authentication Flow
- **Supabase Auth**: Handles all authentication (social providers, sessions)
- **Route Guards**: Protect routes and enforce questionnaire completion
- **Session Management**: Validate user sessions before rendering protected content

### Data Model
Two primary database components:
1. **Users table** (managed by Supabase Auth) - handles authentication
2. **Questionnaire responses** - linked to user_id with fields:
   - `user_id` (foreign key to auth.users)
   - `question_1`, `question_2`, `question_3` (text responses)
   - `submitted_at` (timestamp)
   - Optionally: `questionnaire_completed` boolean flag in user metadata

### User Flow Logic
The application must check on every authenticated session:
- If user has completed questionnaire → redirect to landing page
- If user has NOT completed questionnaire → redirect to onboarding form
- This check should happen at the routing level (e.g., middleware or route guard)

## Development Commands

This project uses Next.js 14 with App Router, Supabase, and TypeScript.

```bash
# Install dependencies
npm install

# Development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## Supabase Setup Requirements

### Environment Variables
Ensure these are configured in `.env.local` (or equivalent):
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Schema
The project uses a `user_profiles` table. See DATABASE_SETUP.md for complete SQL:
```sql
create table user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  onboarding_completed boolean default false not null,
  question_1_answer text,
  question_2_answer text,
  question_3_answer text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);
```

Full setup instructions with RLS policies are in DATABASE_SETUP.md.

### Authentication Providers
Enable social auth providers in Supabase Dashboard:
- Google OAuth (recommended)
- GitHub OAuth (recommended)
- Configure redirect URLs for development and production

## Key Implementation Details

### Route Protection (middleware.ts)
The `middleware.ts` file is the heart of authentication:
- Runs on every request before pages load
- Refreshes Supabase session automatically
- Checks `user_profiles.onboarding_completed` flag
- Redirects based on auth state and current route
- Public route: `/login` only

### Supabase Client Setup (lib/supabase.ts)
Three client functions for different contexts:
- `createClient()` - Client Components (browser)
- `createServerSupabaseClient()` - Server Components & API routes
- `createMiddlewareClient()` - Middleware (returns client + response)

Uses `@supabase/ssr` for proper cookie handling in Next.js 14.

### Key Routes
- `/login` - Social auth buttons (Google, GitHub)
- `/onboarding` - 3-question form (protected, new users only)
- `/` - Landing page (protected, completed onboarding)
- `/auth/callback` - OAuth redirect handler
- `/api/onboarding` - POST endpoint to save questionnaire

### Data Flow
1. User logs in → OAuth flow → `/auth/callback`
2. Middleware checks onboarding → redirects to `/onboarding`
3. User submits form → API upserts `user_profiles`
4. Sets `onboarding_completed = true`
5. Middleware allows access to `/` (landing page)

### Important Files
- `middleware.ts:15-48` - Core auth and redirect logic
- `lib/supabase.ts:10-68` - Supabase client creators
- `app/api/onboarding/route.ts:5-58` - Onboarding submission handler
- `app/components/LogoutButton.tsx` - Client-side logout

### Security
- Row Level Security (RLS) enforced at database level
- Middleware runs server-side (can't be bypassed)
- HTTP-only cookies for sessions
- No sensitive keys in client code
