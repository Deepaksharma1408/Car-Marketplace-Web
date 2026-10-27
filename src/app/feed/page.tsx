'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Volume2, VolumeX } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { ListingInteractions } from '@/components/listings/ListingInteractions';
import { getListings } from '@/lib/mockApi';
import { buildDiscoveryFeed } from '@/lib/prototypeCommunity';
import { formatAed } from '@/lib/utils';
import { Listing } from '@/types';

function FeedCard({ listing, active, muted }: { listing: Listing; active: boolean; muted: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const cover = listing.photos[listing.coverPhotoIndex] || listing.photos[0] || listing.videoPoster;
  const isPhoto = listing.mediaPath === 'photos_only';
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (active) void element.play().catch(() => { /* Native play control remains available. */ });
    else element.pause();
    return () => element.pause();
  }, [active, attempt]);
  return <article className="relative h-full w-full overflow-hidden rounded-2xl bg-[#101827] text-white">
    {isPhoto || failed ? <img src={cover} alt={listing.title} className="w-full h-full object-cover" /> : <video key={attempt} ref={video} src={listing.videoUrl} poster={cover} muted={muted} controls playsInline loop preload={active ? 'auto' : 'none'} className="w-full h-full object-cover" onError={() => setFailed(true)} aria-label={listing.title} />}
    <div className="absolute top-4 left-4 pointer-events-none px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-xs">{isPhoto ? 'Photo listing · static gallery' : listing.videoUrl?.startsWith('/demo/') ? 'Sample footage · prototype' : 'Video listing'}{listing.isDealerVerified ? ' · Verified dealer' : ''}</div>
    {(isPhoto || failed) && <div className="absolute bottom-0 inset-x-0 p-5 pt-20 bg-gradient-to-t from-black/90 to-transparent">
      {failed && <div role="status" className="text-xs mb-3">Video unavailable. <button className="underline" onClick={() => { setFailed(false); setAttempt(attempt + 1); }}>Retry video</button></div>}
      <p className="text-xs mb-1">{listing.dubaiArea}</p><h2 className="text-lg font-bold">{listing.title}</h2><p className="mt-2 font-bold">{formatAed(listing.price)}</p>
      <Link className="inline-block mt-3 px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold" href={`/car/${listing.slug}`}>View car & contact seller</Link>
    </div>}
    {!isPhoto && !failed && <div className="absolute inset-x-0 bottom-14 p-4 pt-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"><p className="text-xs">{listing.dubaiArea}</p><h2 className="text-lg font-bold mt-1">{listing.title}</h2><p className="font-bold mt-2">{formatAed(listing.price)}</p><Link href={`/car/${listing.slug}`} className="pointer-events-auto inline-block mt-3 text-xs font-semibold bg-white/95 text-[#087BAC] px-3 py-2 rounded-xl">View car & contact seller</Link></div>}
    {!active && !isPhoto && <div className="absolute inset-0 pointer-events-none" />}
  </article>;
}

export default function DiscoveryPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const feed = useMemo(() => buildDiscoveryFeed(listings), [listings]);
  const load = async () => {
    setLoading(true); setError('');
    try { setListings(await getListings({ status: 'live' })); setActive(0); }
    catch { setError('Unable to load the local feed. Please retry.'); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    const refresh = () => { void getListings({ status: 'live' }).then(setListings).catch(() => setError('Unable to load the local feed. Please retry.')).finally(() => setLoading(false)); };
    refresh(); window.addEventListener('storage', refresh); window.addEventListener('vehiclespot-data-change', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('vehiclespot-data-change', refresh); };
  }, []);
  useEffect(() => {
    if (root.current) root.current.scrollTop = 0;
  }, [feed]);
  const move = (direction: number) => {
    const next = Math.max(0, Math.min(feed.length - 1, active + direction));
    root.current?.children[next]?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
  };
  const selected = feed[active];
  return <div className="min-h-screen bg-bg"><Navbar /><main className="max-w-6xl mx-auto px-4 py-6">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5"><div><p className="text-xs text-accent font-bold uppercase tracking-widest">Dubai discovery</p><h1 className="text-2xl font-extrabold text-text mt-1">Watch. Discover. Drive.</h1></div><Link href="/saved" className="text-sm text-accent underline">Saved & liked cars</Link></div>
    {loading ? <div role="status" className="h-[65svh] max-w-sm mx-auto rounded-2xl bg-surface-2 animate-pulse p-8 text-muted">Loading your feed…</div> : error ? <div role="alert" className="p-8 rounded-2xl bg-surface border border-border text-text">{error}<button onClick={() => void load()} className="block mt-4 text-accent underline">Retry</button></div> : !selected ? <div className="p-10 rounded-2xl border border-border bg-surface text-center text-text"><h2 className="text-xl font-bold">No videos to watch yet</h2><p className="text-muted text-sm mt-2">Browse photo listings or publish a video to begin.</p><Link href="/#marketplace-inventory" className="inline-block mt-4 text-accent underline">Browse all cars</Link></div> : <div className="grid lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] gap-6 items-start justify-center">
      <div><div ref={root} style={{ overflowAnchor: 'none' }} onScroll={(event) => { const element = event.currentTarget; setActive(Math.min(feed.length - 1, Math.max(0, Math.round(element.scrollTop / element.clientHeight)))); }} tabIndex={0} aria-label="Vertical discovery feed. Swipe or use up and down keys to navigate." onKeyDown={(event) => { if (event.target !== event.currentTarget) return; if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); move(event.key === 'ArrowDown' ? 1 : -1); } }} className="h-[calc(100svh-22rem)] sm:h-[72svh] min-h-[340px] max-h-[780px] overflow-y-auto overscroll-contain snap-y snap-mandatory rounded-2xl focus-visible:outline-2 focus-visible:outline-accent">
        {feed.map((listing, index) => <div key={listing.id} data-index={index} className="h-full snap-start snap-always pb-2"><FeedCard listing={listing} active={index === active} muted={muted} /></div>)}
      </div><div className="flex items-center justify-between gap-2 mt-3 text-xs text-muted"><span>{active + 1} / {feed.length} · Swipe to discover</span><div className="flex gap-2"><button aria-label={muted ? 'Unmute videos' : 'Mute videos'} onClick={() => setMuted(!muted)} className="interaction-button">{muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}</button><button aria-label="Previous car" disabled={active === 0} onClick={() => move(-1)} className="interaction-button disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button><button aria-label="Next car" disabled={active === feed.length - 1} onClick={() => move(1)} className="interaction-button disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button></div></div></div>
      <aside className="space-y-4 lg:sticky lg:top-32"><div className="rounded-2xl border border-border bg-surface p-5 text-text"><p className="text-xs text-accent">{selected.dubaiArea}</p><h2 className="text-xl font-bold mt-2">{selected.title}</h2><p className="text-xl text-accent font-extrabold mt-3">{formatAed(selected.price)}</p><Link href={`/car/${selected.slug}`} className="inline-block mt-4 bg-accent text-white rounded-xl px-5 py-3 text-sm font-bold">View car & contact seller</Link></div><ListingInteractions key={selected.id} listing={selected} /><p className="text-xs text-muted">Photo listings stay static and appear at most once after every seven video listings. Prototype activity is saved in this browser.</p></aside>
    </div>}
  </main></div>;
}
