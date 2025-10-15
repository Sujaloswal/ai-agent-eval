'use client'

import { createClient, Database } from '@/lib/supabase'
import { formatLatency, maskPII } from '@/lib/utils'
import { format } from 'date-fns'
import Link from 'next/link'
import { Badge } from '@/components/Badge'
import { useEffect, useState } from 'react'

type Evaluation = Database['public']['Tables']['evaluations']['Row']
type UserConfig = Database['public']['Tables']['user_configs']['Row']

export default function EvaluationsPage() {
  const supabase = createClient()
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [config, setConfig] = useState<UserConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) return

      // Get evaluations
      const { data: evalData } = await supabase
        .from('evaluations')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      // Get user config for PII settings
      const { data: configData } = await supabase
        .from('user_configs')
        .select('obfuscate_pii')
        .eq('user_id', session.user.id)
        .single()

      setEvaluations(evalData || [])
      setConfig(configData)
      setLoading(false)
    }

    fetchData()
  }, [supabase])

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Evaluations</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and analyze your AI agent evaluation results
        </p>
      </div>

      {/* Evaluations List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {evaluations.map((evaluation) => (
            <li key={evaluation.id}>
              <Link
                href={`/evaluations/${evaluation.id}`}
                className="block hover:bg-gray-50 px-4 py-4 sm:px-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary-600 truncate">
                        {evaluation.interaction_id}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <Badge
                          variant={evaluation.score >= 0.8 ? 'success' : evaluation.score >= 0.6 ? 'warning' : 'danger'}
                        >
                          Score: {evaluation.score.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span className="truncate max-w-md">
                        {maskPII(evaluation.prompt, config?.obfuscate_pii || false)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>Latency: {formatLatency(evaluation.latency_ms)}</span>
                        {evaluation.pii_tokens_redacted > 0 && (
                          <span>PII Redacted: {evaluation.pii_tokens_redacted}</span>
                        )}
                        {evaluation.flags.length > 0 && (
                          <span className="text-red-600">
                            Flags: {evaluation.flags.join(', ')}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(new Date(evaluation.created_at), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}