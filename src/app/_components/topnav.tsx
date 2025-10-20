"use client";

import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function TopNav() {
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
            GameVault
          </span>
        </a>
      </div>

      {/* Center - Navigation Links (Centered) */}
      <div className="flex gap-10 text-sm uppercase tracking-wide absolute left-1/2 transform -translate-x-1/2">
        <a href="#" className="hover:text-white transition">
          Home
        </a>
        <a href="#store" className="hover:text-white transition">
          Store
        </a>
        <a href="#games" className="hover:text-white transition">
          Games
        </a>
        <a href="#news" className="hover:text-white transition">
          News
        </a>
        <a href="#about" className="hover:text-white transition">
          About
        </a>
      </div>

      {/* Right side - Auth */}
      <div className="flex items-center">
        <SignedIn>
          <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
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
