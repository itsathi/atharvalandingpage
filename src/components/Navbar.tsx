"use client";

import { Home, ChartColumnIncreasing, Link as LinkIcon, BookImage, Menu, X } from "lucide-react";

import Link from "next/link";
import { useState } from "react";

// Fix: Ensure filename and export are consistent (should be Navbar not navbar)
// If you import { Navbar } from "@/components/navbar", then file must be Navbar.tsx (uppercase N) to work
// Solution for error: make sure this file is saved as Navbar.tsx
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Fixed Top Header Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50  backdrop-blur-sm border-b border-border md:hidden h-14 flex items-center px-4">
        <div className="flex items-center justify-between w-full">
          {/* Logo/Title */}
          <div className="text-sm font-medium truncate">
            Atharva Acharya
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
       
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg border hover:bg-accent"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Collapsible Dropdown Menu */}
      {isOpen && (
        <div className="fixed top-14 left-0 right-0 z-40 md:hidden bg-background border-b border-border shadow-lg">
          <div className="px-4 py-2 space-y-1 max-h-80 overflow-y-auto">
            <div className="px-2 py-2 border-b border-border mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Admin Panel
              </h3>
            </div>
            
            <Link 
              href="/admin/dashboard" 
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent rounded-lg transition-colors block"
              onClick={() => setIsOpen(false)}
              passHref
            >
              <span className="flex items-center gap-3">
                <Home className="h-4 w-4 flex-shrink-0" />
                Home
              </span>
            </Link>
            
            <Link 
              href="/admin/analytics" 
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent rounded-lg transition-colors block"
              onClick={() => setIsOpen(false)}
              passHref
            >
              <span className="flex items-center gap-3">
                <ChartColumnIncreasing className="h-4 w-4 flex-shrink-0" />
                Analytics
              </span>
            </Link>
            
            <Link 
              href="/admin/links" 
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent rounded-lg transition-colors block"
              onClick={() => setIsOpen(false)}
              passHref
            >
              <span className="flex items-center gap-3">
                <LinkIcon className="h-4 w-4 flex-shrink-0" />
                Links
              </span>
            </Link>
            
            <Link 
              href="/admin/content" 
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent rounded-lg transition-colors block"
              onClick={() => setIsOpen(false)}
              passHref
            >
              <span className="flex items-center gap-3">
                <BookImage className="h-4 w-4 flex-shrink-0" />
                About
              </span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
