'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore } from '@/features/auth/store';
import { useToast } from '@/components/ui/Toast';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { sendOtp } = useAuthStore();
  const { success, info } = useToast();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const { code } = sendOtp(email);
    setSubmitted(true);
    info(
      'Reset Verification Code Generated',
      `Your password reset OTP code is: ${code} (Shown in notification for instant prototype demo).`
    );
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="max-w-md w-full rounded-3xl bg-surface border border-border p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center mx-auto mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-text">Reset Password</h1>
            <p className="text-xs text-muted">
              Enter your registered email or phone to receive a 6-digit verification code.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-text mb-1.5">
                  Email Address or Mobile (+971)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="tariq@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-bg font-extrabold text-xs shadow-lg shadow-accent/20 transition-all"
              >
                Send Password Reset Code
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-surface-2 border border-accent/40 space-y-3 text-center text-xs">
              <CheckCircle2 className="w-8 h-8 text-accent mx-auto" />
              <p className="font-semibold text-text">Reset Code Dispatched</p>
              <p className="text-muted leading-relaxed">
                Check the top-right notification toast on your screen for the 6-digit mock code. Use it on the sign-in screen to authenticate.
              </p>
              <Link
                href="/login"
                className="inline-block px-4 py-2 rounded-xl bg-accent text-bg font-bold text-xs"
              >
                Return to Sign In
              </Link>
            </div>
          )}

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-[11px] text-muted hover:text-text flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
