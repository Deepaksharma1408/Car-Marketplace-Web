'use client';
import { useMemo, useSyncExternalStore } from 'react';
import { COMMUNITY_EVENT, COMMUNITY_KEY, EMPTY_COMMUNITY, CommunityData } from '@/lib/prototypeCommunity';

function subscribe(callback: () => void) {
  window.addEventListener(COMMUNITY_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => { window.removeEventListener(COMMUNITY_EVENT, callback); window.removeEventListener('storage', callback); };
}
function snapshot() {
  try { return localStorage.getItem(COMMUNITY_KEY) || '{}'; } catch { return '{}'; }
}
export function useCommunity(): CommunityData {
  const value = useSyncExternalStore(subscribe, snapshot, () => '{}');
  return useMemo(() => {
    try { return { ...EMPTY_COMMUNITY, ...JSON.parse(value) }; } catch { return EMPTY_COMMUNITY; }
  }, [value]);
}
