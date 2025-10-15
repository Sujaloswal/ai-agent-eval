# 🚀 Deployment Guide

Complete deployment instructions for production environments.

## Deployment Options

| Platform | Frontend | Backend | Database | Cost |
|----------|----------|---------|----------|------|
| **Vercel + Supabase** | ✅ | ✅ | ✅ | Free tier available |
| **Netlify + Supabase** | ✅ | ❌ | ✅ | Free tier available |
| **AWS** | ✅ | ✅ | ✅ | Pay-as-you-go |
| **Self-hosted** | ✅ | ✅ | ✅ | Infrastructure costs |

## Recommended: Vercel + Supabase

### Prerequisites

- GitHub repository
- Vercel account
- Supabase project (production)

### 1. Prepare Repository

```bash
# Ensure your code is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Production Supabase Setup

#### Create Production Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project for production
3. Choose a strong database password
4. Wait for setup completion

#### Apply Database Schema

1. Go to **SQL Editor**
2. Copy content from `supabase/schema.sql`
3. Run the schema

#### Configure Authentication

1. **Authentication** → **Settings**
2. Set **Site URL** to your production domain
3. Add **Redirect URLs**:
   - `https://yourdomain.com/auth/callback`
   - `https://yourdomain.vercel.app/auth/callback`

#### Get Production Keys

1. **Settings** → **API**
2. Copy:
   - Project URL
   - Anon public key
   - Service role key

### 3. Deploy to Vercel

#### Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repository
4. Select the `ai-agent-eval` folder as root

#### Configure Build Settings

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### Environment Variables

Add these in Vercel dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
```

#### Deploy

1. Click **Deploy**
2. Wait for build completion
3. Your app will be live at `https://your-app.vercel.app`

### 4. Post-Deployment Setup

#### Custom Domain (Optional)

1. **Vercel Dashboard** → **Domains**
2. Add your custom domain
3. Configure DNS records
4. Update Supabase Site URL

#### SSL Certificate

- Vercel automatically provides SSL certificates
- Your app will be available at `https://`

#### Test Production

1. Visit your deployed app
2. Sign up with a new account
3. Generate test data:
   ```bash
   npm run seed YOUR_PROD_USER_ID 100
   ```

## Alternative: Netlify Deployment

### 1. Build Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### 2. Deploy

1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy

**Note**: Netlify doesn't support Next.js API routes. You'll need a separate backend.

## Environment Variables

### Required Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Optional Variables

```env
# Analytics (if using)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Error Tracking (if using)
SENTRY_DSN=https://your-sentry-dsn

# Custom Configuration
NEXT_PUBLIC_APP_NAME=AI Agent Eval
NEXT_PUBLIC_SUPPORT_EMAIL=support@yourdomain.com
```

## Performance Optimization

### Build Optimization

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Enable compression
  compress: true,
  // Optimize images
  images: {
    domains: ['your-domain.com'],
  },
  // Bundle analyzer (development only)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(new BundleAnalyzerPlugin())
      return config
    },
  }),
}

module.exports = nextConfig
```

### Database Optimization

```sql
-- Add production indexes
CREATE INDEX CONCURRENTLY idx_evaluations_score ON evaluations(score);
CREATE INDEX CONCURRENTLY idx_evaluations_flags ON evaluations USING GIN(flags);

-- Analyze tables for query optimization
ANALYZE user_configs;
ANALYZE evaluations;
```

## Monitoring & Observability

### Vercel Analytics

Enable in Vercel dashboard:
- **Analytics**: Track page views and performance
- **Speed Insights**: Monitor Core Web Vitals

### Supabase Monitoring

Monitor in Supabase dashboard:
- **Database usage**
- **API requests**
- **Authentication metrics**

### Custom Monitoring

Add monitoring service (optional):

```javascript
// lib/monitoring.js
export const trackEvent = (eventName, properties) => {
  if (typeof window !== 'undefined') {
    // Analytics tracking
    gtag('event', eventName, properties)
  }
}

export const trackError = (error, context) => {
  console.error('Application error:', error, context)
  // Send to error tracking service
}
```

## Security Checklist

### Pre-Deployment

- [ ] Environment variables secured
- [ ] No sensitive data in code
- [ ] RLS policies tested
- [ ] API endpoints validated
- [ ] Authentication flows tested

### Post-Deployment

- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] Rate limiting implemented
- [ ] Error handling tested
- [ ] Backup strategy in place

## Backup Strategy

### Database Backups

Supabase provides automatic backups:
- **Point-in-time recovery** (7 days)
- **Daily backups** (retained based on plan)

### Manual Backup

```bash
# Export schema
pg_dump --schema-only your_db_url > schema_backup.sql

# Export data
pg_dump --data-only your_db_url > data_backup.sql
```

### Code Backups

- GitHub repository (primary)
- Local development backups
- Deployment artifacts

## Scaling Considerations

### Database Scaling

- **Connection pooling**: Supabase handles automatically
- **Read replicas**: Available on Pro plan
- **Database size**: Monitor and archive old data

### Application Scaling

- **Vercel**: Auto-scales based on traffic
- **Edge functions**: For global performance
- **CDN**: Static assets cached globally

### Cost Optimization

- **Supabase**: Monitor database usage
- **Vercel**: Track function execution time
- **Optimize queries**: Reduce database load

## Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Check build logs
vercel logs your-deployment-url

# Local build test
npm run build
```

#### Environment Variables

```bash
# Verify variables are set
vercel env ls

# Test locally with production env
vercel env pull .env.local
npm run dev
```

#### Database Connection

```bash
# Test connection
npx supabase status
```

### Performance Issues

- Check Vercel function logs
- Monitor Supabase performance
- Analyze slow queries
- Review Core Web Vitals

## Rollback Strategy

### Quick Rollback

1. **Vercel**: Revert to previous deployment
2. **Database**: Use point-in-time recovery
3. **DNS**: Update if using custom domain

### Planned Rollback

1. Tag stable releases
2. Maintain database migration scripts
3. Test rollback procedures

## Support & Maintenance

### Regular Tasks

- [ ] Monitor application performance
- [ ] Review error logs
- [ ] Update dependencies
- [ ] Backup verification
- [ ] Security updates

### Monitoring Alerts

Set up alerts for:
- High error rates
- Performance degradation
- Database usage limits
- Authentication failures

---

**Your AI Agent Evaluation Framework is now production-ready! 🎉**

For support, check our [GitHub Issues](https://github.com/yourusername/ai-agent-eval/issues) or contact [support@yourdomain.com](mailto:support@yourdomain.com).