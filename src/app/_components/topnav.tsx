"use client";

import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function TopNav() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simple loading state for SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 w-full bg-black/40 backdrop-blur-md text-gray-200 px-10 py-3 flex items-center justify-between z-50">
        {/* Logo skeleton */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-600 rounded-sm animate-pulse mr-2"></div>
          <div className="w-24 h-6 bg-gray-600 rounded animate-pulse"></div>
        </div>

        {/* Navigation links skeleton */}
        <div className="flex gap-10 text-sm uppercase tracking-wide absolute left-1/2 transform -translate-x-1/2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-12 h-4 bg-gray-600 rounded animate-pulse"></div>
          ))}
        </div>

        {/* Auth button skeleton */}
        <div className="w-20 h-8 bg-gray-600 rounded-sm animate-pulse"></div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/40 backdrop-blur-md text-gray-200 px-10 py-3 flex items-center justify-between z-50">
      {/* Left side - Logo */}
      <div className="flex items-center">
        <a href="#home" className="flex items-center gap-2">
          <Image
            src="/game_logo.png"
            alt="GameVault Logo"
            width={40}
            height={40}
            priority
            className="rounded-sm"
          />
          <span className="text-2xl font-bold tracking-wide text-white hover:text-blue-400 transition">
            HeavensPlay
          </span>
        </a>
      </div>

      
      {/* Right side - Auth */}
      <div className="flex items-center">
        <SignedIn>
          <UserButton 
            appearance={{ 
              elements: { 
                avatarBox: "w-9 h-9"
              } 
            }} 
          />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-1 border border-gray-400 rounded-sm text-sm text-gray-200 hover:bg-gray-700/70 hover:text-white transition">
              Login
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
}