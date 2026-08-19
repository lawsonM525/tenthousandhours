import { Crown, Sparkles } from "lucide-react"

export function PremiumBetaCard() {
  return (
    <section className="mb-6 border-4 border-mango-dark bg-mango-yellow/15 p-5 shadow-[5px_5px_0px_#1a1a1a]">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-mango-dark bg-mango-yellow">
          <Crown className="h-6 w-6 text-mango-dark" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-widest text-mango-orange">Premium coming soon</p>
          <h2 className="mt-1 flex items-center gap-2 text-xl font-black uppercase text-mango-dark">
            Launch features are free <Sparkles className="h-5 w-5 text-[#9373FF]" />
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Daily Recall and AI insights are included for everyone during launch. A future premium plan may add more advanced tools, but your core time tracking stays yours.
          </p>
        </div>
      </div>
    </section>
  )
}
