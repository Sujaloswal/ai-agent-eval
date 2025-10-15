import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { maskPII } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Get the authenticated user using the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const {
      interaction_id,
      prompt,
      response,
      score,
      latency_ms,
      flags = [],
      pii_tokens_redacted = 0,
      created_at,
    } = body

    // Validate required fields
    if (!interaction_id || !prompt || !response || score === undefined || !latency_ms) {
      return NextResponse.json(
        { error: 'Missing required fields: interaction_id, prompt, response, score, latency_ms' },
        { status: 400 }
      )
    }

    // Validate score range
    if (score < 0 || score > 1) {
      return NextResponse.json(
        { error: 'Score must be between 0 and 1' },
        { status: 400 }
      )
    }

    // Get user config
    const { data: config } = await supabase
      .from('user_configs')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!config) {
      return NextResponse.json(
        { error: 'User configuration not found' },
        { status: 404 }
      )
    }

    // Check daily limit
    const today = new Date().toISOString().split('T')[0]
    const { count: todayCount } = await supabase
      .from('evaluations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`)

    if ((todayCount || 0) >= config.max_eval_per_day) {
      return NextResponse.json(
        { error: 'Daily evaluation limit exceeded' },
        { status: 429 }
      )
    }

    // Check sampling policy
    if (config.run_policy === 'sampled') {
      const shouldSample = Math.random() * 100 < config.sample_rate_pct
      if (!shouldSample) {
        return NextResponse.json(
          { message: 'Evaluation skipped due to sampling policy' },
          { status: 200 }
        )
      }
    }

    // Apply PII obfuscation if enabled
    const finalPrompt = config.obfuscate_pii ? maskPII(prompt, true) : prompt
    const finalResponse = config.obfuscate_pii ? maskPII(response, true) : response

    // Insert evaluation
    const { data: evaluation, error } = await supabase
      .from('evaluations')
      .insert({
        user_id: user.id,
        interaction_id,
        prompt: finalPrompt,
        response: finalResponse,
        score,
        latency_ms,
        flags,
        pii_tokens_redacted,
        created_at: created_at || new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to store evaluation' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Evaluation stored successfully',
      evaluation_id: evaluation.id,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}