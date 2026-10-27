'use client';

import { useEffect, useRef, useState } from 'react';
import { SMART_TEMPLATES } from '@/config/templates';
import { DEMO_MUSIC_TRACKS } from '@/config/music';
import { DEMO_MEDIA_CONFIG } from '@/config/demoMedia';
import { getFeatureFlags } from '@/lib/mockApi';
import { readPrototypeValue, resolvePrototypeVideo, storePrototypeVideo, writePrototypeValue } from '@/lib/prototypeStorage';
import { formatAed } from '@/lib/utils';
import { TemplateStyle } from '@/types';

type Clip = { name: string; source: string; duration: number; size: number };
type Studio = { clips: Clip[]; templateId: string; musicId: string; rendersUsed: number };
const DEMO_CLIP: Clip = { name: 'Demo walkaround.mp4', source: DEMO_MEDIA_CONFIG.verticalVideos[0].url, duration: 10, size: 0 };
const INITIAL: Studio = { clips: [DEMO_CLIP], templateId: SMART_TEMPLATES[0].id, musicId: DEMO_MUSIC_TRACKS[0].id, rendersUsed: 0 };

async function clipDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const element = document.createElement('video');
    const url = URL.createObjectURL(file);
    const timeout = window.setTimeout(() => finish(new Error('Video metadata timed out. Try another MP4/MOV.')), 12000);
    const finish = (error?: Error) => {
      clearTimeout(timeout); URL.revokeObjectURL(url);
      if (error) reject(error); else resolve(element.duration);
      element.removeAttribute('src'); element.load();
    };
    element.preload = 'metadata';
    element.onloadedmetadata = () => finish(!Number.isFinite(element.duration) || element.duration > 30 ? new Error(`${file.name}: each raw clip must be 30 seconds or shorter.`) : undefined);
    element.onerror = () => finish(new Error(`${file.name} cannot be played in this browser. Try an H.264 MP4.`));
    element.src = url;
  });
}

