'use client'

import { createClient, Database } from '@/lib/supabase'
import SettingsForm from '@/components/SettingsForm'
import { useEffect, useState } from 'react'

type UserConfig = Database['public']['Tables']['user_configs']['Row']

export default function SettingsPage() {
  const supabase = createClient()
  const [config, setConfig] = useState<UserConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) return

      // Get or create user config
      let { data: configData } = await supabase
        .from('user_configs')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (!configData) {
        // Create default config
        const { data: newConfig } = await supabase
          .from('user_configs')
          .insert({
            user_id: session.user.id,
            run_policy: 'always' as const,
            sample_rate_pct: 100,
            obfuscate_pii: true,
            max_eval_per_day: 1000,
          })
          .select()
          .single()
        
        configData = newConfig
      }

      setConfig(configData)
      setLoading(false)
    }

    fetchConfig()
  }, [supabase])

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Unable to load settings</h1>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    )
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