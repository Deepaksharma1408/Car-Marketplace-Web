import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SITE_CONFIG } from '@/config/site';
import { Shield, FileText, Globe } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full text-xs text-muted leading-relaxed space-y-8">
        <div className="border-b border-border pb-6 flex items-start justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent/15 border border-accent/30 text-accent uppercase tracking-wider">
              Legal Compliance
            </span>
            <h1 className="font-heading text-3xl font-bold text-text mt-2">
              Terms & Conditions of Service
            </h1>
            <p className="text-xs text-muted mt-1">
              Last updated: October 2026 • Governing Law: Dubai, United Arab Emirates (DIFC)
            </p>
          </div>

          <Link
            href="/ar/terms"
            className="px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-accent font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
            dir="rtl"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>عرض باللغة العربية (RTL)</span>
          </Link>
        </div>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">1. Scope of the Platform (Stage 1 Dubai)</h2>
          <p>
            {SITE_CONFIG.name} operates as a video-first technological platform providing digital marketing services and classified showcases for motor vehicles physically located within the Emirate of Dubai, United Arab Emirates. {SITE_CONFIG.name} is not an automotive dealership, licensed broker, direct vendor, or escrow agent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">2. Truth in Advertising & Media Integrity</h2>
          <p>
            All listings submitted to {SITE_CONFIG.name} must depict the exact physical vehicle offered for sale. Digital altering, deceptive filtering, or generative modification of the vehicle's paint, odometer, body panels, or mechanical condition is strictly prohibited. Listings created under <strong>Path C (Photos Only)</strong> are guaranteed to remain static photography and shall never be converted into automated video slideshows without explicit seller authorization.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">3. Dealership Verification Requirements</h2>
          <p>
            Commercial dealerships operating on {SITE_CONFIG.name} must provide a valid commercial trade license issued by the Dubai Department of Economy and Tourism (DED). Dealerships agree to maintain active commercial registration throughout the duration of their listings. {SITE_CONFIG.name} reserves the right to suspend or revoke verified status if licensing lapses.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">4. Direct Buyer Communications</h2>
          <p>
            {SITE_CONFIG.name} facilitates direct communication via third-party telecommunications protocols (WhatsApp and cellular telephone). {SITE_CONFIG.name} charges zero commission or brokerage fees on vehicle transactions in Stage 1. Users are solely responsible for conducting independent physical vehicle inspections and RTA technical certification prior to fund transfer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">5. Governing Law & Dispute Resolution</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of the Dubai International Financial Centre (DIFC) and applicable federal laws of the United Arab Emirates.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
