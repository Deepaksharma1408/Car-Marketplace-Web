'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';
import { SITE_CONFIG } from '@/config/site';
import { 
  Plus, 
  Menu, 
  X, 
  Smartphone, 
  LayoutDashboard, 
  User, 
  LogOut,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

export function Navbar() {
  const pathname = usePathname();
  const { role, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appModalOpen, setAppModalOpen] = useState(false);

  const isAuth = role !== 'guest' && user;

  const navLinks = [
    { label: 'Watch Feed', href: '/feed' },
    { label: 'Saved Cars', href: '/saved' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Upload Paths', href: '/#upload-paths' },
    { label: 'For Dealers', href: '/#dealers' },
    { label: 'FAQ', href: '/#faq' },
  ];

  return (
    <>
      <header className="sticky top-[31px] z-40 w-full glass-nav transition-all">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent via-[#B89248] to-[#8F6C26] p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-surface rounded-[10px] flex items-center justify-center">
                <img src="/vehicle-spot-mark.svg" alt="" width={32} height={32} className="w-8 h-8" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-text flex items-center gap-1.5">
                {SITE_CONFIG.name}
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-accent/90 -mt-1">
                Dubai Supercars
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs xl:text-sm font-medium text-muted hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Get the App button */}
            <button
              onClick={() => setAppModalOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-text hover:text-accent bg-surface-2/70 hover:bg-surface-2 border border-border flex items-center gap-1.5 transition-all"
            >
              <Smartphone className="w-3.5 h-3.5 text-accent" />
              <span>Get the App</span>
            </button>

            {/* Dashboard / Auth CTA */}
            {isAuth ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-2 text-text border border-border hover:border-accent/40 flex items-center gap-2 transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-accent-2" />
                  <span>Dashboard</span>
                  {role === 'dealer' && (
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  )}
                </Link>

                <Link
                  href="/dashboard/new-listing"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-accent to-[#C49B55] hover:from-accent-hover hover:to-accent text-bg font-bold flex items-center gap-1.5 shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Post a Car</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text hover:text-accent transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard/new-listing"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-accent to-[#C49B55] text-bg font-bold flex items-center gap-1.5 shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Post a Car</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-surface-2 border border-border text-text hover:text-accent transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-modal border-b border-border px-4 py-6 space-y-4 animate-in slide-in-from-top-4">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-text hover:text-accent hover:bg-surface-2 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-border flex flex-col gap-2.5">
              <div className="flex items-center justify-between py-2 px-1 border-b border-border/50">
                <span className="text-xs text-muted font-medium">Color Theme:</span>
                <ThemeSwitcher compact={false} />
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAppModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-text bg-surface-2 border border-border flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-accent" />
                <span>Get {SITE_CONFIG.name} Mobile App</span>
              </button>

              <Link
                href="/dashboard/new-listing"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl text-sm font-bold bg-accent text-bg flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Post a Car for Sale</span>
              </Link>

              {isAuth ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-text bg-surface-2 border border-border flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-accent-2" />
                  <span>Go to Seller Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-text text-center hover:text-accent"
                >
                  Sign In / Demo Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* App Download Modal (Mock) */}
      {appModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-surface border border-border max-w-md w-full rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setAppModalOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-text p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center mx-auto">
                <Smartphone className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-text">Get the {SITE_CONFIG.name} Mobile App</h3>
                <p className="text-xs text-muted mt-1 max-w-xs mx-auto">
                  Experience Dubai&apos;s infinite vertical supercar feed with immersive haptic reels and instant RTA check.
                </p>
              </div>

              {/* QR Code Simulation */}
              <div className="p-4 bg-surface-2 rounded-xl border border-border w-48 h-48 mx-auto flex flex-col items-center justify-center">
                <div className="grid grid-cols-5 gap-1.5 p-2 bg-[#0A0C10] rounded-lg">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-5 h-5 rounded-sm ${i % 2 === 0 || i % 5 === 0 ? 'bg-accent' : 'bg-surface-3'}`} 
                    />
                  ))}
                </div>
                <span className="text-[10px] text-muted font-medium mt-2">Scan with iPhone or Android</span>
              </div>

              {/* App store buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    alert('Mock Demo: App Store link opened! In production, this redirects to the official iOS App Store.');
                    setAppModalOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-text text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-0.93 2.74 1 .08 2.01-.49 2.63-1.24z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] text-muted -mb-0.5">Download on the</p>
                    <p className="text-xs font-bold leading-tight">App Store</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    alert('Mock Demo: Google Play link opened! In production, this redirects to the Google Play Store.');
                    setAppModalOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-text text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186a2.38 2.38 0 01-.61-.926V2.74c.14-.368.36-.69.61-.926zM15.207 13.414l2.586 2.586-12.01 6.945 9.424-9.531zm0-2.828L5.783 1.055l12.01 6.945-2.586 2.586zm1.414 1.414l3.18-1.838a1.5 1.5 0 010 2.648l-3.18-1.81z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] text-muted -mb-0.5">GET IT ON</p>
                    <p className="text-xs font-bold leading-tight">Google Play</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
