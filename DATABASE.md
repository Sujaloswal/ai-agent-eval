# 🗄️ Database Documentation

Complete database schema, RLS policies, and data management guide.

## Schema Overview

The AI Agent Evaluation Framework uses PostgreSQL via Supabase with two main tables:

```
┌─────────────────┐     ┌─────────────────┐
│   user_configs  │────▶│   evaluations   │
│                 │     │                 │
│ - id            │     │ - id            │
│ - user_id (FK)  │     │ - user_id (FK)  │
│ - run_policy    │     │ - interaction_id│
│ - sample_rate   │     │ - prompt        │
│ - obfuscate_pii │     │ - response      │
│ - max_eval_day  │     │ - score         │
│ - created_at    │     │ - latency_ms    │
│ - updated_at    │     │ - flags         │
└─────────────────┘     │ - pii_redacted  │
                        │ - created_at    │
                        └─────────────────┘
```

## Table Definitions

### `user_configs`

User-specific evaluation configuration and policies.

```sql
CREATE TABLE user_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

**Fields:**
- `id`: Primary key (UUID)
- `user_id`: Foreign key to `auth.users` (Supabase Auth)
- `run_policy`: Evaluation frequency (`always` or `sampled`)
- `sample_rate_pct`: Sampling percentage (0-100) when policy is `sampled`
- `obfuscate_pii`: Whether to mask PII in stored data
- `max_eval_per_day`: Daily limit for evaluation ingestion
- `created_at`: Record creation timestamp
- `updated_at`: Last modification timestamp

### `evaluations`

AI agent evaluation results and performance metrics.

```sql
CREATE TABLE evaluations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

**Fields:**
- `id`: Primary key (UUID)
- `user_id`: Foreign key to `auth.users`
- `interaction_id`: Unique identifier for the AI interaction
- `prompt`: User input text (may be PII-masked)
- `response`: AI agent response text (may be PII-masked)
- `score`: Evaluation score (0.0 to 1.0)
- `latency_ms`: Response time in milliseconds
- `flags`: Array of evaluation flags (e.g., `["low_confidence", "bias_detected"]`)
- `pii_tokens_redacted`: Number of PII tokens that were masked
- `created_at`: Evaluation timestamp

## Indexes

Performance-optimized indexes for common query patterns:

```sql
-- User-specific queries
CREATE INDEX idx_user_configs_user_id ON user_configs(user_id);
CREATE INDEX idx_evaluations_user_id ON evaluations(user_id);

-- Time-based queries
CREATE INDEX idx_evaluations_created_at ON evaluations(created_at DESC);
CREATE INDEX idx_evaluations_user_created ON evaluations(user_id, created_at DESC);

-- Lookup queries
CREATE INDEX idx_evaluations_interaction_id ON evaluations(interaction_id);
```

## Row Level Security (RLS)

All tables implement RLS policies to ensure data isolation between users.

### `user_configs` Policies

```sql
-- Enable RLS
ALTER TABLE user_configs ENABLE ROW LEVEL SECURITY;

-- Users can view their own config
CREATE POLICY "Users can view their own config" ON user_configs
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own config
CREATE POLICY "Users can insert their own config" ON user_configs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own config
CREATE POLICY "Users can update their own config" ON user_configs
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own config
CREATE POLICY "Users can delete their own config" ON user_configs
    FOR DELETE USING (auth.uid() = user_id);
```

### `evaluations` Policies

```sql
-- Enable RLS
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Users can view their own evaluations
CREATE POLICY "Users can view their own evaluations" ON evaluations
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own evaluations
CREATE POLICY "Users can insert their own evaluations" ON evaluations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own evaluations
CREATE POLICY "Users can update their own evaluations" ON evaluations
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own evaluations
CREATE POLICY "Users can delete their own evaluations" ON evaluations
    FOR DELETE USING (auth.uid() = user_id);
```

## Database Functions

