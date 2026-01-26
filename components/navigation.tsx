"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";
import { LiveSessionIndicator } from "./live-session-indicator";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-4 border-mango-dark bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 h-16 sm:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
          <Image 
            src="/logo.svg" 
            alt="10,000 Hours" 
            width={36} 
            height={36} 
            className="sm:w-12 sm:h-12 transform -rotate-3 transition-transform group-hover:rotate-0"
          />
          <span className="font-bold text-lg sm:text-2xl tracking-tighter uppercase italic text-mango-dark">10,000HOURS</span>
        </Link>
        
        {/* Live Session Indicator - hidden on mobile */}
        <div className="hidden sm:block">
          <LiveSessionIndicator />
        </div>
        
        {/* Desktop Right side */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 font-bold text-xs uppercase tracking-widest text-mango-dark">
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

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 border-2 border-mango-dark bg-white"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-mango-dark" />
          ) : (
            <Menu className="w-6 h-6 text-mango-dark" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-mango-dark bg-white">
          <nav className="flex flex-col p-4 space-y-3">
            <Link 
              href="/memento-mori" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-bold text-sm uppercase tracking-widest text-mango-dark hover:text-mango-red transition-colors py-2"
            >
              Memento Mori
            </Link>
            <Link 
              href="/know-thyself" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-bold text-sm uppercase tracking-widest text-mango-dark hover:text-mango-red transition-colors py-2"
            >
              Know Thyself
            </Link>
            
            <div className="pt-3 border-t-2 border-mango-dark/20">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="w-full bg-mango-orange hover:bg-mango-yellow text-mango-dark px-4 py-3 border-2 border-mango-dark font-bold text-base uppercase shadow-[3px_3px_0px_#000] transition-all">
                    Launch App
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-between gap-4">
                  <Link 
                    href="/app/now"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center bg-mango-orange hover:bg-mango-yellow text-mango-dark px-4 py-3 border-2 border-mango-dark font-bold text-base uppercase shadow-[3px_3px_0px_#000] transition-all"
                  >
                    Launch App
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

