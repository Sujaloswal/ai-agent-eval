'use client'

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export default function UserInfo() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  if (!user) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-medium text-blue-800 mb-2">Your User Information</h3>
      <div className="text-sm text-blue-700 space-y-1">
        <div><strong>User ID:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{user.id}</code></div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</div>
      </div>
      <div className="mt-3 text-xs text-blue-600">
        💡 Copy the User ID above to use with: <code>npm run seed {user.id} 1000</code>
      </div>
    </div>
  )
}