### Auto-update Timestamp

Automatically updates the `updated_at` field when records are modified:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to user_configs table
CREATE TRIGGER update_user_configs_updated_at 
    BEFORE UPDATE ON user_configs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## Data Types & Constraints

### Score Validation
- **Range**: 0.0 to 1.0 (inclusive)
- **Precision**: 3 decimal places (e.g., 0.856)
- **Type**: `DECIMAL(4,3)`

### Latency Validation
- **Range**: 0 to unlimited milliseconds
- **Type**: `INTEGER`

### Flags Array
- **Type**: `TEXT[]`
- **Examples**: `['low_confidence']`, `['bias_detected', 'hallucination']`
- **Default**: Empty array `{}`

### Run Policy Enum
- **Values**: `'always'` or `'sampled'`
- **Default**: `'always'`

## Sample Data

### User Config Example

```sql
INSERT INTO user_configs (user_id, run_policy, sample_rate_pct, obfuscate_pii, max_eval_per_day)
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'sampled', 75, true, 5000);
```

### Evaluation Example

```sql
INSERT INTO evaluations (
    user_id, 
    interaction_id, 
    prompt, 
    response, 
    score, 
    latency_ms, 
    flags, 
    pii_tokens_redacted
) VALUES (
    '123e4567-e89b-12d3-a456-426614174000',
    'chat-001',
    'What is machine learning?',
    'Machine learning is a subset of AI that enables computers to learn...',
    0.892,
    245,
    '{}',
    0
);
```

## Common Queries

### Get User Statistics

```sql
SELECT 
    COUNT(*) as total_evaluations,
    AVG(score) as average_score,
    AVG(latency_ms) as average_latency,
    SUM(pii_tokens_redacted) as total_pii_redacted
FROM evaluations 
WHERE user_id = auth.uid();
```

### Daily Evaluation Count

```sql
SELECT 
    DATE(created_at) as date,
    COUNT(*) as evaluations
FROM evaluations 
WHERE user_id = auth.uid()
    AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Score Distribution

```sql
SELECT 
    CASE 
        WHEN score <= 0.2 THEN '0.0-0.2'
        WHEN score <= 0.4 THEN '0.2-0.4'
        WHEN score <= 0.6 THEN '0.4-0.6'
        WHEN score <= 0.8 THEN '0.6-0.8'
        ELSE '0.8-1.0'
    END as score_range,
    COUNT(*) as count
FROM evaluations 
WHERE user_id = auth.uid()
GROUP BY score_range
ORDER BY score_range;
```

## Backup & Migration

### Export Data

```sql
-- Export user evaluations
COPY (
    SELECT * FROM evaluations 
    WHERE user_id = 'your-user-id'
) TO '/path/to/evaluations_backup.csv' WITH CSV HEADER;
```

### Data Retention

Consider implementing data retention policies:

```sql
-- Delete evaluations older than 1 year
DELETE FROM evaluations 
WHERE created_at < NOW() - INTERVAL '1 year';
```

## Performance Considerations

### Query Optimization

1. **Always filter by `user_id`** - Leverages RLS and indexes
2. **Use date ranges** - Prevents full table scans
3. **Limit results** - Use `LIMIT` for pagination
4. **Index usage** - Ensure queries use existing indexes

### Scaling Recommendations

- **Partitioning**: Consider partitioning `evaluations` by date for large datasets
- **Archiving**: Move old evaluations to separate archive tables
- **Read Replicas**: Use read replicas for analytics queries
- **Connection Pooling**: Implement connection pooling for high traffic

## Monitoring

### Key Metrics to Monitor

- Table sizes and growth rates
- Query performance and slow queries
- Index usage statistics
- Connection pool utilization
- RLS policy performance

### Useful Queries

```sql
-- Table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public';

-- Index usage
SELECT 
    indexrelname,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes;
```

---

**Database schema is production-ready and optimized for performance! 🚀**