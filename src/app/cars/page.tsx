'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { matchesDiscovery, LIFESTYLES, SHOWROOM_AREAS } from '@/lib/discovery';
import { CompareButton } from '@/components/listings/CompareButton';
import { ArrowLeft, Search } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ListingCard } from '@/components/listings/ListingCard';
import { getListings } from '@/lib/mockApi';
import { Listing } from '@/types';

export default function CarsPage() {
  return <Suspense fallback={<div className="p-8 text-muted">Loading inventory filters…</div>}><CarsInventory /></Suspense>;
}
function CarsInventory() {
  const params = useSearchParams();
  const router = useRouter();
  const filters = useMemo(() => ({ lifestyle: params.get('lifestyle') || '', budget: params.get('budget') || '', body: params.get('body') || '', drive: params.get('drive') || '', area: params.get('area') || '' }), [params]);
  const hasGuidedFilters = Object.values(filters).some((value) => value && value !== 'any');
  const filterLabel = LIFESTYLES.find((item) => item.id === filters.lifestyle)?.title || (filters.area ? `Cars in ${SHOWROOM_AREAS.find((item) => item.id === filters.area)?.name || filters.area}` : 'Your perfect car matches');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [make, setMake] = useState('all');
  const [sort, setSort] = useState('newest');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      void getListings({ status: 'live' }).then((data) => {
        if (!cancelled) { setListings(data); setError(''); }
      }).catch(() => { if (!cancelled) setError('Unable to load the inventory. Please retry.'); })
        .finally(() => { if (!cancelled) setLoading(false); });
    };
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('vehiclespot-data-change', refresh);
    return () => { cancelled = true; window.removeEventListener('storage', refresh); window.removeEventListener('vehiclespot-data-change', refresh); };
  }, [attempt]);

  const makes = useMemo(() => [...new Set(listings.map((listing) => listing.make))].sort(), [listings]);
  const cars = useMemo(() => listings.filter((listing) => {
    const matchesQuery = `${listing.title} ${listing.make} ${listing.model} ${listing.dubaiArea}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (make === 'all' || listing.make === make) && matchesDiscovery(listing, filters);
  }).sort((a, b) => sort === 'price_asc' ? a.price - b.price : sort === 'price_desc' ? b.price - a.price : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [listings, query, make, sort, filters]);

  return <div className="min-h-screen bg-bg flex flex-col"><Navbar />
    <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 flex-1">
      <Link href="/#marketplace-inventory" className="inline-flex items-center gap-2 text-xs text-accent font-semibold mb-6"><ArrowLeft className="w-4 h-4" />Back to showroom slideshow</Link>
      <p className="text-xs text-accent uppercase tracking-widest font-bold">Dubai marketplace</p>
      <div className="flex flex-wrap items-end justify-between gap-3 mt-2 mb-7"><div><h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-text">{hasGuidedFilters ? filterLabel : 'All Cars for Sale'}</h1><p className="text-sm text-muted mt-2">Explore the complete showroom inventory in one place.</p></div><span role="status" className="rounded-full px-4 py-2 bg-accent/10 text-accent text-xs font-bold">{loading ? 'Loading…' : `${cars.length} vehicles`}</span></div>

      {hasGuidedFilters && <div className="flex flex-wrap gap-2 items-center mb-5 text-xs"><span className="px-3 py-2 rounded-full bg-accent/10 text-accent">Guided selection{filters.budget && filters.budget !== 'any' ? ` · Up to AED ${Number(filters.budget).toLocaleString()}` : ''}{filters.body && filters.body !== 'any' ? ` · ${filters.body}` : ''}{filters.drive && filters.drive !== 'any' ? ` · ${filters.drive}` : ''}</span><button onClick={() => router.replace('/cars')} className="text-accent underline">Clear guided filters</button></div>}
      <div className="grid sm:grid-cols-[minmax(0,1fr)_180px_180px] gap-3 p-4 rounded-2xl border border-border bg-surface mb-7">
        <label className="relative"><span className="sr-only">Search cars</span><Search className="absolute left-3 top-3 w-4 h-4 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search model, make or Dubai area…" className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-2 border border-border text-sm text-text" /></label>
        <select aria-label="Filter by make" value={make} onChange={(event) => setMake(event.target.value)} className="w-full rounded-xl p-2.5 bg-surface-2 border border-border text-sm text-text"><option value="all">All makes</option>{makes.map((value) => <option key={value}>{value}</option>)}</select>
        <select aria-label="Sort cars" value={sort} onChange={(event) => setSort(event.target.value)} className="w-full rounded-xl p-2.5 bg-surface-2 border border-border text-sm text-text"><option value="newest">Newest arrivals</option><option value="price_asc">Price: Low to High</option><option value="price_desc">Price: High to Low</option></select>
      </div>

      {loading ? <div role="status" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">{[0, 1, 2, 3].map((key) => <div key={key} className="h-96 rounded-2xl bg-surface-2 animate-pulse" />)}<span className="sr-only">Loading cars…</span></div> : error ? <div role="alert" className="p-8 rounded-2xl border border-border bg-surface text-text">{error}<button onClick={() => { setLoading(true); setAttempt(attempt + 1); }} className="block mt-4 text-accent underline">Retry</button></div> : cars.length ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{cars.map((listing) => <div key={listing.id} className="min-w-0 space-y-3"><ListingCard listing={listing} /><CompareButton id={listing.id} /></div>)}</div> : <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-surface"><h2 className="text-xl text-text font-bold">No cars found</h2><p className="text-sm text-muted mt-2">Try another make or search term.</p><button onClick={() => { setQuery(''); setMake('all'); router.replace('/cars'); }} className="mt-5 text-accent font-semibold text-sm underline">Clear filters</button></div>}
    </main><Footer />
  </div>;
}
