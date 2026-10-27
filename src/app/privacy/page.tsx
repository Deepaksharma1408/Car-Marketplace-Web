import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Globe, Lock, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full text-xs text-muted leading-relaxed space-y-8">
        <div className="border-b border-border pb-6 flex items-start justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-2/15 border border-accent-2/30 text-accent-2 uppercase tracking-wider">
              UAE Federal Decree-Law No. 45
            </span>
            <h1 className="font-heading text-3xl font-bold text-text mt-2">
              Privacy Policy & Personal Data Protection
            </h1>
            <p className="text-xs text-muted mt-1">
              Effective Date: October 2026 • Compliant with UAE Personal Data Protection Law (PDPL)
            </p>
          </div>

          <Link
            href="/ar/privacy"
            className="px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-accent font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
            dir="rtl"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>عرض باللغة العربية (RTL)</span>
          </Link>
        </div>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">1. Principles of Data Processing</h2>
          <p>
            {SITE_CONFIG.name} is committed to processing personal information in a lawful, fair, and transparent manner in compliance with UAE Federal Decree-Law No. 45 of 2021 regarding Personal Data Protection. We collect only the data necessary to provide high-performance automotive video streaming and facilitate direct buyer-seller leads.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">2. Lead Telemetry & Separation of Counters</h2>
          <p>
            In accordance with platform architecture, public engagement counters (video views, likes, comments count) are strictly separated from confidential private seller telemetry. Private seller metrics—such as direct WhatsApp lead clicks, phone dials, saves, and individual watch time distributions—are visible solely to the verified seller of that listing and authorized {SITE_CONFIG.name} moderators.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">3. Right to Data Portability & Account Deletion</h2>
          <p>
            Under the UAE PDPL, users possess the absolute right to request an export of their personal information and to request account deletion. When account deletion is requested via the Seller Dashboard, listings are immediately taken down from public view. Telemetry records undergo a mandatory 30-day retention grace period to prevent commercial fraud and resolve outstanding transaction disputes before permanent erasure.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-base font-bold text-text">4. Contact our Data Protection Officer (DPO)</h2>
          <p>
            For data inquiries, rights requests, or commercial data verification, contact our compliance team at <strong>privacy@vehiclespot.ae</strong> or visit our office at DIFC Al Saada Tower, Dubai, UAE.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
