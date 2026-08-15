"use client"

import { useEffect, useState } from "react"
import { Crown, Loader2 } from "lucide-react"

type AccountStatus = {
  email: string
  plan: 'free' | 'premium'
  isPremium: boolean
}

export function PremiumBetaCard() {
  const [account, setAccount] = useState<AccountStatus | null | undefined>(undefined)

  useEffect(() => {
    fetch('/api/account')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Could not load plan')))
      .then(setAccount)
      .catch(() => setAccount(null))
  }, [])

  return (
    <section className="mb-6 border-4 border-mango-dark bg-mango-yellow/15 p-5 shadow-[5px_5px_0px_#1a1a1a]">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-mango-dark bg-mango-yellow">
          <Crown className="h-6 w-6 text-mango-dark" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-widest text-mango-orange">Premium beta</p>
          {account === undefined ? (
            <p className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Checking your access…
            </p>
          ) : account === null ? (
            <p className="mt-2 text-sm font-bold text-mango-red">Could not load your beta status. Refresh the page to try again.</p>
          ) : account.isPremium ? (
            <>
              <h2 className="mt-1 text-xl font-black uppercase text-mango-dark">You&apos;re in</h2>
              <p className="mt-1 text-sm font-medium text-slate-600">AI insights and Daily Recall are enabled for your account.</p>
            </>
          ) : (
            <>
              <h2 className="mt-1 text-xl font-black uppercase text-mango-dark">Request early access</h2>
              <p className="mt-1 text-sm font-medium text-slate-600">
                Premium beta includes AI insights and voice-powered Daily Recall. Email{' '}
                <a className="font-black text-mango-red underline" href="mailto:michelle@michellelawson.me?subject=10%2C000%20Hours%20Premium%20Beta">
                  michelle@michellelawson.me
                </a>{' '}
                and tell Michelle how you use the app.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
