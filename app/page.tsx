import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-hero font-semibold text-text-primary">
            know where your time goes. master what matters.
          </h1>
          <p className="text-h3 text-text-secondary max-w-2xl mx-auto">
            log your whole day, see the truth, and pace your path to 10,000 hours.
          </p>
        </div>

        {/* CTA */}
        <div className="pt-4">
          <Link href="/app">
            <Button size="lg" className="text-h3 px-8 py-6 h-auto">
              start free
            </Button>
          </Link>
          <p className="text-label text-text-muted mt-3">
            free forever. no payment required.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
          <FeatureCard 
            title="24-hour tracking"
            description="log sleep, work, life—everything that matters"
          />
          <FeatureCard 
            title="beautiful insights"
            description="charts and patterns that reveal truth"
          />
          <FeatureCard 
            title="mastery progress"
            description="track your path to 10,000 hours"
          />
          <FeatureCard 
            title="private & free"
            description="your data stays yours, always"
          />
        </div>
      </div>
    </main>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-component p-6 text-left">
      <h3 className="text-h3 text-text-primary mb-2">{title}</h3>
      <p className="text-body text-text-secondary">{description}</p>
    </div>
  )
}
