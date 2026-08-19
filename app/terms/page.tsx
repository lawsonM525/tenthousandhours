import Link from "next/link"
import { Navigation } from "@/components/navigation"

export const metadata = {
  title: "Terms of Use | 10,000 Hours",
  description: "Terms governing your use of the 10,000 Hours website and mobile application.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="inline-block bg-mango-dark px-3 py-1 border-2 border-mango-dark -rotate-1 mb-4">
            <span className="font-bold text-xs uppercase text-white">Legal</span>
          </div>
          <h1 className="text-4xl font-black uppercase text-mango-dark mb-2">Terms of Use</h1>
          <p className="text-slate-500 font-bold">Last updated: August 17, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">Agreement</h2>
            <p className="mt-4">
              These Terms govern your use of the 10,000 Hours website and mobile application. By creating
              an account or using the service, you agree to these Terms and our <Link href="/privacy" className="font-bold text-mango-red underline">Privacy Policy</Link>.
              If you do not agree, do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">Accounts</h2>
            <p className="mt-4">
              You must be at least 18 years old and legally permitted to use the service. You are responsible
              for the accuracy of your account information, for protecting your sign-in credentials, and for
              activity performed through your account. Contact us promptly if you believe your account has
              been accessed without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">The Service</h2>
            <p className="mt-4">
              10,000 Hours helps you record sessions, organize categories, review progress, and optionally use
              calendar and AI-assisted features. Features may change as the product improves. We may suspend
              the service temporarily for security, maintenance, or circumstances outside our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">Your Content</h2>
            <p className="mt-4">
              You retain ownership of session titles, notes, recordings, and other content you provide. You
              give us permission to process that content only as needed to operate, secure, and improve the
              features you request. Optional integrations and AI features handle data as described in the
              Privacy Policy. You may delete your account from the app settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">AI Features</h2>
            <p className="mt-4">
              AI-generated summaries, transcriptions, and suggested sessions may be incomplete or inaccurate.
              They are provided as drafting tools, not professional advice. Daily Recall suggestions are not
              saved to your timeline until you review and confirm them. Do not submit sensitive information
              you do not want processed by the providers identified in our Privacy Policy. AI features are
              available to signed-in users and may be subject to reasonable usage limits to protect service
              availability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">Acceptable Use</h2>
            <p className="mt-4">
              Do not misuse the service, interfere with its operation, attempt unauthorized access, upload
              unlawful or malicious content, impersonate others, or use the service in a way that violates
              another person&apos;s rights or applicable law. We may limit or terminate access when reasonably
              necessary to protect users or the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">App Store Terms</h2>
            <p className="mt-4">
              If you download the iOS app from Apple&apos;s App Store, Apple&apos;s standard licensed application end
              user license agreement applies to the app license. Apple is not responsible for providing support
              for the service. These Terms govern your 10,000 Hours account and use of our service to the extent
              they do not conflict with Apple&apos;s applicable terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">Disclaimers and Liability</h2>
            <p className="mt-4">
              The service is provided on an “as is” and “as available” basis to the extent permitted by law.
              We do not guarantee uninterrupted operation or that AI output will be accurate. To the maximum
              extent permitted by law, 10,000 Hours is not liable for indirect, incidental, special,
              consequential, or punitive damages arising from your use of the service. Nothing in these Terms
              excludes rights or liability that cannot legally be excluded.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-mango-dark border-b-4 border-mango-yellow pb-2">Changes and Contact</h2>
            <p className="mt-4">
              We may update these Terms as the service changes. We will post the revised date here and provide
              additional notice when required. Questions can be sent to{" "}
              <a href="mailto:michelle@michellelawson.me" className="font-bold text-mango-red underline">michelle@michellelawson.me</a> or through our{" "}
              <Link href="/support" className="font-bold text-mango-red underline">Support page</Link>.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
