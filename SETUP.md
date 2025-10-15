# 🚀 Setup Guide

Complete step-by-step setup instructions for the AI Agent Evaluation Framework.

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Supabase Account** - [Sign up here](https://supabase.com/)

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/ai-agent-eval.git
cd ai-agent-eval
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Supabase Setup

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and project name
4. Wait for setup to complete (~2 minutes)

### Get API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Configure Authentication

1. Go to **Authentication** → **Settings**
2. Set **Site URL** to `http://localhost:3000`
3. Enable **Email** authentication
4. Optionally enable **Google/GitHub** providers

## 4. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 5. Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Copy the entire content from `supabase/schema.sql`
3. Paste and click **Run**

This creates:
- ✅ `user_configs` table
- ✅ `evaluations` table
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ Database functions and triggers

## 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 7. Create Account & Generate Data

1. **Sign up** with your email
2. **Get your user ID**:
   - Go to Supabase Dashboard → **Authentication** → **Users**
   - Copy your user UUID
3. **Generate test data**:
   ```bash
   npm run seed YOUR_USER_ID_HERE 1000
   ```

## 8. Verify Setup

You should now see:
- ✅ Authentication working
- ✅ Dashboard with charts and metrics
- ✅ 1000 evaluation records
- ✅ All pages accessible

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
npx kill-port 3000
npm run dev
```

#### Database Connection Issues
- Verify environment variables
- Check Supabase project is active
- Ensure RLS policies are applied

#### Authentication Not Working
- Check Site URL in Supabase settings
- Verify API keys are correct
- Clear browser cache

#### Charts Not Loading
- Ensure test data was generated
- Check browser console for errors
- Verify user is authenticated

### Getting Help

1. Check the [README](README.md) for detailed information
2. Review [GitHub Issues](https://github.com/yourusername/ai-agent-eval/issues)
3. Join our [Discord community](#) (if available)

## Next Steps

- 📊 Explore the dashboard and analytics
- ⚙️ Configure evaluation policies in settings
- 🔌 Test the API endpoints
- 🚀 Deploy to production (see [DEPLOYMENT.md](DEPLOYMENT.md))

---

**Setup complete! 🎉 Your AI Agent Evaluation Framework is ready to use.**