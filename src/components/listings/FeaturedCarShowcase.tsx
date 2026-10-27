'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { Listing } from '@/types';
import { formatAed, formatKm } from '@/lib/utils';

export function FeaturedCarShowcase({ listings }: { listings: Listing[] }) {
  const [selected, setSelected] = useState(0);
  const cars = useMemo(() => {
    const preferred = ['Ferrari', 'Lamborghini', 'Porsche'];
    const picks = preferred.flatMap((make) => {
      const car = listings.find((item) => item.make === make && item.isDealerVerified);
      return car ? [car] : [];
    });
    return [...picks, ...listings.filter((item) => !picks.includes(item))].slice(0, 3);
  }, [listings]);
  const car = cars[selected % Math.max(cars.length, 1)];

  if (!car) return <div className="h-[540px] rounded-[32px] bg-surface-2 animate-pulse" aria-label="Loading featured cars" />;

  return (
    <section aria-label="Featured car showcase" className="relative isolate w-full max-w-xl mx-auto">
      <div aria-hidden="true" className="absolute -inset-4 rounded-full bg-accent/10 blur-3xl -z-10" />
      <div className="overflow-hidden rounded-[32px] border border-[#D6BD80]/60 bg-surface shadow-[0_24px_80px_-24px_rgba(0,137,200,0.25)]">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-accent"><Sparkles className="w-4 h-4" /> The Dubai Collection</span>
          <span className="text-[10px] font-mono text-muted">0{selected + 1} / 0{cars.length}</span>
        </div>

        <div className="relative mx-3 rounded-[24px] overflow-hidden bg-[#E8F2F8]">
          <Link href={`/car/${car.slug}`} className="block group relative aspect-[4/3]" aria-label={`Explore ${car.title}`}>
            <img key={car.id} src={car.photos[car.coverPhotoIndex] || car.photos[0] || car.videoPoster} alt={car.title} width={900} height={675} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" fetchPriority="high" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07334B]/50 via-transparent to-transparent" />
            <span className="absolute bottom-5 left-5 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold text-[#16648D]"><MapPin className="w-3 h-3" />{car.dubaiArea}</span>
            <span className="absolute right-5 bottom-5 w-10 h-10 rounded-full bg-white/95 flex items-center justify-center text-[#0089C8] group-hover:bg-[#D6BD80] transition-colors"><ArrowUpRight className="w-5 h-5" /></span>
          </Link>
          {car.isDealerVerified && <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-2 text-[10px] font-semibold text-[#16648D] flex items-center gap-1.5 shadow-sm"><ShieldCheck className="w-3.5 h-3.5" /> Verified Dealer</span>}
        </div>

        <div className="px-6 pt-5 pb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A17B30]">Featured selection · {car.year}</p>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-text mt-2 leading-tight">{car.make} {car.model}</h2>
          <div className="flex flex-wrap gap-2 text-[10px] text-muted mt-3"><span>{formatKm(car.mileage)}</span><span aria-hidden="true">·</span><span>{car.transmission}</span><span aria-hidden="true">·</span><span>{car.condition}</span></div>
          <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pb-5 border-b border-border">
            <p className="font-heading text-xl font-extrabold text-accent">{formatAed(car.price)}</p>
            <Link href={`/car/${car.slug}`} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-white hover:bg-accent-hover transition-colors">Explore this car <ArrowUpRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="flex items-center justify-between gap-3 pt-4">
            <div className="flex gap-2" aria-label="Choose featured car">
              {cars.map((item, index) => <button key={item.id} onClick={() => setSelected(index)} aria-label={`Show ${item.make} ${item.model}`} aria-pressed={index === selected} className={`w-16 h-12 rounded-lg border-2 overflow-hidden transition-all ${index === selected ? 'border-[#C7A55B] shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`}><img src={item.photos[item.coverPhotoIndex] || item.photos[0] || item.videoPoster} alt="" width={64} height={48} className="w-full h-full object-cover" /></button>)}
            </div>
            <div className="flex gap-1.5">
              <button aria-label="Previous featured car" onClick={() => setSelected((selected - 1 + cars.length) % cars.length)} className="p-2 rounded-full border border-border text-accent hover:bg-surface-2"><ChevronLeft className="w-4 h-4" /></button>
              <button aria-label="Next featured car" onClick={() => setSelected((selected + 1) % cars.length)} className="p-2 rounded-full border border-border text-accent hover:bg-surface-2"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="mx-auto mt-5 h-2 w-3/4 rounded-[100%] bg-gradient-to-r from-transparent via-[#C7A55B]/35 to-transparent blur-sm" />
    </section>
  );
}
