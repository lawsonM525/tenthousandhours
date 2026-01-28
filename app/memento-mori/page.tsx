"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import Link from "next/link";
import Script from "next/script";

const LIFE_EXPECTANCY = {
  male: 75.8,
  female: 81.1,
};

export default function MementoMoriPage() {
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const calculateDaysLeft = () => {
    if (!birthDate || !gender) return;

    const birth = new Date(birthDate);
    const today = new Date();
    const expectancy = LIFE_EXPECTANCY[gender];
    
    // Calculate expected death date
    const expectedDeathDate = new Date(birth);
    expectedDeathDate.setFullYear(birth.getFullYear() + Math.floor(expectancy));
    expectedDeathDate.setMonth(birth.getMonth() + Math.round((expectancy % 1) * 12));
    
    // Calculate days remaining
    const msPerDay = 1000 * 60 * 60 * 24;
    const remaining = Math.ceil((expectedDeathDate.getTime() - today.getTime()) / msPerDay);
    
    setDaysLeft(Math.max(0, remaining));
    setShowResult(true);
  };

  const reset = () => {
    setShowResult(false);
    setDaysLeft(null);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Memento Mori Calculator",
    "description": "Calculate your remaining days based on life expectancy. A tool to gain perspective on mortality and make every day count.",
    "url": "https://tenthousandhours.app/memento-mori",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-screen mango-pattern text-mango-dark font-sans selection:bg-mango-orange selection:text-white">
      <Script
        id="memento-mori-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        {!showResult ? (
          <>
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-block bg-mango-red px-4 py-1 border-2 border-mango-dark transform -rotate-1 mb-8">
                <span className="font-bold text-sm uppercase text-white">Remember you will die</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black leading-none uppercase text-white drop-shadow-[4px_4px_0px_#1a1a1a] mb-6">
                Memento <span className="text-mango-yellow italic">Mori</span>
              </h1>
              
              <p className="text-xl font-medium text-mango-dark bg-white/40 p-6 border-l-4 border-mango-dark backdrop-blur-sm max-w-2xl mx-auto">
                Life is finite. Knowing how many days you have left can transform how you spend each one.
              </p>
            </div>

            {/* Form Card */}
            <div className="distressed-card p-8 lg:p-12 max-w-xl mx-auto">
              <h2 className="font-black text-2xl uppercase mb-8 text-center">Calculate Your Days</h2>
              
              <div className="space-y-6">
                {/* Date of Birth */}
                <div>
                  <label className="block font-bold text-sm uppercase tracking-widest mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-mango-dark bg-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-mango-orange appearance-none text-left"
                    style={{ textAlign: 'left' }}
                  />
                </div>

                {/* Gender Selection */}
                <div>
                  <label className="block font-bold text-sm uppercase tracking-widest mb-3">
                    Gender
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      className={`flex-1 px-6 py-4 border-2 border-mango-dark font-bold text-lg uppercase transition-all ${
                        gender === "male"
                          ? "bg-mango-dark text-white shadow-[4px_4px_0px_#FFB31A]"
                          : "bg-white hover:bg-mango-yellow/20"
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      className={`flex-1 px-6 py-4 border-2 border-mango-dark font-bold text-lg uppercase transition-all ${
                        gender === "female"
                          ? "bg-mango-dark text-white shadow-[4px_4px_0px_#FFB31A]"
                          : "bg-white hover:bg-mango-yellow/20"
                      }`}
                    >
                      Female
                    </button>
                  </div>
                  <p className="text-xs text-mango-dark/60 mt-2">
                    US life expectancy: Male 75.8 years, Female 81.1 years
                  </p>
                </div>

                {/* Calculate Button */}
                <button
                  onClick={calculateDaysLeft}
                  disabled={!birthDate || !gender}
                  className="w-full px-8 py-5 bg-mango-red text-white border-2 border-mango-dark font-black text-2xl uppercase shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-4"
                >
                  Reveal My Days
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Result Section */}
            <div className="text-center">
              <div className="inline-block bg-mango-dark px-4 py-1 border-2 border-white transform rotate-1 mb-8">
                <span className="font-bold text-sm uppercase text-mango-yellow">Your remaining time</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-black uppercase text-white drop-shadow-[4px_4px_0px_#1a1a1a] mb-8">
                You have approximately
              </h1>
              
              {/* Big Number Display */}
              <div className="distressed-card p-8 lg:p-16 max-w-3xl mx-auto mb-6 transform -rotate-1">
                <div className="text-7xl lg:text-9xl font-black text-mango-red tabular-nums">
                  {daysLeft?.toLocaleString()}
                </div>
                <div className="text-3xl lg:text-4xl font-black uppercase text-mango-dark mt-4">
                  Days Left
                </div>
              </div>
              
              

              {/* Perspective Stats */}
              <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-16">
                <div className="bg-white/90 border-2 border-mango-dark p-6 shadow-[4px_4px_0px_#000]">
                  <div className="text-3xl font-black text-mango-orange">
                    {daysLeft ? Math.floor(daysLeft / 7).toLocaleString() : 0}
                  </div>
                  <div className="font-bold text-sm uppercase">Weeks</div>
                </div>
                <div className="bg-white/90 border-2 border-mango-dark p-6 shadow-[4px_4px_0px_#000]">
                  <div className="text-3xl font-black text-mango-yellow">
                    {daysLeft ? Math.floor(daysLeft / 30).toLocaleString() : 0}
                  </div>
                  <div className="font-bold text-sm uppercase">Months</div>
                </div>
                <div className="bg-white/90 border-2 border-mango-dark p-6 shadow-[4px_4px_0px_#000]">
                  <div className="text-3xl font-black text-mango-green">
                    {daysLeft ? (daysLeft / 365).toFixed(1) : 0}
                  </div>
                  <div className="font-bold text-sm uppercase">Years</div>
                </div>
              </div>

              {/* Screenshot Prompt */}
              <p className="text-mango-dark/80 font-bold text-sm uppercase tracking-widest mb-12 flex items-center justify-center gap-2">
                <span className="text-lg">📸</span> Screenshot this. Put it somewhere you&apos;ll see it daily.
              </p>

              {/* CTA */}
              <div className="bg-mango-dark border-4 border-white shadow-[12px_12px_0px_#FFB31A] p-12 max-w-2xl mx-auto">
                <h2 className="font-black text-6xl lg:text-8xl uppercase text-white mb-8">
                  LIVE.
                </h2>
                <p className="text-lg text-white/60 mb-8 max-w-md mx-auto">
                  Every day is a gift. Make each one count by tracking how you spend your precious time.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/app/now"
                    className="px-10 py-5 bg-mango-yellow text-mango-dark border-2 border-white font-black text-xl uppercase hover:scale-105 transition-all shadow-[6px_6px_0px_#E62E2D]"
                  >
                    Start Tracking
                  </Link>
                  <button
                    onClick={reset}
                    className="px-10 py-5 bg-transparent text-white border-2 border-white font-bold text-xl uppercase hover:bg-white/10 transition-all"
                  >
                    Recalculate
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
