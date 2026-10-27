'use client';
import { useMemo, useSyncExternalStore } from 'react';
import { useAuthStore } from '@/features/auth/store';
const EVENT = 'vehiclespot-comparison-change';
function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback); window.addEventListener('storage', callback);
  return () => { window.removeEventListener(EVENT, callback); window.removeEventListener('storage', callback); };
}
export function useComparison() {
  const userId = useAuthStore((state) => state.user?.id || 'guest');
  const key = `vehiclespot-compare:${userId}`;
  const raw = useSyncExternalStore(subscribe, () => { try { return localStorage.getItem(key) || '[]'; } catch { return '[]'; } }, () => '[]');
  const ids = useMemo<string[]>(() => { try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? [...new Set(parsed.filter((id): id is string => typeof id === 'string'))].slice(0, 3) : []; } catch { return []; } }, [raw]);
  const update = (next: string[]) => { localStorage.setItem(key, JSON.stringify([...new Set(next)].slice(0, 3))); window.dispatchEvent(new Event(EVENT)); };
  return { ids, update, toggle: (id: string) => {
    if (!ids.includes(id) && ids.length >= 3) throw new Error('You can compare up to three cars. Remove one to add another.');
    update(ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]);
  } };
}
