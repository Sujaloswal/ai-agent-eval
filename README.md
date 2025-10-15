# 🤖 AI Agent Evaluation Framework

> A comprehensive multi-tenant platform for evaluating AI agent performance with real-time analytics, configurable policies, and secure data handling.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-black?logo=vercel)](https://vercel.com/)

## 🌟 Features

### 🔐 **Multi-tenant Architecture**
- Secure data isolation with Supabase Row Level Security (RLS)
- Each user sees only their own evaluation data
- JWT-based authentication with social providers

### ⚙️ **Configurable Evaluation Policies**
- **Always Run**: Evaluate every interaction
- **Sampled**: Configurable percentage-based sampling (0-100%)
- **PII Protection**: Automatic masking of sensitive information
- **Daily Limits**: Prevent abuse with configurable rate limits

### 📊 **Real-time Analytics Dashboard**
- Interactive charts with Chart.js and D3.js
- 7/30-day trend analysis
- Score distribution visualization
- Latency performance tracking
- AI-generated insights

### 🏢 **NGO & Policy Maker Tools**
- Consensus data visualization
- Downloadable policy reports (PDF ready)
- Priority indicators and filtering
- Key discussion points extraction

### 🚀 **Performance & Scalability**
- Handles 20,000+ evaluation records
- Efficient pagination and indexing
- Optimized database queries
- Real-time updates

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, Lucide Icons |
| **Backend** | Next.js API Routes, Supabase |
| **Database** | PostgreSQL (Supabase) |
| **Auth** | Supabase Auth + RLS |
| **Charts** | Recharts, Chart.js, D3.js |
| **Deployment** | Vercel (Frontend), Supabase (Backend) |

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Supabase account** (free tier works)
- **Vercel account** (optional, for deployment)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/ai-agent-eval.git
cd ai-agent-eval
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Database Setup

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **SQL Editor**
3. Copy and paste the content from `supabase/schema.sql`
4. Click **Run** to create tables and RLS policies

### 4. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Generate Test Data

After signing up and logging in:

1. Get your user ID from Supabase Dashboard → Authentication → Users
2. Run the seed script:

```bash
npm run seed YOUR_USER_ID_HERE 1000
```

## 📁 Project Structure

```
ai-agent-eval/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 🔐 auth/              # Authentication pages
│   │   ├── 📊 dashboard/         # Main dashboard
│   │   ├── 📋 evaluations/       # Evaluation management
│   │   ├── ⚙️ settings/          # User configuration
│   │   └── 🔌 api/evals/         # API endpoints
│   ├── 📁 components/            # Reusable UI components
│   ├── 📁 lib/                   # Utilities & configurations
│   └── 📁 types/                 # TypeScript definitions
├── 📁 supabase/                  # Database schema & migrations
├── 📁 scripts/                   # Utility scripts
└── 📚 docs/                      # Documentation
```

## 🔧 Configuration

### Evaluation Policies

Configure how evaluations are processed:

```typescript
interface UserConfig {
  run_policy: 'always' | 'sampled'    // Evaluation frequency
  sample_rate_pct: number             // Sampling percentage (0-100)
  obfuscate_pii: boolean              // PII masking enabled
  max_eval_per_day: number            // Daily evaluation limit
}
```

### API Integration

Ingest evaluation data via REST API:

```bash
curl -X POST /api/evals/ingest \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "interaction_id": "unique-id",
    "prompt": "User input text",
    "response": "AI response text",
    "score": 0.85,
    "latency_ms": 250,
    "flags": ["optional", "flags"],
    "pii_tokens_redacted": 2
  }'
```

## 📊 Database Schema

### Core Tables

#### `user_configs`
User-specific evaluation configuration settings.

```sql
CREATE TABLE user_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    run_policy TEXT CHECK (run_policy IN ('always', 'sampled')),
    sample_rate_pct INTEGER CHECK (sample_rate_pct >= 0 AND sample_rate_pct <= 100),
    obfuscate_pii BOOLEAN DEFAULT true,
    max_eval_per_day INTEGER CHECK (max_eval_per_day > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);
```

#### `evaluations`
AI agent evaluation results and metrics.

```sql
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    interaction_id TEXT NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    score DECIMAL(4,3) CHECK (score >= 0 AND score <= 1),
    latency_ms INTEGER CHECK (latency_ms >= 0),
    flags TEXT[] DEFAULT '{}',
    pii_tokens_redacted INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)

All tables implement RLS policies ensuring users can only access their own data:

```sql
-- Example RLS policy
CREATE POLICY "Users can view their own evaluations" ON evaluations
    FOR SELECT USING (auth.uid() = user_id);
```

## 🔐 Security Features

- **Row Level Security**: Database-level data isolation
- **JWT Authentication**: Secure token-based auth
- **PII Masking**: Automatic detection and masking of sensitive data
- **Rate Limiting**: Configurable daily evaluation limits
- **Input Validation**: Server-side validation for all inputs
- **HTTPS Enforcement**: Secure connections in production

## 📈 Performance Optimizations

### Database Indexes

```sql
CREATE INDEX idx_evaluations_user_created ON evaluations(user_id, created_at DESC);
CREATE INDEX idx_evaluations_interaction_id ON evaluations(interaction_id);
```

### Caching Strategy

- **Static Generation**: Public pages cached at build time
- **Server-side Rendering**: Dynamic pages with fresh data
- **Client-side Caching**: Optimistic updates for better UX

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Push to GitHub first
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_production_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
   ```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Testing

### Generate Synthetic Data

```bash
# Generate 1000 realistic evaluations
npm run seed <user_id> 1000
```

### Manual Testing Checklist

- [ ] Authentication (sign up/sign in)
- [ ] Dashboard loads with charts
- [ ] Evaluations page with pagination
- [ ] Settings configuration
- [ ] API endpoint functionality
- [ ] Mobile responsiveness

## 📚 API Documentation

### Authentication

All API endpoints require JWT authentication:

```javascript
headers: {
  'Authorization': 'Bearer <jwt_token>',
  'Content-Type': 'application/json'
}
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/evals/ingest` | Ingest evaluation data |
| `GET` | `/api/evals` | List user evaluations |
| `GET` | `/api/evals/:id` | Get evaluation details |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

- 📧 **Email**: your-email@example.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/ai-agent-eval/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-agent-eval/discussions)

