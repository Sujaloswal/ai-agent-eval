# 🚀 GitHub + Vercel Deployment Guide

Simple step-by-step guide to upload your AI Agent Evaluation Framework to GitHub and deploy on Vercel.

## 📋 Prerequisites

- ✅ Your project is working locally
- ✅ GitHub account ([Sign up here](https://github.com))
- ✅ Vercel account ([Sign up here](https://vercel.com))
- ✅ Git installed on your computer

---

## 🔧 Step 1: Prepare Your Project

### 1.1 Clean Up Environment File

Make sure your `.env.local` file is NOT uploaded to GitHub:

```bash
# Check if .gitignore exists and contains .env.local
cat .gitignore
```

If `.env.local` is not in `.gitignore`, add it:

```bash
echo ".env.local" >> .gitignore
```

### 1.2 Test Your Build

```bash
# Make sure your project builds successfully
npm run build
```

---

## 📤 Step 2: Upload to GitHub

### 2.1 Initialize Git Repository

```bash
# Navigate to your project folder
cd ai-agent-eval

# Initialize git (if not already done)
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit: AI Agent Evaluation Framework"
```

### 2.2 Create GitHub Repository

1. **Go to GitHub**: [github.com](https://github.com)
2. **Click the "+" icon** in the top right
3. **Select "New repository"**
4. **Fill in details**:
   - Repository name: `ai-agent-eval`
   - Description: `AI Agent Evaluation Framework - Multi-tenant platform for AI performance evaluation`
   - Make it **Public** (so others can see it)
   - **Don't** initialize with README (you already have one)
5. **Click "Create repository"**

### 2.3 Connect Local Project to GitHub

GitHub will show you commands. Copy and run them:

```bash
# Add GitHub as remote origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/ai-agent-eval.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

**🎉 Your project is now on GitHub!**

---

## 🌐 Step 3: Deploy to Vercel

### 3.1 Connect Vercel to GitHub

1. **Go to Vercel**: [vercel.com](https://vercel.com)
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your repository**:
   - Find `ai-agent-eval` in the list
   - Click **"Import"**

### 3.2 Configure Deployment Settings

Vercel will auto-detect Next.js. Verify these settings:

- **Framework Preset**: Next.js ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅
- **Install Command**: `npm install` ✅

### 3.3 Add Environment Variables

**IMPORTANT**: Add your Supabase credentials:

1. **Click "Environment Variables"**
2. **Add these variables**:

```env
NEXT_PUBLIC_SUPABASE_URL
```
Value: `https://your-project.supabase.co`

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Value: `your_anon_key_here`

```env
SUPABASE_SERVICE_ROLE_KEY
```
Value: `your_service_role_key_here`

### 3.4 Deploy

1. **Click "Deploy"**
2. **Wait for build** (2-3 minutes)
3. **🎉 Your app is live!**

You'll get a URL like: `https://ai-agent-eval-xyz.vercel.app`

---

## ⚙️ Step 4: Configure Supabase for Production

### 4.1 Update Supabase Settings

1. **Go to your Supabase Dashboard**
2. **Authentication** → **Settings**
3. **Update Site URL** to your Vercel URL:
   ```
   https://ai-agent-eval-xyz.vercel.app
   ```
4. **Add Redirect URLs**:
   ```
   https://ai-agent-eval-xyz.vercel.app/auth/callback
   ```

### 4.2 Test Your Live App

1. **Visit your Vercel URL**
2. **Sign up with a new account**
3. **Test all features**:
   - ✅ Authentication works
   - ✅ Dashboard loads
   - ✅ Settings page works
   - ✅ Evaluations page works

---

## 🎯 Step 5: Generate Production Data (Optional)

### 5.1 Get Your Production User ID

1. **Sign up on your live app**
2. **Go to Supabase Dashboard** → **Authentication** → **Users**
3. **Copy your user UUID**

### 5.2 Generate Test Data

```bash
# Run locally to add data to production database
npm run seed YOUR_PRODUCTION_USER_ID 1000
```

---

## 🔄 Step 6: Future Updates

### 6.1 Making Changes

```bash
# Make your changes to the code
# Then commit and push:

git add .
git commit -m "Add new feature"
git push origin main
```

### 6.2 Automatic Deployment

- **Vercel automatically deploys** when you push to GitHub
- **No manual steps needed** for updates
- **Check deployment status** in Vercel dashboard

---

## 🎨 Step 7: Custom Domain (Optional)

### 7.1 Add Custom Domain

1. **Vercel Dashboard** → **Your Project** → **Settings** → **Domains**
2. **Add your domain** (e.g., `myapp.com`)
3. **Configure DNS** as instructed by Vercel
4. **Update Supabase Site URL** to your custom domain

---

## 📋 Quick Reference Commands

### Git Commands
```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

### Project Commands
```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Generate test data
npm run seed USER_ID 1000
```

---

## 🆘 Troubleshooting

### Common Issues

#### ❌ Build Fails on Vercel
**Solution**: Check build logs in Vercel dashboard
```bash
# Test build locally first
npm run build
```

#### ❌ Environment Variables Not Working
**Solution**: 
1. Double-check variable names (exact spelling)
2. Redeploy after adding variables
3. Check Supabase keys are correct

#### ❌ Authentication Not Working
**Solution**:
1. Update Supabase Site URL to your Vercel URL
2. Add correct redirect URLs
3. Check environment variables

#### ❌ Database Connection Issues
**Solution**:
1. Verify Supabase project is active
2. Check environment variables
3. Test connection locally first

### Getting Help

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Docs**: [docs.github.com](https://docs.github.com)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

---

## ✅ Success Checklist

After following this guide, you should have:

- [ ] ✅ Project uploaded to GitHub
- [ ] ✅ App deployed on Vercel
- [ ] ✅ Custom Vercel URL working
- [ ] ✅ Authentication working
- [ ] ✅ Database connected
- [ ] ✅ All pages accessible
- [ ] ✅ Test data generated (optional)
- [ ] ✅ Automatic deployments working

---

## 🎉 Congratulations!

Your **AI Agent Evaluation Framework** is now:

- 📤 **Hosted on GitHub** - Others can see and contribute
- 🌐 **Live on Vercel** - Accessible worldwide
- 🔄 **Auto-deploying** - Updates automatically
- 🔒 **Secure** - Environment variables protected
- 📊 **Production-ready** - Scalable and fast

**Share your live app**: `https://your-app.vercel.app`

---

**Need help?** Open an issue on your GitHub repository or contact support!