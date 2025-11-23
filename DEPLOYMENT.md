# Deployment Guide - Goal App

## Recommended: Deploy to Vercel

Vercel is the best platform for Next.js apps, created by the Next.js team.

### Prerequisites
- GitHub account
- Vercel account (free at https://vercel.com)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Goal app with Supabase"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/goal-app.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New Project"
3. Import your `goal-app` repository
4. Configure project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

5. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = `https://fhlvivbrcelhxmgqiayk.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_7SHtkskOhtNCwV0ndgnTXA_aZA-dHVC`

6. Click "Deploy"

### Step 3: Access Your App

After deployment (takes ~2 minutes):
- Your app will be live at `https://goal-app-XXXXX.vercel.app`
- Vercel provides a custom domain
- Every push to `main` branch auto-deploys

---

## Alternative: Deploy to Netlify

If you prefer Netlify:

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repo
4. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Add environment variables in Site settings → Environment variables
6. Deploy

---

## Alternative: Deploy to Railway

For a simple deployment with database included:

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables
5. Railway will auto-detect Next.js and deploy

---

## Post-Deployment Checklist

- [ ] Verify environment variables are set correctly
- [ ] Test adding/editing/deleting todos
- [ ] Test page refresh (data should persist)
- [ ] Check browser console for errors
- [ ] Update Supabase RLS policies if needed (currently allows public access)

---

## Custom Domain (Optional)

### On Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### On Netlify:
1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS

---

## Troubleshooting

**Build fails:**
- Check that all environment variables are set
- Verify `.env.local` is in `.gitignore` (it should be)
- Check build logs for specific errors

**App loads but no data:**
- Verify environment variables are correct
- Check browser console for Supabase errors
- Verify SQL schema was run in Supabase

**CORS errors:**
- Supabase should allow all origins by default
- If issues persist, check Supabase project settings