export function SmartTemplateEditor({ vehicleTitle, vehiclePrice, dubaiArea, draftKey, onInvalidate, onRenderComplete }: {
  vehicleTitle: string; vehiclePrice: number; dubaiArea: string; draftKey: string;
  onInvalidate: () => void;
  onRenderComplete: (url: string, poster: string, templateId: string, musicId: string) => void;
}) {
  const [studio, setStudio] = useState<Studio>(INITIAL);
  const [urls, setUrls] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [limit, setLimit] = useState(3);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [selecting, setSelecting] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [activeClip, setActiveClip] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const storageKey = `studio:${draftKey}`;
  const currentTemplate = SMART_TEMPLATES.find((item) => item.id === studio.templateId) || SMART_TEMPLATES[0];
  const busy = status === 'processing' || selecting || !ready;
  useEffect(() => {
    let cancelled = false;
    Promise.all([readPrototypeValue<Studio>(storageKey), getFeatureFlags()]).then(([saved, flags]) => {
      if (cancelled) return;
      if (saved) setStudio(saved);
      setLimit(flags.maxRendersPerListing); setReady(true);
    }).catch(() => { if (!cancelled) { setMessage('Could not restore studio settings. You can retry by reopening Media Studio.'); setReady(true); } });
    return () => { cancelled = true; if (timer.current) clearInterval(timer.current); };
  }, [storageKey]);
  useEffect(() => {
    let cancelled = false;
    Promise.all(studio.clips.map((clip) => resolvePrototypeVideo(clip.source))).then((resolved) => { if (!cancelled) setUrls(resolved.map((url) => url || '')); }).catch(() => { if (!cancelled) { setUrls([]); setMessage('Saved clips are unavailable. Choose them again or use the demo clip.'); } });
    return () => { cancelled = true; };
  }, [studio.clips]);
  useEffect(() => {
    if (ready) void writePrototypeValue(storageKey, studio).catch(() => setMessage('Studio changes could not be saved. Browser storage may be full.'));
  }, [studio, ready, storageKey]);
  const change = (updates: Partial<Studio>) => {
    setStudio((old) => ({ ...old, ...updates })); setStatus('idle'); setProgress(0); onInvalidate(); setVideoFailed(false);
  };
  const chooseClips = async (files: FileList | null) => {
    if (!files?.length) return;
    const chosen = Array.from(files);
    if (chosen.length > 5 || chosen.reduce((sum, file) => sum + file.size, 0) > 500 * 1024 * 1024) { setMessage('Choose 1–5 clips, with a combined size up to 500 MB.'); return; }
    setSelecting(true); setMessage('Checking files and preparing local previews…');
    try {
      if (chosen.some((file) => !/\.(mp4|mov)$/i.test(file.name))) throw new Error('Raw clips must be MP4 or MOV files.');
      const durations = await Promise.all(chosen.map(clipDuration));
      const clips = await Promise.all(chosen.map(async (file, index) => ({ name: file.name, source: (await storePrototypeVideo(file)).source, duration: durations[index], size: file.size })));
      change({ clips }); setActiveClip(0); setMessage('Clips saved in this browser. Preview each clip below.');
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Unable to read clips. Please retry.'); }
    finally { setSelecting(false); }
  };
  const render = () => {
    if (!studio.clips.length || studio.rendersUsed >= limit || busy) return;
    onInvalidate(); setStatus('processing'); setProgress(0); setMessage('Simulating template preparation…');
    let value = 0;
    timer.current = setInterval(() => {
      value += 10; setProgress(value);
      if (value < 100) return;
      if (timer.current) clearInterval(timer.current);
      if (simulateFailure) { setStatus('failed'); setMessage('Simulated processing failure. Your clips are safe. Retry to complete the preview.'); setSimulateFailure(false); return; }
      setStatus('done'); setStudio((old) => ({ ...old, rendersUsed: old.rendersUsed + 1 }));
      setMessage('Demo render ready. The output is a sample video; your selected clips have not been encoded or edited.');
      onRenderComplete(DEMO_MEDIA_CONFIG.verticalVideos[0].url, DEMO_MEDIA_CONFIG.verticalVideos[0].poster, currentTemplate.id, studio.musicId);
    }, 220);
  };
  return <div className="p-5 sm:p-8 rounded-2xl border border-border bg-surface space-y-6">
    <div><h3 className="font-bold text-lg text-text">Raw clips & Smart Templates</h3><p className="text-xs text-muted mt-2">Frontend simulation · Preview real local clips, choose a template and test processing. No actual rendering or AI processing takes place.</p></div>
    <div className="flex flex-wrap justify-between gap-3 text-xs"><span className="text-accent font-semibold">{Math.max(0, limit - studio.rendersUsed)} of {limit} demo renders remaining</span><span className="text-muted">Free clip previews</span></div>
    <fieldset disabled={busy} className="space-y-5 disabled:opacity-60">
      <label className="block text-xs font-semibold text-text">Choose 1–5 raw clips (MP4/MOV, max 30s each, 500 MB total)<input type="file" multiple accept="video/mp4,video/quicktime,.mp4,.mov" className="block w-full mt-3 text-xs" onChange={(event) => { void chooseClips(event.target.files); event.target.value = ''; }} /></label>
      <div className="flex flex-wrap gap-2"><button type="button" onClick={() => { change({ clips: [DEMO_CLIP] }); setActiveClip(0); }} className="interaction-button">Use demo clip</button><button type="button" onClick={() => { change({ clips: [] }); setActiveClip(0); }} className="interaction-button">Clear clips</button></div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Template style">{(['premium', 'sport', 'cosy'] as TemplateStyle[]).map((style) => <button key={style} type="button" aria-pressed={currentTemplate.style === style} onClick={() => { const first = SMART_TEMPLATES.find((item) => item.style === style)!; change({ templateId: first.id, musicId: first.recommendedMusicId }); }} className={`px-4 py-2 rounded-xl border text-xs capitalize ${currentTemplate.style === style ? 'border-accent bg-accent/10 text-accent' : 'border-border text-text'}`}>{style}</button>)}</div>
      <label className="block text-xs font-semibold text-text">Template<select value={studio.templateId} onChange={(event) => change({ templateId: event.target.value })} className="block w-full rounded-xl bg-surface-2 border border-border p-3 mt-2">{SMART_TEMPLATES.filter((item) => item.style === currentTemplate.style).map((item) => <option key={item.id} value={item.id}>{item.name} · {item.totalDuration}s</option>)}</select></label>
      <label className="block text-xs font-semibold text-text">Demo soundtrack<select value={studio.musicId} onChange={(event) => change({ musicId: event.target.value })} className="block w-full rounded-xl bg-surface-2 border border-border p-3 mt-2">{DEMO_MUSIC_TRACKS.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
    </fieldset>
    {studio.clips.length ? <div className="space-y-3"><div className="flex flex-wrap gap-2">{studio.clips.map((clip, index) => <button type="button" key={clip.source} aria-pressed={activeClip === index} onClick={() => { setActiveClip(index); setVideoFailed(false); }} className={`interaction-button max-w-full ${activeClip === index ? 'text-accent border-accent' : ''}`}><span className="truncate">{clip.name} · {clip.duration.toFixed(1)}s</span></button>)}</div>
      {urls[activeClip] && !videoFailed ? <video key={urls[activeClip]} src={urls[activeClip]} controls playsInline preload="metadata" onError={() => setVideoFailed(true)} className="w-full max-h-72 rounded-xl bg-surface-2" /> : <p role="status" className="p-5 rounded-xl bg-surface-2 text-xs text-muted">{videoFailed ? 'Clip cannot be played. Choose another compatible MP4/MOV.' : 'Local clip is unavailable. Select it again or use the demo clip.'}</p>}
      <div className="text-xs text-muted rounded-xl border border-border p-3"><p className="font-semibold text-text mb-2">Template plan · {currentTemplate.totalDuration}s · target 1080 × 1920 / 30 fps</p>{currentTemplate.slots.map((slot, index) => <p key={slot.id} className="py-1">{index + 1}. {slot.label} · {slot.targetDuration}s · clip {(index % studio.clips.length) + 1}</p>)}<p className="mt-3">{vehicleTitle} · {formatAed(vehiclePrice)} · {dubaiArea}</p></div>
    </div> : <p className="p-6 rounded-xl bg-surface-2 text-sm text-muted">No clips selected. Choose clips or load the demo to begin.</p>}
    <label className="flex items-center gap-2 text-xs text-muted"><input type="checkbox" checked={simulateFailure} disabled={busy} onChange={(event) => setSimulateFailure(event.target.checked)} />Simulate a processing failure on the next attempt</label>
    <button type="button" disabled={busy || !studio.clips.length || studio.rendersUsed >= limit} onClick={render} className="px-5 py-3 rounded-xl bg-accent text-white text-xs font-bold disabled:opacity-40">{status === 'processing' ? `Preparing preview… ${progress}%` : status === 'failed' ? 'Retry simulated render' : 'Create simulated preview'}</button>
    {status === 'processing' && <progress aria-label="Simulated rendering progress" value={progress} max={100} className="block w-full accent-accent" />}
    {message && <p role={status === 'failed' ? 'alert' : 'status'} className={`text-xs ${status === 'failed' ? 'text-danger' : 'text-muted'}`}>{message}</p>}
    {studio.rendersUsed >= limit && <p className="text-xs text-muted">Demo render allowance reached. You can still preview clips, submit your completed preview, or choose another listing path.</p>}
  </div>;
}
