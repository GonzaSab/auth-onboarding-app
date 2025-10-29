# Quick Start: Deploy to Railway

Follow these steps to deploy your app in under 5 minutes.

## 1. Deploy to Railway

Click this button or follow the manual steps below:

### Manual Deployment

1. Go to [Railway](https://railway.app) and sign in with GitHub
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose `GonzaSab/auth-onboarding-app`
5. Railway will automatically start building

## 2. Add Environment Variables

While it's building, add your environment variables:

1. Click on your project in Railway
2. Go to **Variables** tab
3. Click **"+ New Variable"**
4. Add these two variables:

```
NEXT_PUBLIC_SUPABASE_URL=***REMOVED***
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=***REMOVED***
```

4. Railway will automatically redeploy with the new variables

## 3. Get Your App URL

1. After deployment completes (2-3 minutes)
2. Railway shows your URL at the top: `https://your-app.up.railway.app`
3. Click **"Open"** or copy the URL

## 4. Update Supabase (CRITICAL)

Go to [Supabase Dashboard](https://supabase.com/dashboard/project/***REMOVED***):

### Authentication > URL Configuration

1. **Site URL**: Change to `https://your-app.up.railway.app`
2. **Redirect URLs**: Add `https://your-app.up.railway.app/auth/callback`

**Don't forget this step or authentication won't work!**

## 5. Test It!

Visit your Railway URL and test:
- ✅ Sign up with email/password
- ✅ Complete onboarding questionnaire
- ✅ See your dashboard

## Done! 🎉

Your app is now live on Railway!

---

## Need Help?

- Full deployment guide: See `DEPLOYMENT.md`
- Railway docs: https://docs.railway.app
- Issues: https://github.com/GonzaSab/auth-onboarding-app/issues
