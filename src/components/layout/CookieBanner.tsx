'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cookie, X, Check } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('vehiclespot_cookie_consent') || localStorage.getItem('autoreel_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('vehiclespot_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('vehiclespot_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-6 z-[9990] max-w-md w-full px-4 sm:px-0"
        >
          <div className="bg-surface/95 border border-border backdrop-blur-xl p-5 rounded-2xl shadow-2xl space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
                  <Cookie className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text">Dubai Compliance & Cookies</h4>
                  <p className="text-xs text-muted">UAE Federal Decree-Law No. 45 on Personal Data</p>
                </div>
              </div>
              <button 
                onClick={handleDecline}
                className="text-muted hover:text-text p-1"
                aria-label="Dismiss cookie notice"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              We use telemetry and cookies to remember your preferences and deliver high-performance video streaming. Read our{' '}
              <Link href="/privacy" className="text-accent underline underline-offset-2">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/ar/privacy" className="text-accent underline underline-offset-2">
                سياسة الخصوصية
              </Link>
              .
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={handleAccept}
                className="flex-1 py-2 px-3 rounded-xl bg-accent hover:bg-accent-hover text-bg font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept All Cookies</span>
              </button>
              <button
                onClick={handleDecline}
                className="py-2 px-3 rounded-xl bg-surface-2 hover:bg-surface-3 text-text font-medium text-xs border border-border transition-colors"
              >
                Essential Only
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