---

**Built with ❤️ for AI agent evaluation and monitoring**

[⭐ Star this repo](https://github.com/yourusername/ai-agent-eval) if you find it useful!

## Database Schema

### user_configs
Configuration settings for each user's evaluation policies.

```sql
CREATE TABLE user_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    run_policy TEXT CHECK (run_policy IN ('always', 'sampled')) DEFAULT 'always',
    sample_rate_pct INTEGER CHECK (sample_rate_pct >= 0 AND sample_rate_pct <= 100) DEFAULT 100,
    obfuscate_pii BOOLEAN DEFAULT true,
    max_eval_per_day INTEGER CHECK (max_eval_per_day > 0) DEFAULT 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);
```

### evaluations
Storage for AI agent evaluation results.

```sql
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    interaction_id TEXT NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    score DECIMAL(4,3) CHECK (score >= 0 AND score <= 1) NOT NULL,
    latency_ms INTEGER CHECK (latency_ms >= 0) NOT NULL,
    flags TEXT[] DEFAULT '{}',
    pii_tokens_redacted INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security (RLS)

The application uses Supabase RLS to ensure data isolation between users:

- Users can only access their own configurations and evaluations
- All operations (SELECT, INSERT, UPDATE, DELETE) are restricted by `auth.uid() = user_id`
- Service role key bypasses RLS for administrative operations

## API Endpoints

### POST /api/evals/ingest

Ingest evaluation data for the authenticated user.

**Request Body:**
```json
{
  "interaction_id": "string",
  "prompt": "string",
  "response": "string", 
  "score": 0.85,
  "latency_ms": 250,
  "flags": ["optional", "array"],
  "pii_tokens_redacted": 2,
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Response:**
```json
{
  "message": "Evaluation stored successfully",
  "evaluation_id": "uuid"
}
```

**Features:**
- Validates score range (0-1)
- Respects user's sampling policy
- Enforces daily evaluation limits
- Applies PII obfuscation if enabled
- Returns appropriate HTTP status codes

## Configuration Options

### Run Policy
- **always**: Evaluate every interaction
- **sampled**: Evaluate based on sample rate percentage

### Sample Rate
- Percentage (0-100) of interactions to evaluate when using sampled policy

### PII Obfuscation
- Automatically masks emails, phone numbers, SSNs, and credit card numbers
- Applied to both prompts and responses before storage

### Daily Limits
- Maximum number of evaluations to accept per day
- Prevents abuse and controls costs

## Synthetic Data Generation

Generate test data for development and testing:

```bash
# Generate 1000 evaluations for a user
npm run seed <user_id> 1000

# Example
npm run seed 123e4567-e89b-12d3-a456-426614174000 500
```

The seed script generates realistic data with:
- Varied score distributions (60% high, 25% medium, 15% low)
- Realistic latency patterns
- Random flags and PII redaction
- Timestamps spread over the last 30 days

## Dashboard Features

### Overview Metrics
- Total evaluations count
- Average score
- Average latency
- PII tokens redacted
- Flagged evaluations

### Charts
- **7-Day Evaluation Trend**: Line chart showing daily evaluation counts
- **Score Trend**: Average scores over time
- **Latency Trend**: Bar chart of response times
- **Score Distribution**: Pie chart of score ranges

### Drill-down Views
- Paginated evaluation list (20 per page)
- Individual evaluation details
- Masked PII based on user settings
- Flag highlighting and raw data view

## Performance Optimizations

### Database Indexes
```sql
CREATE INDEX idx_evaluations_user_created ON evaluations(user_id, created_at DESC);
CREATE INDEX idx_evaluations_interaction_id ON evaluations(interaction_id);
```

### Pagination
- Server-side pagination with 20 items per page
- Efficient COUNT queries for total counts
- Optimized for large datasets (20,000+ records)

### Caching
- Static generation for public pages
- Server-side rendering for authenticated pages
- Optimistic updates for better UX

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

## Security Considerations

- **Authentication**: Supabase Auth with social providers
- **Authorization**: Row Level Security (RLS) policies
- **Data Validation**: Server-side validation for all inputs
- **Rate Limiting**: Daily evaluation limits per user
- **PII Protection**: Automatic masking of sensitive data
- **HTTPS**: Enforced in production
- **Environment Variables**: Secure credential management

## Development

### Project Structure
```
ai-agent-eval/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── evaluations/    # Evaluation pages
│   │   └── settings/       # Settings page
│   ├── components/         # Reusable components
│   └── lib/               # Utilities and configurations
├── scripts/               # Database seeding scripts
├── supabase/             # Database schema
└── README.md
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Generate synthetic data
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ for AI agent evaluation and monitoring**