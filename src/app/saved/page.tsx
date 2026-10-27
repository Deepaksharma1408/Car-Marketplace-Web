'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ListingCard } from '@/components/listings/ListingCard';
import { ListingInteractions } from '@/components/listings/ListingInteractions';
import { useCommunity } from '@/features/community/useCommunity';
import { useAuthStore } from '@/features/auth/store';
import { getListings } from '@/lib/mockApi';
import { Listing } from '@/types';

export default function SavedPage() {
  const { user, role } = useAuthStore();
  const community = useCommunity();
  const [tab, setTab] = useState<'saves' | 'likes'>('saves');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => { setLoading(true); setError(''); try { setListings(await getListings({ status: 'live' })); } catch { setError('Unable to load your cars.'); } finally { setLoading(false); } };
  useEffect(() => { const refresh = () => { void getListings({ status: 'live' }).then(setListings).catch(() => setError('Unable to load your cars.')).finally(() => setLoading(false)); };
    refresh(); window.addEventListener('storage', refresh); window.addEventListener('vehiclespot-data-change', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('vehiclespot-data-change', refresh); }; }, []);
  const ids = community[tab][user?.id || ''] || [];
  const selected = listings.filter((listing) => ids.includes(listing.id));
  return <div className="min-h-screen bg-bg flex flex-col"><Navbar /><main className="w-full max-w-6xl mx-auto p-4 sm:p-8 flex-1"><h1 className="text-3xl font-bold text-text">Your private collection</h1><p className="text-sm text-muted mt-2">Saved and liked cars are visible only in your current demo account.</p>
    {!user || role === 'guest' ? <div className="mt-8 p-8 bg-surface border border-border rounded-2xl text-text"><p>Sign in to build your collection.</p><Link href="/login" className="inline-block mt-4 text-accent underline">Sign in</Link></div> : <><div className="flex gap-2 my-6" role="group" aria-label="Collection type">{(['saves', 'likes'] as const).map((value) => <button key={value} aria-pressed={value === tab} onClick={() => setTab(value)} className={`px-5 py-2 rounded-xl text-sm font-semibold border ${value === tab ? 'bg-accent text-white border-accent' : 'bg-surface text-text border-border'}`}>{value === 'saves' ? 'Saved cars' : 'Liked cars'}</button>)}</div>
      {loading ? <p role="status" className="text-muted">Loading your collection…</p> : error ? <div role="alert" className="text-text">{error}<button onClick={() => void load()} className="ml-3 text-accent underline">Retry</button></div> : !selected.length ? <div className="p-10 rounded-2xl bg-surface border border-border text-center"><h2 className="text-xl text-text font-bold">No {tab === 'saves' ? 'saved' : 'liked'} cars yet</h2><p className="mt-2 text-sm text-muted">Discover a car and tap {tab === 'saves' ? 'Save' : 'Like'} to keep it here. Unavailable listings are excluded.</p><Link href="/feed" className="inline-block mt-5 bg-accent text-white px-5 py-3 rounded-xl text-sm">Explore the feed</Link></div> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{selected.map((listing) => <div key={listing.id} className="space-y-2 min-w-0"><ListingCard listing={listing} /><ListingInteractions listing={listing} /></div>)}</div>}
    </>}
  </main><Footer /></div>;
}
