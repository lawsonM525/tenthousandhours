import { MessageSquare, ExternalLink } from "lucide-react"

export default function SupportSettingsPage() {
  const supportLinks = [
    {
      title: "Feature Requests & Feedback",
      description: "Share your ideas and vote on features",
      href: "https://lwsnlabs.featurebase.app",
      icon: MessageSquare,
      color: "bg-mango-yellow",
    }, 
  ]

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b-4 border-mango-dark px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-mango-red px-3 py-1 border-2 border-mango-dark transform -rotate-1 mb-2">
            <span className="font-bold text-xs uppercase text-white">Get Help</span>
          </div>
          <h1 className="text-3xl font-black uppercase text-mango-dark">Support</h1>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Support Links */}
          <div className="grid gap-4">
            {supportLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.title}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="distressed-card p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1a1a1a] transition-all group"
                >
                  <div className={`w-14 h-14 ${link.color} border-2 border-mango-dark flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-mango-dark" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg uppercase text-mango-dark group-hover:text-mango-red transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-sm text-mango-dark/60">{link.description}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-mango-dark/40 group-hover:text-mango-red transition-colors" />
                </a>
              )
            })}
          </div>

          {/* FAQ Section */}
          <div className="distressed-card p-6">
            <h2 className="font-black text-lg uppercase text-mango-dark mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="border-b border-mango-dark/20 pb-4">
                <h3 className="font-bold text-mango-dark mb-1">How does the 10,000 hour rule work?</h3>
                <p className="text-sm text-mango-dark/70">
                  The 10,000 hour rule suggests that mastery in any field requires approximately 10,000 hours of deliberate practice. 
                  Our app helps you track your progress toward mastery in any skill.
                </p>
              </div>
              <div className="border-b border-mango-dark/20 pb-4">
                <h3 className="font-bold text-mango-dark mb-1">Is my data synced across devices?</h3>
                <p className="text-sm text-mango-dark/70">
                  Yes! Your sessions, categories, and notes are synced to your account and accessible from any device where you&apos;re signed in.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-mango-dark mb-1">Can I export my data?</h3>
                <p className="text-sm text-mango-dark/70">
                  Data export is coming soon. You&apos;ll be able to download all your sessions and insights in CSV format.
                </p>
              </div>
            </div>
          </div>

          {/* Version Info */}
          <div className="text-center text-sm text-mango-dark/40 font-bold uppercase tracking-widest">
            10,000 Hours v1.0.0
          </div>
        </div>
      </div>
    </div>
  )
}
