import Link from "next/link"
import { Navigation } from "@/components/navigation"

export const metadata = {
  title: "Privacy Policy | 10,000 Hours",
  description: "Privacy policy for 10,000 Hours - how we collect, use, and protect your data.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="inline-block bg-mango-dark px-3 py-1 border-2 border-mango-dark transform -rotate-1 mb-4">
            <span className="font-bold text-xs uppercase text-white">Legal</span>
          </div>
          <h1 className="text-4xl font-black uppercase text-mango-dark mb-2">Privacy Policy</h1>
          <p className="text-slate-500 font-bold">Last updated: January 26, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">
              Overview
            </h2>
            <p className="text-slate-600 leading-relaxed mt-4">
              10,000 Hours (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is a time tracking application designed to help you 
              track your progress toward mastery. We are committed to protecting your privacy and being 
              transparent about how we handle your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">
              Information We Collect
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-black text-lg text-mango-dark">Account Information</h3>
                <p className="text-slate-600 leading-relaxed">
                  When you create an account, we collect your email address and authentication credentials 
                  through our authentication provider (Clerk). This is used solely for account management 
                  and authentication purposes.
                </p>
              </div>
              <div>
                <h3 className="font-black text-lg text-mango-dark">Session Data</h3>
                <p className="text-slate-600 leading-relaxed">
                  We store the time tracking sessions you create, including:
                </p>
                <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                  <li>Session start and end times</li>
                  <li>Session duration</li>
                  <li>Session titles and categories you create</li>
                  <li>Notes you add to sessions</li>
                  <li>Session ratings and feedback</li>
                </ul>
              </div>
              <div>
                <h3 className="font-black text-lg text-mango-dark">Analytics Data</h3>
                <p className="text-slate-600 leading-relaxed">
                  We use PostHog for product analytics to understand how users interact with our app. 
                  This helps us improve the user experience. Analytics data includes:
                </p>
                <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                  <li>Page views and feature usage</li>
                  <li>Session completion events</li>
                  <li>General usage patterns</li>
                </ul>
              </div>
              <div>
                <h3 className="font-black text-lg text-mango-dark">Local Storage</h3>
                <p className="text-slate-600 leading-relaxed">
                  Some preferences (display settings, sound settings, etc.) are stored locally in your 
                  browser and are not transmitted to our servers.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside text-slate-600 mt-4 space-y-2">
              <li>To provide and maintain the time tracking service</li>
              <li>To calculate your progress toward the 10,000 hour goal</li>
              <li>To generate insights and analytics about your focus patterns</li>
              <li>To authenticate your account and keep it secure</li>
              <li>To improve our product based on usage patterns</li>
              <li>To respond to support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">
              Data Storage & Security
            </h2>
            <p className="text-slate-600 leading-relaxed mt-4">
              Your data is stored securely using MongoDB with encryption at rest. We use industry-standard 
              security practices to protect your information. Authentication is handled by Clerk, a 
              trusted authentication provider with SOC 2 compliance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">
              Data Sharing
            </h2>
            <p className="text-slate-600 leading-relaxed mt-4">
              We do not sell your personal data. We only share data with:
            </p>
            <ul className="list-disc list-inside text-slate-600 mt-2 space-y-2">
              <li><strong>Clerk</strong> - for authentication services</li>
              <li><strong>MongoDB</strong> - for data storage</li>
              <li><strong>PostHog</strong> - for product analytics</li>
              <li><strong>Vercel</strong> - for hosting and infrastructure</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              These providers are bound by their own privacy policies and data protection agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">
              Your Rights
            </h2>
            <p className="text-slate-600 leading-relaxed mt-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-slate-600 mt-2 space-y-2">
              <li>Access your personal data</li>
              <li>Export your session data</li>
              <li>Delete your account and all associated data</li>
              <li>Opt out of analytics tracking</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              To exercise any of these rights, please contact us through our feedback portal or 
              account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">
              Cookies
            </h2>
            <p className="text-slate-600 leading-relaxed mt-4">
              We use essential cookies for authentication and session management. Analytics cookies 
              from PostHog help us understand product usage. You can disable non-essential cookies 
              in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">
              Changes to This Policy
            </h2>
            <p className="text-slate-600 leading-relaxed mt-4">
              We may update this privacy policy from time to time. We will notify you of any significant 
              changes by posting a notice in the app or sending an email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">
              Contact Us
            </h2>
            <p className="text-slate-600 leading-relaxed mt-4">
              If you have any questions about this privacy policy or our data practices, please reach 
              out through our{" "}
              <a 
                href="https://lwsnlabs.featurebase.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-mango-red font-bold hover:underline"
              >
                feedback portal
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t-2 border-mango-dark/20">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 font-bold text-mango-dark hover:text-mango-red transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
