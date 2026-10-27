'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore } from '@/features/auth/store';
import { useToast } from '@/components/ui/Toast';
import { UserRole } from '@/types';
import { 
  Building2, 
  User as UserIcon, 
  Check, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuthStore();
  const { success, error } = useToast();

  const [role, setRole] = useState<'individual' | 'dealer'>('individual');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+971 50 ');
  const [companyName, setCompanyName] = useState('');
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      error('Missing Information', 'Please complete all required fields.');
      return;
    }

    setLoading(true);
    await signup({
      name,
      email,
      phone,
      role,
      companyName: role === 'dealer' ? companyName : undefined,
      tradeLicenseNumber: role === 'dealer' ? tradeLicenseNumber : undefined,
    });
    setLoading(false);

    success('Account Registered', `Welcome to ${SITE_CONFIG.name} Dubai! Directing to dashboard...`);
    router.push('/dashboard');
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
            <h1 className="font-heading text-2xl font-bold text-text">Create Your Account</h1>
            <p className="text-xs text-muted">
              Choose your profile type to start listing luxury supercars in Dubai.
            </p>
          </div>

          {/* Account Type Selector: Individual vs Dealer */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('individual')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                role === 'individual'
                  ? 'border-accent-2 bg-accent-2/10 shadow'
                  : 'border-border bg-surface-2 text-muted hover:text-text'
              }`}
            >
              <UserIcon className="w-4 h-4 text-accent-2 mb-1" />
              <p className="text-xs font-bold text-text">Individual Seller</p>
              <p className="text-[9px] text-muted">Private collector</p>
            </button>

            <button
              type="button"
              onClick={() => setRole('dealer')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                role === 'dealer'
                  ? 'border-accent bg-accent/10 shadow'
                  : 'border-border bg-surface-2 text-muted hover:text-text'
              }`}
            >
              <Building2 className="w-4 h-4 text-accent mb-1" />
              <p className="text-xs font-bold text-text">Dubai Dealership</p>
              <p className="text-[9px] text-muted">Commercial DED</p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-text mb-1">
                {role === 'dealer' ? 'Manager Full Name *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tariq Al-Nuaimi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent"
              />
            </div>

            {role === 'dealer' && (
              <>
                <div>
                  <label className="block font-semibold text-text mb-1">
                    Dealership Commercial Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Emirates Exotics Motors LLC"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text mb-1">
                    DED Commercial License Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="DED-CN-1029384"
                    value={tradeLicenseNumber}
                    onChange={(e) => setTradeLicenseNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent font-mono uppercase"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block font-semibold text-text mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="tariq@example.ae"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">Direct UAE Phone *</label>
              <input
                type="tel"
                required
                placeholder="+971 50 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-bg font-extrabold text-xs shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>{loading ? 'Registering...' : 'Register & Enter Dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <p className="text-[11px] text-muted text-center pt-2">
              Already have an account?{' '}
              <Link href="/login" className="text-accent hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
