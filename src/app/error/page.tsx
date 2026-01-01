export default function ErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
                <p className="text-slate-400 mb-8">Authentication failed. Please check your credentials and try again.</p>
                <a
                    href="/login"
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                >
                    Back to Login
                </a>
            </div>
        </div>
    )
}
