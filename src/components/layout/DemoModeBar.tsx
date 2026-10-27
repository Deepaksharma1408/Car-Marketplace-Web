'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';
import { useToast } from '@/components/ui/Toast';
import { resetStoreToDefaults } from '@/lib/mockApi';
import { UserRole } from '@/types';
import { 
  ShieldCheck, 
  User as UserIcon, 
  Building2, 
  Eye, 
  RotateCcw, 
  ChevronDown, 
  Sparkles,
  LayoutDashboard,
  ShieldAlert,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

export function DemoModeBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { role, user, switchRole } = useAuthStore();
  const { success, info } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
    {
      role: 'guest',
      label: 'Guest Visitor',
      icon: <Eye className="w-3.5 h-3.5" />,
      desc: 'Browsing public listings & landing page without authentication',
      color: 'bg-muted/20 text-muted border-border',
    },
    {
      role: 'individual',
      label: 'Individual Seller',
      icon: <UserIcon className="w-3.5 h-3.5" />,
      desc: 'Hamdan Al-Maktoum: listings, social car videos, WhatsApp leads',
      color: 'bg-accent-2/15 text-accent-2 border-accent-2/30',
    },
    {
      role: 'dealer',
      label: 'Verified Dealer',
      icon: <Building2 className="w-3.5 h-3.5" />,
      desc: 'Al-Futtaim Prestige: trade license, inventory, dealer badge',
      color: 'bg-accent/15 text-accent border-accent/40',
    },
    {
      role: 'admin',
      label: 'Admin / Moderator',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      desc: 'Sarah Connor: review queue, dealer verification, logs, config',
      color: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    },
  ];

  const handleRoleSelect = (targetRole: UserRole) => {
    switchRole(targetRole);
    setIsOpen(false);
    success(`Switched role to ${targetRole.toUpperCase()}`, `Now acting as ${targetRole === 'guest' ? 'unauthenticated buyer' : targetRole === 'individual' ? 'Hamdan (Individual Seller)' : targetRole === 'dealer' ? 'Al-Futtaim Prestige (Dealer)' : 'Sarah Connor (Admin)'}`);
    
    // Smooth redirect if in protected route
    if (targetRole === 'admin' && !pathname.startsWith('/admin')) {
      router.push('/admin');
    } else if (targetRole === 'dealer' && pathname.startsWith('/admin')) {
      router.push('/dashboard');
    } else if (targetRole === 'individual' && pathname.startsWith('/admin')) {
      router.push('/dashboard');
    } else if (targetRole === 'guest' && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
      router.push('/');
    }
  };

  const handleResetData = async () => {
    if (confirm('Reset all demo listings, verifications, and analytics to factory mocks?')) {
      setIsResetting(true);
      await resetStoreToDefaults();
      setIsResetting(false);
      info('Mock database reset to defaults', 'Reloading page to refresh all active states...');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const currentRoleConfig = roles.find((r) => r.role === role) || roles[0];

  return (
    <aside aria-label="Demo Role Switcher" className="sticky top-0 z-[100] w-full bg-surface-2/95 backdrop-blur-md border-b border-border py-1.5 text-xs transition-colors">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Left: Brand / Demo Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent font-semibold tracking-wider uppercase text-[10px]">
            <Sparkles className="w-3 h-3 text-accent animate-pulse" />
            <span>Demo Mode</span>
          </div>
          <span className="hidden sm:inline text-muted">|</span>
          <span className="hidden md:inline text-muted truncate">
            Vehicle Spot Dubai Luxury Prototype (Frontend-Only, LocalStorage Persisted)
          </span>
        </div>

        {/* Center / Right: Theme Switcher + Active Role Switcher Pill */}
        <div className="flex items-center gap-2.5">
          {/* Quick links to primary pages */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-muted mr-1">
            <Link 
              href="/dashboard" 
              className={`px-2 py-0.5 rounded hover:text-text transition-colors flex items-center gap-1 ${pathname.startsWith('/dashboard') && !pathname.includes('new-listing') ? 'text-accent font-medium' : ''}`}
            >
              <LayoutDashboard className="w-3 h-3" />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/dashboard/new-listing" 
              className={`px-2 py-0.5 rounded hover:text-text transition-colors flex items-center gap-1 ${pathname.includes('new-listing') ? 'text-accent font-medium' : ''}`}
            >
              <PlusCircle className="w-3 h-3 text-accent" />
              <span>New Listing Wizard</span>
            </Link>
            <Link 
              href="/admin" 
              className={`px-2 py-0.5 rounded hover:text-text transition-colors flex items-center gap-1 ${pathname.startsWith('/admin') ? 'text-accent-2 font-medium' : ''}`}
            >
              <ShieldAlert className="w-3 h-3 text-accent-2" />
              <span>Admin Panel</span>
            </Link>
          </div>

          {/* Theme Selector */}
          <ThemeSwitcher compact={true} />

          {/* Role Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${currentRoleConfig.color}`}
            >
              {currentRoleConfig.icon}
              <span className="font-semibold">{currentRoleConfig.label}</span>
              {user && role !== 'guest' && (
                <span className="hidden sm:inline opacity-80">({user.name.split(' ')[0]})</span>
              )}
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
            </button>

            {isOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-surface border border-border p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1.5 border-b border-border/60 mb-1">
                    <p className="text-[11px] font-semibold text-text uppercase tracking-wider">Switch Simulated Role</p>
                    <p className="text-[10px] text-muted">Test individual seller, dealer, or admin privileges instantly</p>
                  </div>
                  <div className="space-y-1">
                    {roles.map((r) => {
                      const isSelected = r.role === role;
                      return (
                        <button
                          key={r.role}
                          onClick={() => handleRoleSelect(r.role)}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors ${
                            isSelected 
                              ? 'bg-accent/15 border border-accent/30 text-text' 
                              : 'hover:bg-surface-2 text-muted hover:text-text'
                          }`}
                        >
                          <div className={`mt-0.5 p-1 rounded-md border ${r.color}`}>
                            {r.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-semibold ${isSelected ? 'text-accent' : 'text-text'}`}>
                                {r.label}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-medium text-accent">Active</span>
                              )}
                            </div>
                            <p className="text-[10px] text-muted line-clamp-1 mt-0.5 leading-snug">
                              {r.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between px-1">
                    <button
                      onClick={handleResetData}
                      disabled={isResetting}
                      className="text-[11px] text-muted hover:text-danger flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
                      <span>Reset Mock Data</span>
                    </button>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-[11px] text-accent hover:underline flex items-center gap-1"
                    >
                      <span>Auth Screens</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
