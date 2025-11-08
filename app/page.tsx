import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
            Know where your time goes.<br />
            Master what matters.
          </h1>
          
          <p className="text-xl md:text-2xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Log your whole day, see the truth, and pace your path to 10,000 hours.
          </p>
          
          <div className="pt-4">
            <Link 
              href="/sign-up"
              className="inline-block px-8 py-4 text-lg font-semibold rounded-lg transition-all hover:opacity-90"
              style={{ 
                background: 'var(--cta-pink)',
                color: 'white'
              }}
            >
              Start Free
            </Link>
          </div>
          
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No payment required • Free forever
          </p>
        </div>
      </main>
      
      {/* Feature Highlights */}
      <section className="px-4 py-16 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-pink)' }}>
                <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                24-Hour Tracking
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Log every minute of your day. Sleep, work, play—everything matters.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-teal)' }}>
                <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Beautiful Visualizations
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                See patterns emerge with colorful charts and insights.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-blue)' }}>
                <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Mastery Progress
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Track your path to 10,000 hours in any skill you choose.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-violet)' }}>
                <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                AI-Powered Insights
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Get smart summaries and discover time patterns automatically.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="px-4 py-8 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2025 10,000hours.com • Private and free forever
          </p>
        </div>
      </footer>
    </div>
  );
}
