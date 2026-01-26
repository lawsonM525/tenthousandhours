"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";
import { LiveSessionIndicator } from "./live-session-indicator";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-mango-dark bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <Image 
            src="/logo.svg" 
            alt="10,000 Hours" 
            width={48} 
            height={48} 
            className="transform -rotate-3 transition-transform group-hover:rotate-0"
          />
          <span className="font-bold text-2xl tracking-tighter uppercase italic text-mango-dark">10,000HOURS</span>
        </Link>
        
        {/* Live Session Indicator */}
        <LiveSessionIndicator />
        
        {/* Right side */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 font-bold text-xs uppercase tracking-widest text-mango-dark">
            <Link href="/memento-mori" className="hover:text-mango-red transition-colors">Memento Mori</Link>
            <Link href="/know-thyself" className="hover:text-mango-red transition-colors">Know Thyself</Link>
          </nav>
          
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="bg-mango-orange hover:bg-mango-yellow text-mango-dark px-6 py-2.5 rounded-sm border-2 border-mango-dark font-bold text-lg uppercase shadow-[4px_4px_0px_#000] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none">
                Launch App
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link 
              href="/app/now"
              className="bg-mango-orange hover:bg-mango-yellow text-mango-dark px-6 py-2.5 rounded-sm border-2 border-mango-dark font-bold text-lg uppercase shadow-[4px_4px_0px_#000] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Launch App
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

