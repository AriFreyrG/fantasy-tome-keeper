# Deployment Guide - Fantasy Tome Keeper

## Prerequisites

Before deploying, ensure you have:

1. **Supabase Project Setup**:
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
   - Note your Project URL and Anon Key

2. **GitHub Repository**:
   - Code is pushed to GitHub (✅ Complete)
   - Repository is public or accessible to Vercel

## Vercel Deployment

### Method 1: Automatic Deployment (Recommended)

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import `fantasy-tome-keeper` repository

2. **Configure Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
   ```

3. **Deploy**:
   - Vercel will automatically detect Next.js
   - Build command: `npm run build` (automatic)
   - Output directory: `.next` (automatic)
   - Click "Deploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_APP_URL

# Redeploy with environment variables
vercel --prod
```

## Docker Deployment (Alternative)

If you prefer containerized deployment:

### Local Docker Build

```bash
# Build the image
docker build -t fantasy-tome-keeper .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  fantasy-tome-keeper
```

### Docker Compose

```bash
# Create .env.local with your Supabase credentials
cp .env.example .env.local

# Start the application
docker-compose up -d

# View logs
docker-compose logs -f app
```

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...` |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | `https://fantasy-tome-keeper.vercel.app` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY` | Google Books API key | Not set |
| `NEXT_PUBLIC_YOUTUBE_API_KEY` | YouTube API key | Not set |

## Post-Deployment Setup

### 1. Verify Authentication

1. Visit your deployed app
2. Click "Get Started" to create an account
3. Check email for confirmation
4. Try logging in and accessing the library

### 2. Test Core Features

- [ ] User registration and login
- [ ] Protected routes (library page)
- [ ] Wiki integration on homepage
- [ ] Responsive design on mobile

### 3. Configure Custom Domain (Optional)

In Vercel dashboard:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## Monitoring and Maintenance

### Health Checks

- Application health: `https://your-app.vercel.app/api/health`
- Next.js monitoring: Available in Vercel dashboard

### Performance Optimization

The app is optimized for Vercel with:
- ✅ Automatic static optimization
- ✅ Image optimization with Next.js Image component
- ✅ Bundle splitting and code optimization
- ✅ PWA capabilities (ready for service worker)

### Security Headers

Security headers are configured in `vercel.json`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## Troubleshooting

### Common Issues

1. **Build Errors**:
   - Check that all environment variables are set
   - Verify Supabase credentials are correct
   - Review build logs in Vercel dashboard

2. **Authentication Issues**:
   - Ensure Supabase URL is correct and accessible
   - Check that RLS policies are enabled
   - Verify email confirmation settings in Supabase

3. **Middleware Redirect Loops**:
   - Check middleware configuration
   - Ensure public routes are properly defined

### Support

- Check Vercel deployment logs
- Review Supabase logs for authentication errors
- Use browser dev tools for client-side debugging

## Next Steps

After successful deployment:

1. **Set up Supabase in production mode**
2. **Configure email templates** in Supabase dashboard
3. **Set up monitoring** and alerts
4. **Add Google Books API** for enhanced book data
5. **Implement analytics** (Vercel Analytics)

Your Fantasy Tome Keeper app is now ready for users! 🎉
