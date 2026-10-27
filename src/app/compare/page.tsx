'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useComparison } from '@/features/community/useComparison';
import { getListings } from '@/lib/mockApi';
import { formatAed, formatKm } from '@/lib/utils';
import { Listing } from '@/types';

const specs: { label: string; value: (car: Listing) => string }[] = [
  { label: 'Price', value: (car) => formatAed(car.price) },
  { label: 'Mileage', value: (car) => formatKm(car.mileage) },
  { label: 'Year', value: (car) => String(car.year) },
  { label: 'Body style', value: (car) => car.bodyType },
  { label: 'Fuel', value: (car) => car.fuelType },
  { label: 'Transmission', value: (car) => car.transmission },
  { label: 'Condition', value: (car) => car.condition },
  { label: 'Location', value: (car) => car.dubaiArea },
  { label: 'Seller', value: (car) => car.sellerName },
  { label: 'Dealer verification', value: (car) => car.isDealerVerified ? 'Verified dealer' : 'Individual / unverified dealer' },
];
export default function ComparePage() {
  const { ids, update, toggle } = useComparison();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [differences, setDifferences] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    let cancelled = false;
    const refresh = () => { void getListings({ status: 'live' }).then((cars) => { if (!cancelled) { setListings(cars); setError(''); } }).catch(() => { if (!cancelled) setError('Unable to load comparison. Please retry.'); }).finally(() => { if (!cancelled) setLoading(false); }); };
    refresh(); window.addEventListener('storage', refresh); window.addEventListener('vehiclespot-data-change', refresh);
    return () => { cancelled = true; window.removeEventListener('storage', refresh); window.removeEventListener('vehiclespot-data-change', refresh); };
  }, [attempt]);
  const cars = ids.map((id) => listings.find((car) => car.id === id)).filter((car): car is Listing => Boolean(car));
  const rows = specs.filter((row) => !differences || new Set(cars.map(row.value)).size > 1);
  const change = (action: () => void) => { try { action(); setMessage(''); } catch { setMessage('Unable to change comparison. Browser storage is unavailable.'); } };
  return <div className="min-h-screen bg-bg flex flex-col"><Navbar /><main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 flex-1">
    <Link href="/#compare-favourites" className="text-xs text-accent font-semibold">← Back to your shortlist</Link>
    <p className="text-xs text-accent uppercase tracking-widest font-bold mt-6">The details make the difference</p><h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-text mt-2">Compare Your Favourites</h1><p className="text-sm text-muted mt-3">Compare up to three available cars. Your selection stays in this browser.</p>
    <div className="flex flex-wrap items-center gap-4 my-6"><Link href="/cars" className="interaction-button text-accent">+ Add cars from inventory</Link><Link href="/saved" className="text-xs text-accent underline">Choose saved cars</Link><label className="text-xs text-muted flex items-center gap-2"><input type="checkbox" checked={differences} disabled={cars.length < 2} onChange={(event) => setDifferences(event.target.checked)} className="accent-accent" />Show differences only</label>{ids.length > 0 && <button onClick={() => change(() => update([]))} className="text-xs text-muted underline">Clear comparison</button>}</div>
    {message && <p role="status" className="text-xs text-danger mb-4">{message}</p>}
    {loading ? <p role="status" className="p-8 rounded-2xl bg-surface text-muted">Loading your comparison…</p> : error ? <div role="alert" className="p-8 bg-surface border border-border rounded-2xl text-text">{error}<button onClick={() => { setLoading(true); setAttempt(attempt + 1); }} className="ml-3 text-accent underline">Retry</button></div> : !cars.length ? <div className="text-center rounded-3xl border border-dashed border-border bg-surface p-10 sm:p-16"><h2 className="text-xl font-bold text-text">Your comparison starts here</h2><p className="text-sm text-muted mt-3">Choose two or three cars from the homepage, inventory or saved collection.</p><Link href="/cars" className="inline-block mt-6 px-5 py-3 rounded-xl bg-accent text-white text-sm font-semibold">Explore all cars</Link></div> : <>
      {ids.length > cars.length && <p className="text-xs text-muted mb-4">Some selected cars are no longer available. <button onClick={() => change(() => update(cars.map((car) => car.id)))} className="text-accent underline">Remove unavailable selections</button></p>}
      {cars.length === 1 && <p className="text-sm text-muted mb-4">One car selected. Add another to compare specifications.</p>}
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface"><table className="w-full min-w-[620px] text-left text-sm text-text"><caption className="sr-only">Vehicle price, mileage and specifications compared side by side</caption><thead><tr><th scope="col" className="p-4 w-36 text-xs text-muted align-bottom">Vehicle details</th>{cars.map((car) => <th key={car.id} scope="col" className="p-4 min-w-52 align-top"><div className="relative"><img src={car.photos[car.coverPhotoIndex] || car.photos[0]} alt={car.title} width={320} height={200} className="w-full h-36 sm:h-44 object-cover rounded-xl" /><button aria-label={`Remove ${car.title} from comparison`} onClick={() => change(() => toggle(car.id))} className="absolute right-2 top-2 p-2 rounded-full bg-white text-[#193B55] shadow"><X className="w-4 h-4" /></button></div><h2 className="font-bold mt-3 leading-snug">{car.title}</h2><Link href={`/car/${car.slug}`} className="inline-block text-xs font-semibold text-accent mt-3">View listing →</Link></th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.label} className="border-t border-border"><th scope="row" className="p-4 text-xs text-muted font-medium">{row.label}</th>{cars.map((car) => <td key={car.id} className={`p-4 text-xs ${row.label === 'Price' ? 'font-bold text-accent bg-accent/5 text-sm' : ''}`}>{row.value(car)}</td>)}</tr>)}</tbody></table></div>
      {differences && rows.length === 0 && <p className="text-sm text-muted mt-4">The selected specifications are identical. Turn off the differences filter to view all details.</p>}
    </>}
  </main><Footer /></div>;
}
