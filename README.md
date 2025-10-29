# Auth Onboarding App

A modern web application built with Next.js 14 and Supabase that implements user authentication with social login and a one-time onboarding questionnaire.

## Features

- **Social Authentication**: Login with Google or GitHub via Supabase Auth
- **One-Time Onboarding**: New users complete a 3-question questionnaire
- **Smart Routing**: Automatic redirects based on authentication and onboarding status
- **Session Management**: Secure session handling with HTTP-only cookies
- **Row Level Security**: Database-level security ensuring users can only access their own data
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (Supabase)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Project Structure

```
├── app/
│   ├── api/onboarding/       # API endpoint for saving questionnaire
│   ├── auth/callback/        # OAuth callback handler
│   ├── components/           # Reusable components
│   ├── login/               # Login page with social auth
│   ├── onboarding/          # Onboarding questionnaire
│   ├── layout.tsx           # Root layout with header/logout
│   ├── page.tsx             # Landing page (protected)
│   └── globals.css          # Global styles
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── middleware.ts            # Auth protection and routing logic
├── .env.local              # Environment variables
└── DATABASE_SETUP.md       # Database setup instructions
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon key
4. Update `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set Up Database

Follow the detailed instructions in [DATABASE_SETUP.md](./DATABASE_SETUP.md) to:
- Create the `user_profiles` table
- Set up Row Level Security policies
- Enable Google and GitHub OAuth providers

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## User Flow

```
┌─────────────┐
│   Visit /   │
└──────┬──────┘
       │
       ▼
┌──────────────────┐      ┌────────────┐
│ Authenticated?   │─No──▶│  /login    │
└──────┬───────────┘      └────────────┘
       │ Yes
       ▼
┌──────────────────┐      ┌────────────┐
│ Onboarding done? │─No──▶│/onboarding │
└──────┬───────────┘      └────────────┘
       │ Yes
       ▼
┌──────────────────┐
│  Landing Page    │
└──────────────────┘
```

## How It Works

### Authentication Flow

1. **Login**: User clicks "Sign in with Google" or "Sign in with GitHub"
2. **OAuth**: Supabase handles the OAuth flow with the provider
3. **Callback**: User returns to `/auth/callback` which exchanges code for session
4. **Middleware**: Checks if user exists and onboarding status
5. **Redirect**: Sends user to onboarding or landing page accordingly

### Middleware Logic

The `middleware.ts` file runs on every request and:
- Refreshes the user session
- Checks authentication status
- Queries onboarding completion from database
- Redirects based on user state and current route

### Database Security

All data access is protected by Row Level Security (RLS):
- Users can only read/write their own profile
- Policies enforce `auth.uid() = user_id` checks
- Even with direct SQL access, users can't see others' data

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

Note: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Key Files Explained

### `middleware.ts`
Central authentication logic that runs on every request. Handles:
- Session refresh
- Auth state checking
- Onboarding status verification
- Automatic redirects

### `lib/supabase.ts`
Exports three Supabase client functions:
- `createClient()` - For client components
- `createServerSupabaseClient()` - For server components and API routes
- `createMiddlewareClient()` - For middleware with proper cookie handling

### `app/api/onboarding/route.ts`
API endpoint that:
- Verifies user authentication
- Validates form data
- Upserts to `user_profiles` table
- Sets `onboarding_completed = true`

## Customization

### Changing Questions

Edit `app/onboarding/page.tsx` to modify:
- Question text
- Number of questions
- Input types (text area, select, etc.)

Update `app/api/onboarding/route.ts` to match field names.

### Styling

The app uses Tailwind CSS. Customize:
- Colors: Edit `tailwind.config.ts`
- Components: Modify class names in TSX files
- Global styles: Update `app/globals.css`

### Adding More OAuth Providers

1. Enable provider in Supabase dashboard
2. Add button in `app/login/page.tsx`
3. Use same `signInWithOAuth()` pattern

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Update Supabase redirect URLs with production domain
5. Deploy

### Other Platforms

Works on any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted

## Troubleshooting

### "relation user_profiles does not exist"
- Run the SQL from `DATABASE_SETUP.md` in Supabase SQL Editor

### OAuth redirect not working
- Check redirect URLs in Supabase Auth settings
- Verify they match your app's URL + `/auth/callback`

### "Failed to fetch"
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure variables start with `NEXT_PUBLIC_`

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for more troubleshooting.

## Security Best Practices

✅ **Implemented**:
- Row Level Security on all tables
- HTTP-only cookies for sessions
- Server-side auth checks in middleware
- OAuth handled by Supabase (industry standard)

⚠️ **Additional Recommendations**:
- Add rate limiting for production
- Implement CAPTCHA on login for bot protection
- Set up monitoring and logging
- Add input sanitization for questionnaire responses

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

MIT

## Support

For issues or questions, please refer to:
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Database setup help
- [CLAUDE.md](./CLAUDE.md) - Architecture and development guide
