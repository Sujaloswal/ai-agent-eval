export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 Deployment Test
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          If you can see this page, your deployment is working!
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          <div className="space-y-2 text-left">
            <p>
              <strong>Supabase URL:</strong>{' '}
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
            </p>
            <p>
              <strong>Supabase Anon Key:</strong>{' '}
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
            </p>
            <p>
              <strong>Build Time:</strong> {new Date().toISOString()}
            </p>
          </div>
        </div>
        <div className="mt-8">
          <a 
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Main App
          </a>
        </div>
      </div>
    </div>
  )
}