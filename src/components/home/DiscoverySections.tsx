'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Compass, MapPin, SlidersHorizontal } from 'lucide-react';
import { Listing } from '@/types';
import { LIFESTYLES, SHOWROOM_AREAS, matchesDiscovery, matchesLifestyle } from '@/lib/discovery';
import { useComparison } from '@/features/community/useComparison';
import { useCommunity } from '@/features/community/useCommunity';
import { useAuthStore } from '@/features/auth/store';
import { formatAed } from '@/lib/utils';

const container = 'max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12';
const eyebrow = 'text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-accent';

export function LifestyleSection({ listings }: { listings: Listing[] }) {
  return <section id="lifestyles" className="py-10 sm:py-16 bg-bg scroll-mt-36"><div className={container}>
    <div className="flex flex-wrap justify-between items-end gap-3 mb-6"><div><p className={eyebrow}>A car for every side of you</p><h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text mt-2">Explore by Lifestyle</h2></div><p className="text-xs sm:text-sm text-muted max-w-sm">From the weekday commute to the unforgettable weekend.</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">{LIFESTYLES.map((style, index) => {
      const cars = listings.filter((car) => matchesLifestyle(car, style.id));
      const image = cars[0]?.photos[cars[0].coverPhotoIndex] || style.image;
      return <Link key={style.id} href={`/cars?lifestyle=${style.id}`} className="group relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl bg-surface-2 border border-border">
        <img src={image} alt={style.title} width={600} height={750} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081A2C]/95 via-[#081A2C]/15 to-transparent" />
        <span className="absolute top-3 left-3 sm:top-4 sm:left-4 text-white/90 text-[10px] rounded-full border border-white/30 bg-black/15 px-2.5 py-1 backdrop-blur">0{index + 1} / THE COLLECTION</span>
        <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 text-white"><p className="text-[10px] text-[#E7CC91] mb-2">{cars.length} cars to discover</p><h3 className="font-heading text-base sm:text-xl font-bold leading-tight">{style.title}</h3><p className="hidden sm:block text-xs text-white/75 mt-2">{style.subtitle}</p><span className="mt-4 inline-flex gap-2 items-center text-xs font-semibold">Explore <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></span></div>
      </Link>;
    })}</div>
  </div></section>;
}

const budgets = [{ id: '750000', label: 'Up to AED 750k' }, { id: '1500000', label: 'Up to AED 1.5m' }, { id: '3000000', label: 'Up to AED 3m' }, { id: 'any', label: 'No limit' }];
const bodies = [{ id: 'any', label: 'Open to anything' }, { id: 'coupe', label: 'Coupe' }, { id: 'suv', label: 'SUV' }, { id: 'sedan', label: 'Sedan' }, { id: 'convertible', label: 'Convertible' }, { id: 'supercar', label: 'Supercar' }];
const drives = [{ id: 'any', label: 'A bit of everything' }, { id: 'performance', label: 'Weekend performance' }, { id: 'comfort', label: 'Everyday comfort' }, { id: 'electric', label: 'Electric driving' }];

export function FinderAndComparison({ listings }: { listings: Listing[] }) {
  const [step, setStep] = useState(0);
  const [budget, setBudget] = useState('any');
  const [body, setBody] = useState('any');
  const [drive, setDrive] = useState('any');
  const [savedOnly, setSavedOnly] = useState(false);
  const [message, setMessage] = useState('');
  const { ids, update } = useComparison();
  const community = useCommunity();
  const userId = useAuthStore((state) => state.user?.id || 'guest');
  const savedIds = community.saves[userId] || [];
  const options = savedOnly ? listings.filter((car) => savedIds.includes(car.id)) : listings;
  const matches = useMemo(() => listings.filter((car) => matchesDiscovery(car, { budget, body, drive })), [listings, budget, body, drive]);
  const choices = step === 0 ? budgets : step === 1 ? bodies : drives;
  const value = step === 0 ? budget : step === 1 ? body : drive;
  const selected = ids.map((id) => listings.find((car) => car.id === id)).filter((car): car is Listing => Boolean(car));
  const chooseCar = (index: number, id: string) => {
    try { const next = [...ids]; if (id) next[index] = id; else next.splice(index, 1); update(next.filter(Boolean)); setMessage(''); }
    catch { setMessage('Unable to save comparison. Browser storage may be unavailable.'); }
  };
  return <section id="car-finder" className="py-10 sm:py-16 bg-surface-2/60 border-y border-border/60 scroll-mt-36"><div className={`${container} grid lg:grid-cols-2 gap-5 sm:gap-7`}>
    <div className="rounded-3xl border border-border bg-surface p-5 sm:p-8 shadow-sm flex flex-col">
      <div className="flex justify-between items-start gap-4"><div><p className={eyebrow}>Your next car, your way</p><h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text mt-2">Find Your Perfect Car</h2></div><Compass className="w-9 h-9 shrink-0 text-[#BE9A55]" /></div>
      <p className="text-sm text-muted mt-3">Three quick choices. A shortlist made for you.</p>
      <ol className="flex items-center gap-2 my-6 text-[10px] sm:text-xs">{['Budget', 'Body style', 'Your drive'].map((label, index) => <li key={label} className={`flex-1 rounded-full py-2 text-center font-semibold ${index === step ? 'bg-accent text-white' : index < step ? 'bg-accent/10 text-accent' : 'bg-surface-2 text-muted'}`} aria-current={index === step ? 'step' : undefined}>{index < step ? '✓ ' : `${index + 1}. `}{label}</li>)}</ol>
      <fieldset className="mb-6"><legend className="text-base font-bold text-text mb-4">{step === 0 ? 'What is your budget?' : step === 1 ? 'Which body style feels right?' : 'What matters most on the road?'}</legend><div className="grid grid-cols-2 gap-2">{choices.map((option) => <label key={option.id} className={`cursor-pointer p-3 rounded-xl border text-xs sm:text-sm flex items-center gap-2 ${value === option.id ? 'border-accent bg-accent/5 text-accent' : 'border-border text-text'}`}><input type="radio" name={`finder-${step}`} value={option.id} checked={value === option.id} onChange={() => { if (step === 0) setBudget(option.id); else if (step === 1) setBody(option.id); else setDrive(option.id); }} className="accent-accent" />{option.label}</label>)}</div></fieldset>
      <div className="mt-auto pt-5 border-t border-border flex items-center justify-between gap-3"><button disabled={step === 0} onClick={() => setStep(step - 1)} className="text-xs font-semibold text-muted disabled:opacity-30 px-2 py-2">Back</button>{step < 2 ? <button onClick={() => setStep(step + 1)} className="inline-flex gap-2 items-center px-5 py-3 rounded-xl bg-accent text-white text-xs font-bold">Next <ArrowRight className="w-4 h-4" /></button> : <Link href={`/cars?budget=${budget}&body=${body}&drive=${drive}`} className="px-5 py-3 rounded-xl bg-accent text-white text-xs font-bold">View {matches.length} matching cars</Link>}</div>
      {step === 2 && matches.length === 0 && <p role="status" className="mt-3 text-xs text-muted">No exact matches yet. Try a wider budget or select “Open to anything”.</p>}
    </div>

    <div id="compare-favourites" className="rounded-3xl border border-[#C8AB70]/60 bg-surface p-5 sm:p-8 shadow-sm flex flex-col scroll-mt-36">
      <div className="flex justify-between items-start gap-4"><div><p className={eyebrow}>Make the choice with confidence</p><h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text mt-2">Compare Your Favourites</h2></div><SlidersHorizontal className="w-8 h-8 text-[#BE9A55] shrink-0" /></div>
      <p className="text-sm text-muted mt-3">Price, mileage and every detail that matters. Up to three cars, side by side.</p>
      <label className="flex items-center gap-2 text-xs text-muted mt-5 mb-4"><input type="checkbox" checked={savedOnly} onChange={(event) => setSavedOnly(event.target.checked)} className="accent-accent" />Choose from my saved cars ({savedIds.length})</label>
      {savedOnly && options.length === 0 && <p className="text-xs text-muted mb-3">No available saved cars yet. Save cars from their detail pages or turn off this filter.</p>}
      <div className="space-y-3 mb-6">{[0, 1, 2].map((index) => {
        const car = listings.find((item) => item.id === ids[index]);
        return <div key={index} className="flex items-center gap-3 p-2.5 rounded-xl border border-border bg-surface-2/40">
          {car ? <img src={car.photos[car.coverPhotoIndex] || car.photos[0]} alt="" width={64} height={48} className="w-16 h-12 rounded-lg object-cover shrink-0" /> : <span className="w-12 h-12 rounded-lg border border-dashed border-border flex items-center justify-center text-muted shrink-0 text-xl">{index + 1}</span>}
          <div className="min-w-0 flex-1"><select aria-label={`Comparison car ${index + 1}`} value={car?.id || ''} onChange={(event) => chooseCar(index, event.target.value)} className="w-full min-w-0 bg-transparent text-xs font-semibold text-text p-1"><option value="">Choose a car</option>{car && !options.some((item) => item.id === car.id) && <option value={car.id}>{car.title}</option>}{options.map((item) => <option key={item.id} value={item.id} disabled={ids.includes(item.id) && ids[index] !== item.id}>{item.title}</option>)}</select>{car && <p className="text-[10px] text-accent px-1 mt-1">{formatAed(car.price)}</p>}</div>
        </div>;
      })}</div>
      {message && <p role="status" className="text-xs text-danger mb-3">{message}</p>}
      <div className="mt-auto pt-5 border-t border-border flex flex-wrap items-center justify-between gap-3"><button onClick={() => { try { update([]); setMessage(''); } catch { setMessage('Unable to clear selection. Please retry.'); } }} className="text-xs text-muted underline">Clear selection</button>{selected.length >= 2 ? <Link href="/compare" className="px-5 py-3 rounded-xl bg-accent text-white text-xs font-bold">Compare {selected.length} cars</Link> : <p className="text-xs text-muted">Select at least two cars to compare</p>}</div>
    </div>
  </div></section>;
}

export function ShowroomExplorer({ listings }: { listings: Listing[] }) {
  const [areaId, setAreaId] = useState('downtown');
  const area = SHOWROOM_AREAS.find((item) => item.id === areaId)!;
  const cars = listings.filter((car) => matchesDiscovery(car, { area: areaId }));
  const dealers = [...new Set(cars.filter((car) => car.isDealerVerified).map((car) => car.sellerName))];
  return <section id="showroom-explorer" className="py-10 sm:py-16 bg-bg scroll-mt-36"><div className={container}>
    <p className={eyebrow}>Discover your next destination</p><h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text mt-2">Explore Dubai Showrooms</h2><p className="text-sm text-muted mt-3 mb-6">Find exceptional cars in the neighbourhood that suits you.</p>
    <div className="grid lg:grid-cols-[1.25fr_1fr] rounded-3xl overflow-hidden border border-border bg-surface">
      <div className="relative min-h-[330px] sm:min-h-[400px] bg-[#EAF3F8]">
        <svg viewBox="0 0 600 400" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true"><rect width="600" height="400" fill="#EAF3F8" /><path d="M0 0H205C190 70 130 75 140 140S80 245 90 300 40 370 0 400Z" fill="#B9DDEB" /><path d="M160 400C200 300 220 260 290 210S380 120 510 0" stroke="#D4B978" strokeWidth="9" fill="none" /><path d="M600 110 165 320M600 280 235 70M320 400 510 40" stroke="white" strokeWidth="5" fill="none" /><path d="M140 300 590 350M200 120 560 160" stroke="#D8E6EF" strokeWidth="3" fill="none" /></svg>
        <p className="absolute top-5 left-5 text-[10px] text-[#39718D] uppercase tracking-widest font-bold">Dubai · Area explorer</p>
        {SHOWROOM_AREAS.map((point) => <button key={point.id} aria-pressed={point.id === areaId} onClick={() => setAreaId(point.id)} style={{ left: `${point.x}%`, top: `${point.y}%` }} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-sm border px-2.5 py-2 text-[10px] sm:text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${point.id === areaId ? 'bg-[#0089C8] border-[#0089C8] text-white' : 'bg-white border-[#C9DDE9] text-[#24516B]'}`}><MapPin className="w-3.5 h-3.5" />{point.name}</button>)}
        <p className="absolute bottom-4 left-5 text-[10px] text-[#39718D]">Illustrative area guide</p>
      </div>
      <div className="p-5 sm:p-8 flex flex-col"><div className="flex flex-wrap gap-2 mb-6">{SHOWROOM_AREAS.map((point) => <button key={point.id} aria-pressed={areaId === point.id} onClick={() => setAreaId(point.id)} className={`px-3 py-2 rounded-full text-[10px] font-semibold border ${areaId === point.id ? 'bg-accent/10 text-accent border-accent/30' : 'text-muted border-border'}`}>{point.name}</button>)}</div>
        <div aria-live="polite"><p className="text-xs text-[#B28B42] font-semibold">YOUR DESTINATION</p><h3 className="font-heading text-2xl text-text font-bold mt-2">{area.name}</h3><p className="text-sm text-muted mt-2">{area.description}</p><div className="flex gap-7 my-5"><p className="text-xs text-muted"><strong className="block text-2xl font-bold text-accent mb-1">{cars.length}</strong>Cars available</p><p className="text-xs text-muted"><strong className="block text-2xl font-bold text-accent mb-1">{dealers.length}</strong>Verified dealers</p></div>
        <div className="space-y-2 mb-6">{dealers.length ? dealers.slice(0, 3).map((name) => <p key={name} className="text-xs text-text flex items-center gap-2"><Check className="w-3.5 h-3.5 text-accent" />{name}</p>) : <p className="text-xs text-muted">More showroom inventory is coming soon.</p>}</div></div>
        <Link href={`/cars?area=${areaId}`} className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent text-white text-xs font-bold">Explore cars in {area.name}<ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  </div></section>;
}
