# Database Setup Guide

This guide will help you set up the Supabase database for the authentication and onboarding application.

## Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new project in Supabase
3. Note your project URL and anon key from Project Settings > API

## Step 1: Configure Environment Variables

Update the `.env.local` file in the project root with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 2: Enable Authentication Providers

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Enable the following providers:

### Google OAuth
- Toggle "Google" to enabled
- Add your Google OAuth credentials (Client ID and Secret)
- Set authorized redirect URLs:
  - Development: `http://localhost:3000/auth/callback`
  - Production: `https://yourdomain.com/auth/callback`

### Site URL Configuration
In **Authentication** > **URL Configuration**, set:
- **Site URL**: `http://localhost:3000` (for development)
- **Redirect URLs**: Add `http://localhost:3000/auth/callback`

## Step 3: Create Database Table

Go to the **SQL Editor** in your Supabase dashboard and run the following SQL:

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  onboarding_completed BOOLEAN DEFAULT FALSE NOT NULL,
  question_1_answer TEXT,
  question_2_answer TEXT,
  question_3_answer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles table
-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_user_profiles_onboarding_completed
  ON user_profiles(onboarding_completed);
```

## Step 4: Verify Setup

After running the SQL, verify your setup:

1. Check that the `user_profiles` table appears in **Table Editor**
2. Verify that RLS is enabled (you should see a shield icon)
3. Check that all 3 policies are created under the table's policies tab

## Database Schema

### user_profiles Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, references auth.users(id) |
| `onboarding_completed` | BOOLEAN | Flag indicating if user completed onboarding |
| `question_1_answer` | TEXT | Answer to first onboarding question |
| `question_2_answer` | TEXT | Answer to second onboarding question |
| `question_3_answer` | TEXT | Answer to third onboarding question |
| `created_at` | TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | Record last update timestamp |

## Security

### Row Level Security (RLS)
The table has RLS enabled with policies that ensure:
- Users can only read their own profile data
- Users can only create their own profile (id must match auth.uid())
- Users can only update their own profile

### Best Practices
- Never disable RLS on this table
- Don't expose service role keys in client-side code
- Keep the anon key public (it's designed for client-side use)
- All sensitive operations are protected by RLS policies

## Troubleshooting

### Issue: "relation user_profiles does not exist"
**Solution**: Make sure you've run the SQL in Step 3 in the Supabase SQL Editor

### Issue: "new row violates row-level security policy"
**Solution**: Verify that RLS policies are created and the user is authenticated

### Issue: OAuth redirect not working
**Solution**:
- Check that redirect URLs are correctly configured in Supabase Auth settings
- Verify OAuth provider credentials (Client ID/Secret) are correct
- Ensure the callback URL matches: `/auth/callback`

### Issue: "Failed to fetch"
**Solution**:
- Verify `.env.local` has correct Supabase URL and anon key
- Check that the Supabase project is running
- Ensure no typos in environment variable names (must start with `NEXT_PUBLIC_`)

## Testing the Setup

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000`
3. You should be redirected to `/login`
4. Click a social login button
5. Complete OAuth flow
6. You should be redirected to `/onboarding`
7. Fill out the questionnaire
8. You should be redirected to the landing page
9. Verify your responses are saved in Supabase Table Editor

## Production Deployment

When deploying to production:

1. Update **Site URL** in Supabase Auth settings to your production domain
2. Add production redirect URLs to allowed list
3. Update OAuth provider settings with production URLs
4. Set production environment variables in your hosting platform
5. Test the complete authentication flow in production

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [OAuth with Supabase](https://supabase.com/docs/guides/auth/social-login)
