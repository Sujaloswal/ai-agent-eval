-- Clean schema for AI Agent Evaluation Framework
-- Run this if you get "policy already exists" errors

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own config" ON user_configs;
DROP POLICY IF EXISTS "Users can insert their own config" ON user_configs;
DROP POLICY IF EXISTS "Users can update their own config" ON user_configs;
DROP POLICY IF EXISTS "Users can delete their own config" ON user_configs;

DROP POLICY IF EXISTS "Users can view their own evaluations" ON evaluations;
DROP POLICY IF EXISTS "Users can insert their own evaluations" ON evaluations;
DROP POLICY IF EXISTS "Users can update their own evaluations" ON evaluations;
DROP POLICY IF EXISTS "Users can delete their own evaluations" ON evaluations;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS evaluations;
DROP TABLE IF EXISTS user_configs;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create user_configs table
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

-- Create evaluations table
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_configs_user_id ON user_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_created_at ON evaluations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evaluations_user_created ON evaluations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evaluations_interaction_id ON evaluations(interaction_id);

-- Enable Row Level Security
ALTER TABLE user_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_configs
CREATE POLICY "Users can view their own config" ON user_configs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own config" ON user_configs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own config" ON user_configs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own config" ON user_configs
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for evaluations
CREATE POLICY "Users can view their own evaluations" ON evaluations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own evaluations" ON evaluations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own evaluations" ON evaluations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own evaluations" ON evaluations
    FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_configs_updated_at 
    BEFORE UPDATE ON user_configs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();