import { createServerClient } from '@/lib/supabase'
import SettingsForm from '@/components/SettingsForm'

export default async function SettingsPage() {
  const supabase = createServerClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return null

  // Get or create user config
  let { data: config } = await supabase
    .from('user_configs')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  if (!config) {
    // Create default config
    const { data: newConfig } = await supabase
      .from('user_configs')
      .insert({
        user_id: session.user.id,
        run_policy: 'always',
        sample_rate_pct: 100,
        obfuscate_pii: true,
        max_eval_per_day: 1000,
      })
      .select()
      .single()
    
    config = newConfig
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Configure your evaluation policies and preferences
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <SettingsForm config={config} />
      </div>
    </div>
  )
}