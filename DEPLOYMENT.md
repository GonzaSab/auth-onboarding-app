# Railway Deployment Guide

This guide will help you deploy your authentication and onboarding application to Railway.

## Prerequisites

- [x] Database set up in Supabase (user_profiles table created)
- [x] OAuth credentials configured in Supabase
- [ ] Railway account (sign up at https://railway.app)
- [ ] GitHub repository pushed (already done!)

## Step 1: Create Railway Project

1. Go to [Railway](https://railway.app)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select your repository: `GonzaSab/auth-onboarding-app`
6. Railway will automatically detect it's a Next.js app and start deploying

## Step 2: Configure Environment Variables

After the initial deployment, add your environment variables:

1. In Railway dashboard, click on your project
2. Go to the **"Variables"** tab
3. Add the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Click **"Deploy"** to trigger a new deployment with the environment variables

## Step 3: Get Your Railway Domain

1. After deployment completes, Railway will show your app's URL
2. It will look like: `https://your-app-name.up.railway.app`
3. Copy this URL - you'll need it for the next step

## Step 4: Update Supabase Redirect URLs

Now that you have your production URL, update Supabase configuration:

### Update Site URL
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **URL Configuration**
4. Update **Site URL** to: `https://your-app-name.up.railway.app`

### Update Redirect URLs
In the same URL Configuration page:
1. Under **Redirect URLs**, add:
   - `https://your-app-name.up.railway.app/auth/callback`
2. Keep your localhost URL for development: `http://localhost:3000/auth/callback`

### Update OAuth Provider Redirect URIs

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** > **Credentials**
3. Select your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add:
   - `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
5. Click **Save**

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on your OAuth App
3. Under **Authorization callback URL**, ensure it's set to:
   - `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
4. Click **Update application**

## Step 5: Test Your Deployment

1. Visit your Railway URL: `https://your-app-name.up.railway.app`
2. Test the authentication flow:
   - ✅ Email/password signup
   - ✅ Email/password login
   - ✅ Google OAuth (if configured)
   - ✅ GitHub OAuth (if configured)
3. Complete the onboarding questionnaire
4. Verify you're redirected to the landing page

## Step 6: Monitor Your Deployment

Railway provides built-in monitoring:
- **Logs**: Click "View Logs" to see application logs
- **Metrics**: Monitor CPU, memory, and network usage
- **Deployments**: View deployment history and rollback if needed

## Troubleshooting

### Issue: "Redirect URI mismatch" error
**Solution**: Ensure you've added the Railway URL to Supabase's Redirect URLs and OAuth provider settings

### Issue: Environment variables not working
**Solution**: Make sure you clicked "Deploy" after adding environment variables in Railway

### Issue: "Cannot find module" or build errors
**Solution**: Check Railway logs - may need to clear cache and redeploy

### Issue: OAuth not working in production
**Solution**: Verify OAuth provider redirect URIs include your Supabase callback URL

## Production Best Practices

1. **Enable RLS**: Row Level Security is already enabled on user_profiles table
2. **Monitor Logs**: Regularly check Railway logs for errors
3. **Database Backups**: Supabase automatically backs up your database
4. **Rate Limiting**: Consider adding rate limiting for authentication endpoints
5. **Custom Domain**: Optional - set up a custom domain in Railway settings

## Updating Your App

When you push changes to GitHub:
1. Railway automatically detects the push
2. Builds and deploys the new version
3. Zero-downtime deployment

## Costs

- **Railway**: Starter plan includes $5 credit/month (should be sufficient for testing)
- **Supabase**: Free tier includes 50,000 monthly active users

## Support

- Railway: https://railway.app/help
- Supabase: https://supabase.com/docs
- GitHub Issues: https://github.com/GonzaSab/auth-onboarding-app/issues

---

## Quick Checklist

- [ ] Created Railway project from GitHub repo
- [ ] Added environment variables in Railway
- [ ] Copied Railway deployment URL
- [ ] Updated Supabase Site URL
- [ ] Added Railway URL to Supabase Redirect URLs
- [ ] Updated Google OAuth redirect URIs (if using)
- [ ] Updated GitHub OAuth redirect URI (if using)
- [ ] Tested authentication flow in production
- [ ] Verified onboarding flow works

**Your app should now be live! 🎉**
