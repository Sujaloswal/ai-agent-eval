import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing')
  process.exit(1)
}

console.log('Using Supabase URL:', supabaseUrl)
console.log('Service key starts with:', supabaseServiceKey?.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample prompts and responses for AI evaluation
const samplePrompts = [
  "What is the capital of France?",
  "Explain quantum computing in simple terms",
  "Write a Python function to calculate fibonacci numbers",
  "What are the benefits of renewable energy?",
  "How do I bake a chocolate cake?",
  "Explain the theory of relativity",
  "What is machine learning?",
  "How to start a small business?",
  "What are the symptoms of diabetes?",
  "Explain blockchain technology",
  "How to learn a new language effectively?",
  "What is climate change?",
  "How to invest in stocks?",
  "What is artificial intelligence?",
  "How to maintain a healthy diet?",
]

const sampleResponses = [
  "The capital of France is Paris, a beautiful city known for its art, culture, and history.",
  "Quantum computing uses quantum mechanical phenomena to process information in ways that classical computers cannot.",
  "Here's a Python function for fibonacci: def fib(n): return n if n <= 1 else fib(n-1) + fib(n-2)",
  "Renewable energy reduces carbon emissions, creates jobs, and provides sustainable power sources.",
  "To bake a chocolate cake, you'll need flour, sugar, eggs, cocoa powder, and follow these steps...",
  "Einstein's theory of relativity describes the relationship between space, time, and gravity.",
  "Machine learning is a subset of AI that enables computers to learn from data without explicit programming.",
  "Starting a small business requires planning, funding, legal setup, and market research.",
  "Common diabetes symptoms include frequent urination, excessive thirst, and unexplained weight loss.",
  "Blockchain is a distributed ledger technology that ensures secure and transparent transactions.",
  "Effective language learning involves consistent practice, immersion, and using multiple learning methods.",
  "Climate change refers to long-term shifts in global temperatures and weather patterns.",
  "Stock investing requires research, diversification, and understanding of market risks and rewards.",
  "AI is the simulation of human intelligence in machines programmed to think and learn.",
  "A healthy diet includes balanced nutrition, portion control, and regular meal timing.",
]

const sampleFlags = [
  'inappropriate_content',
  'factual_error',
  'bias_detected',
  'safety_concern',
  'hallucination',
  'off_topic',
  'low_quality',
]

async function generateSyntheticData(userId: string, count: number = 1000) {
  console.log(`Generating ${count} synthetic evaluations for user ${userId}...`)
  
  const evaluations = []
  
  for (let i = 0; i < count; i++) {
    const promptIndex = Math.floor(Math.random() * samplePrompts.length)
    const responseIndex = Math.floor(Math.random() * sampleResponses.length)
    
    // Generate realistic score distribution (mostly good scores with some poor ones)
    let score: number
    const rand = Math.random()
    if (rand < 0.6) {
      // 60% high scores (0.7-1.0)
      score = 0.7 + Math.random() * 0.3
    } else if (rand < 0.85) {
      // 25% medium scores (0.4-0.7)
      score = 0.4 + Math.random() * 0.3
    } else {
      // 15% low scores (0.0-0.4)
      score = Math.random() * 0.4
    }
    
    // Generate realistic latency (mostly fast with some slow responses)
    let latency: number
    const latencyRand = Math.random()
    if (latencyRand < 0.7) {
      // 70% fast responses (50-500ms)
      latency = 50 + Math.random() * 450
    } else if (latencyRand < 0.9) {
      // 20% medium responses (500-2000ms)
      latency = 500 + Math.random() * 1500
    } else {
      // 10% slow responses (2000-10000ms)
      latency = 2000 + Math.random() * 8000
    }
    
    // Generate flags (10% chance of having flags)
    const flags: string[] = []
    if (Math.random() < 0.1) {
      const numFlags = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < numFlags; j++) {
        const flag = sampleFlags[Math.floor(Math.random() * sampleFlags.length)]
        if (!flags.includes(flag)) {
          flags.push(flag)
        }
      }
    }
    
    // Generate PII redaction count (20% chance of having PII)
    const piiTokensRedacted = Math.random() < 0.2 ? Math.floor(Math.random() * 5) + 1 : 0
    
    // Generate timestamp within last 30 days
    const createdAt = faker.date.recent({ days: 30 })
    
    evaluations.push({
      user_id: userId,
      interaction_id: faker.string.uuid(),
      prompt: samplePrompts[promptIndex],
      response: sampleResponses[responseIndex],
      score: Math.round(score * 1000) / 1000, // Round to 3 decimal places
      latency_ms: Math.round(latency),
      flags,
      pii_tokens_redacted: piiTokensRedacted,
      created_at: createdAt.toISOString(),
    })
  }
  
  // Insert in batches of 100
  const batchSize = 100
  for (let i = 0; i < evaluations.length; i += batchSize) {
    const batch = evaluations.slice(i, i + batchSize)
    const { error } = await supabase
      .from('evaluations')
      .insert(batch)
    
    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error)
      return
    }
    
    console.log(`Inserted batch ${i / batchSize + 1}/${Math.ceil(evaluations.length / batchSize)}`)
  }
  
  console.log(`Successfully generated ${count} synthetic evaluations!`)
}

async function createDefaultConfig(userId: string) {
  console.log(`Creating default config for user ${userId}...`)
  
  const { error } = await supabase
    .from('user_configs')
    .upsert({
      user_id: userId,
      run_policy: 'always',
      sample_rate_pct: 100,
      obfuscate_pii: true,
      max_eval_per_day: 1000,
    })
  
  if (error) {
    console.error('Error creating config:', error)
    return
  }
  
  console.log('Default config created successfully!')
}

async function main() {
  const args = process.argv.slice(2)
  const userId = args[0]
  const count = parseInt(args[1]) || 1000
  
  if (!userId) {
    console.error('Usage: npm run seed <user_id> [count]')
    console.error('Example: npm run seed 123e4567-e89b-12d3-a456-426614174000 500')
    process.exit(1)
  }
  
  try {
    // Create default config
    await createDefaultConfig(userId)
    
    // Generate synthetic data
    await generateSyntheticData(userId, count)
    
    console.log('Seeding completed successfully!')
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

main()