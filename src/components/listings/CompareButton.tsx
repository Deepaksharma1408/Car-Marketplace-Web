'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useComparison } from '@/features/community/useComparison';
export function CompareButton({ id }: { id: string }) {
  const { ids, toggle } = useComparison();
  const [message, setMessage] = useState('');
  return <div className="flex flex-wrap gap-2 items-center text-xs"><button type="button" aria-pressed={ids.includes(id)} className="interaction-button text-accent" onClick={() => { try { toggle(id); setMessage(''); } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Unable to save your selection.'); } }}>{ids.includes(id) ? '✓ Added to comparison' : '+ Compare car'}</button>{ids.length > 0 && <Link href="/compare" className="text-accent underline">Compare ({ids.length}/3)</Link>}{message && <p role="status" className="text-muted w-full">{message}</p>}</div>;
}
