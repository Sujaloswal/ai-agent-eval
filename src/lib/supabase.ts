import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export type Database = {
  public: {
    Tables: {
      user_configs: {
        Row: {
          id: string
          user_id: string
          run_policy: 'always' | 'sampled'
          sample_rate_pct: number
          obfuscate_pii: boolean
          max_eval_per_day: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          run_policy?: 'always' | 'sampled'
          sample_rate_pct?: number
          obfuscate_pii?: boolean
          max_eval_per_day?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          run_policy?: 'always' | 'sampled'
          sample_rate_pct?: number
          obfuscate_pii?: boolean
          max_eval_per_day?: number
          created_at?: string
          updated_at?: string
        }
      }
      evaluations: {
        Row: {
          id: string
          user_id: string
          interaction_id: string
          prompt: string
          response: string
          score: number
          latency_ms: number
          flags: string[]
          pii_tokens_redacted: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          interaction_id: string
          prompt: string
          response: string
          score: number
          latency_ms: number
          flags?: string[]
          pii_tokens_redacted?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          interaction_id?: string
          prompt?: string
          response?: string
          score?: number
          latency_ms?: number
          flags?: string[]
          pii_tokens_redacted?: number
          created_at?: string
        }
      }
    }
  }
}

// Singleton client instance
let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

export const createClient = () => {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return supabaseClient
}

export const createServerClient = () => {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}