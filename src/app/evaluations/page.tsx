import { createServerClient } from '@/lib/supabase'
import { formatLatency, maskPII } from '@/lib/utils'
import { format } from 'date-fns'
import Link from 'next/link'
import { Badge } from '@/components/Badge'

export default async function EvaluationsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const supabase = createServerClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return null

  const page = parseInt(searchParams.page || '1')
  const pageSize = 20
  const offset = (page - 1) * pageSize

  // Get evaluations with pagination
  const { data: evaluations, count } = await supabase
    .from('evaluations')
    .select('*', { count: 'exact' })
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1)

  // Get user config for PII settings
  const { data: config } = await supabase
    .from('user_configs')
    .select('obfuscate_pii')
    .eq('user_id', session.user.id)
    .single()

  const totalPages = Math.ceil((count || 0) / pageSize)

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
          {evaluations?.map((evaluation) => (
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            {page > 1 && (
              <Link
                href={`/evaluations?page=${page - 1}`}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/evaluations?page=${page + 1}`}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </Link>
            )}
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{offset + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(offset + pageSize, count || 0)}
                </span>{' '}
                of <span className="font-medium">{count}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/evaluations?page=${pageNum}`}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      pageNum === page
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}