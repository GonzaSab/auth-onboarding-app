# Email Confirmation Setup Guide

This guide explains how to enable and configure email confirmation for user signups in your Supabase authentication system.

## What is Email Confirmation?

Email confirmation requires users to verify their email address by clicking a link sent to their inbox before they can sign in to your application. This:

✅ Prevents fake/bot signups
✅ Validates that email addresses are real and accessible
✅ Ensures users own the email before accessing your app
✅ Is a standard industry security practice

## How It Works

1. **User signs up** with email and password
2. **Supabase sends a confirmation email** with a verification link
3. **User clicks the link** in their email
4. **Link redirects to your app** at `/auth/callback`
5. **Token is verified** and user account is activated
6. **User can now sign in** with their credentials

## Enabling Email Confirmation

### Step 1: Enable in Supabase Dashboard

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find the **Email** provider
5. Toggle **"Enable email confirmations"** to **ON**
6. Click **Save**

**Important**: After enabling, new users MUST verify their email before they can sign in.

### Step 2: Configure Redirect URLs

Ensure your redirect URLs are properly configured:

1. Go to **Authentication** > **URL Configuration**
2. Add your production URL to **Redirect URLs**:
   - Production: `https://your-domain.com/auth/callback`
   - Local dev: `http://localhost:3000/auth/callback`

### Step 3: Test Locally

For local development, the Supabase CLI captures emails automatically:

```bash
# Start Supabase locally
supabase start

# Get the Mailpit URL
supabase status | grep "Inbucket URL"

# Open the URL in your browser to see test emails
```

## Email Rate Limits

### Free Tier Limitations

When using Supabase's built-in SMTP service:

- **30 emails per hour** (combined limit for all auth emails)
- Includes: signup confirmations, password resets, magic links
- **60 second cooldown** between confirmation requests for the same email

### For Production: Use Custom SMTP

To remove these limits and improve deliverability, configure a custom SMTP provider:

1. Go to **Project Settings** > **Auth** > **SMTP Settings**
2. Choose a provider:
   - **SendGrid** (recommended for most apps)
   - **AWS SES** (good for high volume)
   - **Mailgun**
   - **Postmark**
   - **Resend**
3. Enter your SMTP credentials
4. Test the configuration

**Benefits of Custom SMTP:**
- No 30/hour limit
- Better deliverability rates
- Emails from your own domain
- Professional appearance
- More control over email content

## Customizing Email Templates

### Basic Customization

1. Go to **Authentication** > **Email Templates**
2. Select **Confirm signup** template
3. Customize the email content

### Default Template Variables

```html
{{ .ConfirmationURL }} - Full confirmation link
{{ .Token }} - 6-digit OTP (alternative to link)
{{ .TokenHash }} - Hashed token for custom links
{{ .SiteURL }} - Your application's site URL
{{ .Email }} - User's email address
```

### Example Custom Template

```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(to right, #4F46E5, #7C3AED); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Welcome to Our App!</h1>
  </div>

  <div style="padding: 30px; background-color: #f9fafb;">
    <h2>Confirm Your Email Address</h2>
    <p>Hi there! 👋</p>
    <p>Thanks for signing up! Please confirm your email address by clicking the button below:</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}"
         style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Confirm Email Address
      </a>
    </div>

    <p style="color: #6b7280; font-size: 14px;">
      Or use this 6-digit code: <strong>{{ .Token }}</strong>
    </p>

    <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
      If you didn't create an account, you can safely ignore this email.
    </p>
  </div>
</body>
</html>
```

## Handling Edge Cases

### Email Not Received

Common reasons users don't receive confirmation emails:

1. **Spam/Junk folder** - Most common issue
2. **Email service delays** - Can take 1-5 minutes
3. **Typo in email address** - Double-check the email
4. **Corporate email filters** - Some companies block external emails
5. **Rate limit reached** - Free tier limit of 30/hour

**Solution**: Add a "Resend confirmation email" feature or use custom SMTP.

### Email Link Prefetching

Some email clients (Microsoft Outlook, Gmail) automatically scan links for security. This can consume the one-time token before the user clicks it.

**Solutions:**

1. **Use OTP instead of links** - Include `{{ .Token }}` in email
2. **Create a landing page** - Redirect to a page with a "Confirm" button:

```html
<a href="{{ .SiteURL }}/confirm-signup?token_hash={{ .TokenHash }}">
  Confirm your signup
</a>
```

Then on your landing page, show a button that uses the token.

### User Tries to Login Before Confirming

Your app already handles this! When a user tries to sign in before confirming:

1. Supabase returns an error: "Email not confirmed"
2. Show user a friendly message to check their email
3. Provide option to resend confirmation email

## Testing Checklist

Before going live, test these scenarios:

- [ ] New user signup sends confirmation email
- [ ] Email arrives in inbox (check spam too)
- [ ] Clicking link redirects to your app
- [ ] User can successfully sign in after confirming
- [ ] Unconfirmed user cannot sign in
- [ ] Confirmation link works only once
- [ ] Error messages are clear and helpful
- [ ] "Resend email" functionality works (if implemented)

## Monitoring and Troubleshooting

### Check Auth Logs

Monitor email sending in your Supabase Dashboard:

1. Go to **Authentication** > **Logs**
2. Filter by "email" events
3. Look for errors or failed deliveries

### Common Issues

**Issue**: Users not receiving emails
- Check spam folder
- Verify SMTP configuration
- Check rate limits (30/hour on free tier)
- Review Supabase auth logs

**Issue**: "Token expired" error
- Default expiry: 24 hours
- Configure in **Authentication** > **Settings**
- Consider email prefetching issue

**Issue**: Redirect not working
- Verify redirect URLs in dashboard
- Check `x-forwarded-host` headers (for proxies)
- Review `/auth/callback` route implementation

## Production Recommendations

For production applications:

1. ✅ **Use custom SMTP provider** (SendGrid, AWS SES, etc.)
2. ✅ **Customize email templates** with your branding
3. ✅ **Set up email monitoring** to track deliverability
4. ✅ **Add "Resend email" button** for better UX
5. ✅ **Consider MFA** for additional security
6. ✅ **Test with multiple email providers** (Gmail, Outlook, etc.)
7. ✅ **Monitor auth logs** regularly

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Email Templates Guide](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Custom SMTP Setup](https://supabase.com/docs/guides/auth/auth-smtp)
- [Rate Limits Documentation](https://supabase.com/docs/guides/auth/rate-limits)

## Support

- **Community**: [GitHub Discussions](https://github.com/supabase/supabase/discussions)
- **Discord**: [Supabase Discord](https://discord.supabase.com)
- **Paid Support**: Available on Pro plan and above

---

## Quick Start Commands

```bash
# Enable email confirmation
# 1. Go to Supabase Dashboard > Auth > Providers > Email
# 2. Toggle "Enable email confirmations" ON
# 3. Save changes

# Test locally with Mailpit
supabase start
supabase status | grep "Inbucket URL"

# Deploy changes
git add .
git commit -m "Enable email confirmation"
git push
```

Your app is now ready to use email confirmation! 🎉
