import { createServerClient } from '@/lib/supabase'
import { formatLatency, maskPII } from '@/lib/utils'
import { format } from 'date-fns'
import { Badge } from '@/components/Badge'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EvaluationDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return null

  // Get evaluation details
  const { data: evaluation } = await supabase
    .from('evaluations')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single()

  if (!evaluation) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Evaluation not found</h1>
          <Link href="/evaluations" className="text-primary-600 hover:text-primary-500">
            Back to evaluations
          </Link>
        </div>
      </div>
    )
  }

  // Get user config for PII settings
  const { data: config } = await supabase
    .from('user_configs')
    .select('obfuscate_pii')
    .eq('user_id', session.user.id)
    .single()

  const shouldObfuscate = config?.obfuscate_pii || false

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/evaluations"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to evaluations
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Evaluation Details</h1>
        <p className="mt-1 text-sm text-gray-600">
          {evaluation.interaction_id}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompt */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Prompt</h2>
            <div className="bg-gray-50 rounded-md p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {maskPII(evaluation.prompt, shouldObfuscate)}
              </pre>
            </div>
          </div>

          {/* Response */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Response</h2>
            <div className="bg-gray-50 rounded-md p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {maskPII(evaluation.response, shouldObfuscate)}
              </pre>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metrics */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Metrics</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Score</dt>
                <dd className="mt-1">
                  <Badge
                    variant={evaluation.score >= 0.8 ? 'success' : evaluation.score >= 0.6 ? 'warning' : 'danger'}
                  >
                    {evaluation.score.toFixed(3)}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Latency</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatLatency(evaluation.latency_ms)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">PII Tokens Redacted</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {evaluation.pii_tokens_redacted}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(evaluation.created_at), 'MMM dd, yyyy HH:mm:ss')}
                </dd>
              </div>
            </dl>
          </div>

          {/* Flags */}
          {evaluation.flags.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Flags</h2>
              <div className="space-y-2">
                {evaluation.flags.map((flag, index) => (
                  <Badge key={index} variant="danger">
                    {flag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Raw Data */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Raw Data</h2>
            <div className="bg-gray-50 rounded-md p-4">
              <pre className="text-xs text-gray-600 overflow-x-auto">
                {JSON.stringify(evaluation, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}