'use client';

import React from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '@/config/site';
import { Shield, Sparkles, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border mt-auto transition-colors">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-heading text-2xl font-bold tracking-tight text-text">
                {SITE_CONFIG.name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/15 text-accent border border-accent/30 uppercase tracking-widest">
                Dubai Stage 1
              </span>
            </Link>

            <p className="text-xs text-muted leading-relaxed max-w-sm">
              The Middle East’s first video-first marketplace for inspected luxury supercars, bespoke SUVs, and hypercars. Built for verified Dubai dealers and private collectors.
            </p>

            <div className="space-y-2 text-xs text-muted pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>{SITE_CONFIG.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="hover:text-accent transition-colors">
                  {SITE_CONFIG.supportEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                <a href={`tel:${SITE_CONFIG.supportPhone}`} className="hover:text-accent transition-colors">
                  {SITE_CONFIG.supportPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link href="/feed" className="hover:text-accent transition-colors">
                  Featured Reels
                </Link>
              </li>
              <li>
                <Link href="/dashboard/new-listing" className="hover:text-accent transition-colors">
                  Post a Luxury Car
                </Link>
              </li>
              <li>
                <Link href="/#upload-paths" className="hover:text-accent transition-colors">
                  The 3 Upload Paths
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-accent transition-colors">
                  How Video-First Works
                </Link>
              </li>
              <li>
                <Link href="/#dealers" className="hover:text-accent transition-colors">
                  Request Dealer Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Seller / Dealer */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Portals</h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link href="/dashboard" className="hover:text-accent transition-colors">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-accent transition-colors">
                  Admin & Moderation
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-accent transition-colors">
                  Demo Role Switcher
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-accent transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance (English + Arabic) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Legal & Compliance</h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link href="/terms" className="hover:text-accent transition-colors">
                  Terms of Service (English)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent transition-colors">
                  Privacy Policy (English)
                </Link>
              </li>
              <li className="pt-1 border-t border-border/40">
                <Link href="/ar/terms" className="text-accent hover:underline flex items-center gap-1 font-medium" dir="rtl">
                  <span>الشروط والأحكام (العربية)</span>
                </Link>
              </li>
              <li>
                <Link href="/ar/privacy" className="text-accent hover:underline flex items-center gap-1 font-medium" dir="rtl">
                  <span>سياسة الخصوصية (العربية)</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name} UAE. Registered in the Dubai International Financial Centre (DIFC). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[11px] text-accent font-medium">
              <Shield className="w-3.5 h-3.5" />
              100% Inspected & DED Verified
            </span>
            <span>•</span>
            <span className="text-[11px] text-muted">
              Photos never become video
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
