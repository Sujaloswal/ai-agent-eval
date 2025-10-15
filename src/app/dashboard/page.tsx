'use client'

import { createClient, Database } from '@/lib/supabase'
import { formatNumber, formatLatency } from '@/lib/utils'
import { BarChart3, Clock, CheckCircle, AlertTriangle, Shield } from 'lucide-react'
import DashboardCharts from '@/components/DashboardCharts'
import { useEffect, useState } from 'react'

type Evaluation = Database['public']['Tables']['evaluations']['Row']

export default function DashboardPage() {
  const supabase = createClient()
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvaluations = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) return

      const { data } = await supabase
        .from('evaluations')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      setEvaluations(data || [])
      setLoading(false)
    }

    fetchEvaluations()
  }, [supabase])

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-lg shadow">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const typedEvaluations: Evaluation[] = evaluations

  const totalEvals = typedEvaluations.length
  const avgScore = typedEvaluations.length
    ? typedEvaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / typedEvaluations.length
    : 0
  const avgLatency = typedEvaluations.length
    ? typedEvaluations.reduce((sum, evaluation) => sum + evaluation.latency_ms, 0) / typedEvaluations.length
    : 0
  const totalPIIRedacted = typedEvaluations.reduce((sum, evaluation) => sum + evaluation.pii_tokens_redacted, 0)
  const flaggedEvals = typedEvaluations.filter(evaluation => evaluation.flags.length > 0).length

  const stats = [
    {
      name: 'Total Evaluations',
      value: formatNumber(totalEvals),
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Average Score',
      value: avgScore.toFixed(2),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Average Latency',
      value: formatLatency(avgLatency),
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      name: 'PII Tokens Redacted',
      value: formatNumber(totalPIIRedacted),
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Flagged Evaluations',
      value: formatNumber(flaggedEvals),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ]

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your AI agent evaluation metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <DashboardCharts evaluations={typedEvaluations} />
    </div>
  )
}