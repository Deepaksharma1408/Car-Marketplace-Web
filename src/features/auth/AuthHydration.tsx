'use client';
import { useEffect } from 'react';
import { useAuthStore } from './store';

// Restore demo accounts after the initial server/client render has matched.
export function AuthHydration() {
  useEffect(() => { void useAuthStore.persist.rehydrate(); }, []);
  return null;
}
