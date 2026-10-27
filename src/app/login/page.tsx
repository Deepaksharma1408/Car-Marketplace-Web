'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore } from '@/features/auth/store';
import { useToast } from '@/components/ui/Toast';
import { UserRole } from '@/types';
import { SITE_CONFIG } from '@/config/site';
import { 
  ShieldCheck, 
  User as UserIcon, 
  Building2, 
  KeyRound, 
  ArrowRight, 
  Sparkles, 
  Mail, 
  Lock,
  Smartphone
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithDemoAccount, login, sendOtp, verifyOtp } = useAuthStore();
  const { success, error, info } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpMode, setOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = (role: UserRole) => {
    loginWithDemoAccount(role);
    success(
      `Logged in as ${role.toUpperCase()}`,
      `Loaded demo account for ${role === 'admin' ? 'Sarah Connor (Admin)' : role === 'dealer' ? 'Al-Futtaim Prestige (Dealer)' : 'Hamdan Al-Maktoum (Individual)'}`
    );

    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    await login(email);
    setLoading(false);
    success('Logged in successfully', `Welcome to ${SITE_CONFIG.name} Dubai.`);
    router.push('/dashboard');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      error('Email or Phone Required', 'Enter your email or UAE mobile number to receive a one-time passcode.');
      return;
    }
    const { code } = sendOtp(email);
    setOtpMode(true);
    info(
      'Mock OTP Code Generated',
      `Your verification code is: ${code} (Also shown here for instant testing: ${code})`
    );
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const valid = await verifyOtp(otpCode);
    setLoading(false);

    if (valid) {
      success('OTP Verified', 'Authentication successful. Redirecting to your dashboard...');
      router.push('/dashboard');
    } else {
      error('Invalid Code', 'The code you entered does not match. Try entering 123456 or the code from the notification.');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="max-w-md w-full rounded-3xl bg-surface border border-border p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent/15 border border-accent/30 text-accent uppercase tracking-wider">
              Dubai Supercar Platform
            </span>
            <h1 className="font-heading text-2xl font-bold text-text">Sign In to {SITE_CONFIG.name}</h1>
            <p className="text-xs text-muted">
              Choose a 1-click demo role or sign in with email & OTP.
            </p>
          </div>

          {/* 1-CLICK DEMO ACCOUNTS STRIP */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-text uppercase tracking-wider text-center">
              ⚡ 1-Click Demo Accounts
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('individual')}
                className="p-2.5 rounded-xl bg-surface-2 hover:bg-accent-2/15 hover:border-accent-2/40 border border-border text-center transition-all group"
              >
                <UserIcon className="w-4 h-4 text-accent-2 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-text">Individual</p>
                <p className="text-[9px] text-muted">Hamdan (Seller)</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('dealer')}
                className="p-2.5 rounded-xl bg-surface-2 hover:bg-accent/15 hover:border-accent/40 border border-border text-center transition-all group"
              >
                <Building2 className="w-4 h-4 text-accent mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-text">Dealer</p>
                <p className="text-[9px] text-muted">Al-Futtaim Prestige</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="p-2.5 rounded-xl bg-surface-2 hover:bg-purple-500/15 hover:border-purple-500/40 border border-border text-center transition-all group"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-text">Admin</p>
                <p className="text-[9px] text-muted">Sarah Connor</p>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center border-t border-border/80 pt-4">
            <span className="bg-surface px-3 text-[10px] text-muted uppercase tracking-wider">
              Or Sign In with Mock OTP
            </span>
          </div>

          {!otpMode ? (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-text mb-1.5">
                  Email Address or UAE Mobile (+971)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="tariq@example.com or +971 52 987 6543"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-bg font-extrabold text-xs shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Send Mock OTP (Toast Code)</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-muted pt-1">
                <Link href="/forgot-password" className="hover:text-accent">
                  Forgot Password?
                </Link>
                <Link href="/signup" className="text-accent hover:underline font-semibold">
                  Create Account
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-text mb-1.5">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  autoFocus
                  placeholder="e.g. 123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-accent text-accent font-mono text-center text-lg tracking-widest focus:outline-none"
                />
                <p className="text-[10px] text-muted text-center mt-1">
                  Code displayed in system toast notification or enter universal test code: <strong>123456</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-bg font-extrabold text-xs shadow-lg shadow-accent/20 transition-all"
              >
                {loading ? 'Verifying Code...' : `Verify OTP & Enter ${SITE_CONFIG.name}`}
              </button>

              <button
                type="button"
                onClick={() => setOtpMode(false)}
                className="w-full text-center text-[11px] text-muted hover:text-text"
              >
                ← Back to email
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
