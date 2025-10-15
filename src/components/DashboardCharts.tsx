'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { format, subDays, startOfDay } from 'date-fns'
import { Database } from '@/lib/supabase'

type Evaluation = Database['public']['Tables']['evaluations']['Row']

interface DashboardChartsProps {
  evaluations: Evaluation[]
}

export default function DashboardCharts({ evaluations }: DashboardChartsProps) {
  // Prepare data for charts
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 6 - i))
    const dayEvals = evaluations.filter(evaluation => 
      startOfDay(new Date(evaluation.created_at)).getTime() === date.getTime()
    )
    
    return {
      date: format(date, 'MMM dd'),
      evaluations: dayEvals.length,
      avgScore: dayEvals.length > 0 
        ? dayEvals.reduce((sum, evaluation) => sum + evaluation.score, 0) / dayEvals.length 
        : 0,
      avgLatency: dayEvals.length > 0 
        ? dayEvals.reduce((sum, evaluation) => sum + evaluation.latency_ms, 0) / dayEvals.length 
        : 0,
    }
  })

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 29 - i))
    const dayEvals = evaluations.filter(evaluation => 
      startOfDay(new Date(evaluation.created_at)).getTime() === date.getTime()
    )
    
    return {
      date: format(date, 'MMM dd'),
      evaluations: dayEvals.length,
      avgScore: dayEvals.length > 0 
        ? dayEvals.reduce((sum, evaluation) => sum + evaluation.score, 0) / dayEvals.length 
        : 0,
    }
  })

  // Score distribution
  const scoreRanges = [
    { range: '0-0.2', count: 0, color: '#ef4444' },
    { range: '0.2-0.4', count: 0, color: '#f97316' },
    { range: '0.4-0.6', count: 0, color: '#eab308' },
    { range: '0.6-0.8', count: 0, color: '#84cc16' },
    { range: '0.8-1.0', count: 0, color: '#22c55e' },
  ]

  evaluations.forEach(evaluation => {
    if (evaluation.score <= 0.2) scoreRanges[0].count++
    else if (evaluation.score <= 0.4) scoreRanges[1].count++
    else if (evaluation.score <= 0.6) scoreRanges[2].count++
    else if (evaluation.score <= 0.8) scoreRanges[3].count++
    else scoreRanges[4].count++
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 7-Day Trend */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">7-Day Evaluation Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={last7Days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="evaluations" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Evaluations"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Score Trend */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Average Score Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={last7Days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 1]} />
            <Tooltip formatter={(value) => [Number(value).toFixed(2), 'Score']} />
            <Line 
              type="monotone" 
              dataKey="avgScore" 
              stroke="#22c55e" 
              strokeWidth={2}
              name="Avg Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Latency Trend */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Latency Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={last7Days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => [`${Number(value).toFixed(0)}ms`, 'Avg Latency']} />
            <Bar dataKey="avgLatency" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Score Distribution */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Score Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={scoreRanges}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ range, count }) => count > 0 ? `${range}: ${count}` : ''}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {scoreRanges.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}