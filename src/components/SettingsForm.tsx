'use client'

import { useState } from 'react'
import { createClient, Database } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Config {
    id: string
    user_id: string
    run_policy: 'always' | 'sampled'
    sample_rate_pct: number
    obfuscate_pii: boolean
    max_eval_per_day: number
}

interface SettingsFormProps {
    config: Config
}

export default function SettingsForm({ config }: SettingsFormProps) {
    const [formData, setFormData] = useState(config)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const supabase = createClient()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const updateData = {
                run_policy: formData.run_policy,
                sample_rate_pct: formData.sample_rate_pct,
                obfuscate_pii: formData.obfuscate_pii,
                max_eval_per_day: formData.max_eval_per_day,
                updated_at: new Date().toISOString(),
            }

            const { error } = await (supabase as any)
                .from('user_configs')
                .update(updateData)
                .eq('id', config.id)

            if (error) throw error

            setMessage('Settings updated successfully!')
            router.refresh()
        } catch (error) {
            setMessage('Error updating settings. Please try again.')
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Run Policy */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Run Policy
                </label>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="run_policy"
                            value="always"
                            checked={formData.run_policy === 'always'}
                            onChange={(e) => setFormData({ ...formData, run_policy: e.target.value as 'always' | 'sampled' })}
                            className="mr-2"
                        />
                        Always run evaluations
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="run_policy"
                            value="sampled"
                            checked={formData.run_policy === 'sampled'}
                            onChange={(e) => setFormData({ ...formData, run_policy: e.target.value as 'always' | 'sampled' })}
                            className="mr-2"
                        />
                        Sample evaluations
                    </label>
                </div>
            </div>

            {/* Sample Rate */}
            {formData.run_policy === 'sampled' && (
                <div>
                    <label htmlFor="sample_rate_pct" className="block text-sm font-medium text-gray-700 mb-2">
                        Sample Rate (%)
                    </label>
                    <input
                        type="number"
                        id="sample_rate_pct"
                        min="0"
                        max="100"
                        value={formData.sample_rate_pct}
                        onChange={(e) => setFormData({ ...formData, sample_rate_pct: parseInt(e.target.value) })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Percentage of interactions to evaluate (0-100)
                    </p>
                </div>
            )}

            {/* PII Obfuscation */}
            <div>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={formData.obfuscate_pii}
                        onChange={(e) => setFormData({ ...formData, obfuscate_pii: e.target.checked })}
                        className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                        Obfuscate PII in stored data
                    </span>
                </label>
                <p className="mt-1 text-sm text-gray-500">
                    Automatically mask personally identifiable information
                </p>
            </div>

            {/* Max Evaluations Per Day */}
            <div>
                <label htmlFor="max_eval_per_day" className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Evaluations Per Day
                </label>
                <input
                    type="number"
                    id="max_eval_per_day"
                    min="1"
                    value={formData.max_eval_per_day}
                    onChange={(e) => setFormData({ ...formData, max_eval_per_day: parseInt(e.target.value) })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                    Daily limit for evaluation ingestion
                </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-3 rounded-md ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {message}
                </div>
            )}
        </form>
    )
}