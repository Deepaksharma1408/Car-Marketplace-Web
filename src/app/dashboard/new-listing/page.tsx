'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PhotoQualityGate } from '@/components/wizard/PhotoQualityGate';
import { SmartTemplateEditor } from '@/components/wizard/SmartTemplateEditor';
import { ListingCard } from '@/components/listings/ListingCard';
import { VerticalVideoPlayer } from '@/components/video/VerticalVideoPlayer';
import { useAuthStore } from '@/features/auth/store';
import { useToast } from '@/components/ui/Toast';
import { createListing } from '@/lib/mockApi';
import { readPrototypeValue, writePrototypeValue, storePrototypeVideo, resolvePrototypeVideo } from '@/lib/prototypeStorage';
import { validateVideoFile } from '@/lib/qualityChecks';
import { 
  DUBAI_MAKES_MODELS, 
  DUBAI_AREAS, 
  BODY_TYPES, 
  FUEL_TYPES, 
  TRANSMISSIONS, 
  CONDITIONS 
} from '@/mocks/lookups';
import { DEMO_MEDIA_CONFIG } from '@/config/demoMedia';
import { SITE_CONFIG } from '@/config/site';
import { MediaPathType, ContactPreference, Listing } from '@/types';
import { formatAed, formatKm } from '@/lib/utils';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Save, 
  Sparkles, 
  Play, 
  Wand2, 
  Camera, 
  Upload, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  RefreshCw 
} from 'lucide-react';

export default function NewListingWizardPage() {
  const userId = useAuthStore((state) => state.user?.id || 'guest');
  return <NewListingWizard key={userId} />;
}

function NewListingWizard() {
  const router = useRouter();
  const { user, role } = useAuthStore();
  const { success, error, info } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [draftSavedTime, setDraftSavedTime] = useState<string>('Loading draft…');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [make, setMake] = useState('Porsche');
  const [model, setModel] = useState('911 GT3 RS');
  const [year, setYear] = useState(2024);
  const [price, setPrice] = useState(1350000);
  const [mileage, setMileage] = useState(3200);
  const [bodyType, setBodyType] = useState('Coupe');
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Automatic (Dual-Clutch PDK/DCT)');
  const [condition, setCondition] = useState<'Brand New' | 'Like New' | 'Excellent' | 'Good'>('Like New');
  const [dubaiArea, setDubaiArea] = useState('DIFC');
  const [description, setDescription] = useState(
    'GCC Specification delivered in Dubai. Single collector owner with full agency service history. Never tracked, clear Paint Protection Film (PPF) applied from day one.'
  );
  const [contactPreference, setContactPreference] = useState<ContactPreference>('both');

  // Media Path Selection
  const [mediaPath, setMediaPath] = useState<MediaPathType>('ready_video');

  // Path A state: Ready video
  const [pathAVideoUrl, setPathAVideoUrl] = useState<string>(DEMO_MEDIA_CONFIG.verticalVideos[2].url);
  const [pathAVideoPoster, setPathAVideoPoster] = useState<string>(DEMO_MEDIA_CONFIG.verticalVideos[2].poster);
  const [pathAValidation, setPathAValidation] = useState<{
    valid: boolean;
    checking: boolean;
    errors: string[];
  }>({
    valid: true,
    checking: false,
    errors: [],
  });
  const [pathAFormattingState, setPathAFormattingState] = useState<'idle' | 'formatting' | 'ready'>('ready');

  const [videoSource, setVideoSource] = useState<string>(DEMO_MEDIA_CONFIG.verticalVideos[2].url);
  const submittedRef = useRef(false);
  const [loadedDraftKey, setLoadedDraftKey] = useState('');
  const [draftNotice, setDraftNotice] = useState('');

  // Path B state: Smart template
  const [pathBRenderedUrl, setPathBRenderedUrl] = useState<string | null>(null);
  const [pathBPosterUrl, setPathBPosterUrl] = useState<string | null>(null);
  const [pathBTemplateId, setPathBTemplateId] = useState<string | null>(null);
  const [pathBMusicId, setPathBMusicId] = useState<string | null>(null);

  // Photos State (10–20 photos required across all paths)
  const [photos, setPhotos] = useState<string[]>(DEMO_MEDIA_CONFIG.photoPacks.porsche);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState(0);

  // Update dependent model when make changes
  const availableModels = DUBAI_MAKES_MODELS[make] || ['Custom Model'];


  const draftKey = `listing-draft:${user?.id || 'guest'}`;
  const draft = useMemo(() => ({
    step, make, model, year, price, mileage, bodyType, fuelType, transmission,
    condition, dubaiArea, description, contactPreference, mediaPath, photos,
    coverPhotoIndex, pathAVideoSource: videoSource, pathAVideoPoster,
    pathBRenderedUrl, pathBPosterUrl, pathBTemplateId, pathBMusicId,
  }), [step, make, model, year, price, mileage, bodyType, fuelType, transmission,
    condition, dubaiArea, description, contactPreference, mediaPath, photos,
    coverPhotoIndex, videoSource, pathAVideoPoster, pathBRenderedUrl,
    pathBPosterUrl, pathBTemplateId, pathBMusicId]);

  useEffect(() => {
    let cancelled = false;
    readPrototypeValue<typeof draft>(draftKey).then(async (saved) => {
      const restoredVideo = saved ? await resolvePrototypeVideo(saved.pathAVideoSource) : undefined;
      if (cancelled) return;
      if (saved) {
        setStep(saved.step); setMake(saved.make); setModel(saved.model);
        setYear(saved.year); setPrice(saved.price); setMileage(saved.mileage);
        setBodyType(saved.bodyType); setFuelType(saved.fuelType);
        setTransmission(saved.transmission); setCondition(saved.condition);
        setDubaiArea(saved.dubaiArea); setDescription(saved.description);
        setContactPreference(saved.contactPreference); setMediaPath(saved.mediaPath);
        setPhotos(saved.photos); setCoverPhotoIndex(saved.coverPhotoIndex);
        setVideoSource(saved.pathAVideoSource);
        setPathAVideoUrl(restoredVideo || ''); setPathAVideoPoster(saved.pathAVideoPoster);
        setPathAValidation({ valid: Boolean(restoredVideo), checking: false, errors: restoredVideo ? [] : ['Select your video again; the saved local file is unavailable.'] });
        setPathBRenderedUrl(saved.pathBRenderedUrl); setPathBPosterUrl(saved.pathBPosterUrl);
        setPathBTemplateId(saved.pathBTemplateId); setPathBMusicId(saved.pathBMusicId);
        setDraftNotice('Your saved draft has been restored. Continue where you left off.');
      }
      setLoadedDraftKey(draftKey);
    }).catch(() => {
      if (!cancelled) { setLoadedDraftKey(draftKey); setDraftNotice('Browser storage is unavailable. Your draft cannot be saved.'); }
    });
    return () => { cancelled = true; };
    // Restore only when the account changes, not after each field edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  const saveDraft = async () => {
    try {
      await writePrototypeValue(draftKey, draft);
      setDraftSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      return true;
    } catch {
      setDraftSavedTime('Save failed — browser storage full or unavailable');
      return false;
    }
  };

  useEffect(() => {
    if (loadedDraftKey !== draftKey || submittedRef.current) return;
    void writePrototypeValue(draftKey, draft).then(() => {
      if (!submittedRef.current) setDraftSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }).catch(() => setDraftSavedTime('Save failed — browser storage full or unavailable'));
  }, [draft, draftKey, loadedDraftKey]);

  const handleSelectVideo = async (file?: File) => {
    if (!file) return;
    setPathAValidation({ valid: false, checking: true, errors: [] });
    setPathAFormattingState('formatting');
    try {
      const result = await validateVideoFile(file);
      if (!result.valid) throw new Error(result.errors.join(' '));
      const stored = await storePrototypeVideo(file);
      setVideoSource(stored.source);
      setPathAVideoUrl(stored.url);
      setPathAValidation({ valid: true, checking: false, errors: [] });
      setPathAFormattingState('ready');
      success('Video selected', `${file.name} saved in this browser. No upload or re-editing performed.`);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unable to read or save this video.';
      setPathAValidation({ valid: false, checking: false, errors: [message] });
      setPathAFormattingState('idle');
      error('Video not accepted', message);
    }
  };

  const handleValidateVideoSample = () => {
    if (!pathAValidation.valid || !pathAVideoUrl) {
      error('Select a valid video', 'Choose a supported video before continuing.');
      return;
    }
    info('Local video ready', 'Selected files are checked in your browser. The preloaded sample is for demonstration only; no server encoding is performed.');
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model || price <= 0 || mileage < 0) {
      error('Incomplete Fields', 'Please complete all required vehicle specifications.');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Submit = () => {
    if (photos.length < 10 || photos.length > 20) {
      error('Photo Quality Gate Required', 'Please upload or attach 10–20 high-resolution photos before proceeding.');
      return;
    }

    if (mediaPath === 'ready_video' && (!pathAVideoUrl || !pathAValidation.valid || pathAValidation.checking)) {
      error('Video Required', 'Please provide a ready 9:16 vertical video or switch to Photos Only (Path C).');
      return;
    }

    if (mediaPath === 'smart_template' && !pathBRenderedUrl) {
      error('Preview Required', 'Finish the simulated template render before continuing.');
      return;
    }
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitListing = async () => {
    if (photos.length < 10 || photos.length > 20 || (mediaPath === 'smart_template' && !pathBRenderedUrl) || (mediaPath === 'ready_video' && (!pathAVideoUrl || !pathAValidation.valid || pathAValidation.checking))) {
      error('Media incomplete', 'Return to Media Studio and complete the selected path with 10–20 photos.');
      return;
    }
    setIsSubmitting(true);
    try {
      const activeVideoUrl = mediaPath === 'ready_video' 
        ? videoSource 
        : mediaPath === 'smart_template' 
        ? (pathBRenderedUrl || undefined) 
        : undefined;

      const activePoster = mediaPath === 'ready_video'
        ? pathAVideoPoster
        : mediaPath === 'smart_template'
        ? (pathBPosterUrl || photos[coverPhotoIndex])
        : photos[coverPhotoIndex];

      const newListing = await createListing({
        title: `${year} ${make} ${model}`,
        make,
        model,
        year,
        price,
        mileage,
        bodyType,
        fuelType,
        transmission,
        condition,
        dubaiArea,
        city: 'Dubai',
        category: 'car',
        description,
        contactPreference,
        mediaPath,
        status: 'pending_review', // submitted for review!
        videoUrl: activeVideoUrl,
        videoPoster: activePoster,
        videoDuration: 15,
        photos,
        coverPhotoIndex,
        smartTemplateId: pathBTemplateId || undefined,
        musicTrackId: pathBMusicId || undefined,
        sellerId: user?.id || 'user_demo_1',
        sellerType: role === 'dealer' ? 'dealer' : 'individual',
        sellerName: user?.companyName || user?.name || 'Verified Seller',
        sellerAvatar: user?.avatar,
        sellerPhone: user?.phone || '+971 50 123 4567',
        isDealerVerified: role === 'dealer' && user?.isVerifiedDealer,
      });

      submittedRef.current = true;
      await writePrototypeValue(`studio:${draftKey}`, undefined).catch(() => {});
      await writePrototypeValue(draftKey, undefined).catch(() => { /* Listing is already submitted; keep its success state. */ });

      // Confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF6A', '#2DD4BF', '#FFFFFF'],
      });

      success(
        'Listing Submitted for Review!',
        `Your listing has entered the ${SITE_CONFIG.name} Dubai moderation queue. An admin must approve it before it appears publicly.`
      );

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      error('Submission Failed', err instanceof Error ? err.message : 'Unable to save your listing locally.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewListing: Listing = {
    id: 'preview_temp',
    slug: 'preview-vehicle',
    title: `${year} ${make} ${model}`,
    make,
    model,
    year,
    price,
    mileage,
    bodyType,
    fuelType,
    transmission,
    condition,
    dubaiArea,
    city: 'Dubai',
    category: 'car',
    description,
    contactPreference,
    mediaPath,
    status: 'pending_review',
    videoUrl: mediaPath === 'ready_video' ? pathAVideoUrl : pathBRenderedUrl || undefined,
    videoPoster: photos[coverPhotoIndex],
    videoDuration: 15,
    photos,
    coverPhotoIndex,
    sellerId: user?.id || 'demo_user',
    sellerType: role === 'dealer' ? 'dealer' : 'individual',
    sellerName: user?.companyName || user?.name || 'Hamdan Al-Maktoum',
    sellerAvatar: user?.avatar,
    sellerPhone: user?.phone || '+971 52 987 6543',
    isDealerVerified: role === 'dealer' && user?.isVerifiedDealer,
    publicStats: { views: 0, likes: 0, commentsCount: 0 },
    privateStats: { whatsappLeads: 0, callLeads: 0, saves: 0, avgWatchTimeSeconds: 14, completionRatePercent: 85 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    auditHistory: [],
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        {/* Top Header & Draft Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/dashboard"
                onClick={async (event) => { event.preventDefault(); if (await saveDraft()) router.push('/dashboard'); }}
                className="text-xs text-muted hover:text-text flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit to Dashboard</span>
              </Link>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text">
              Create Luxury Car Listing
            </h1>
            <p className="text-xs text-muted">
              {SITE_CONFIG.name} 3-Step Wizard with simulated media processing and draft recovery
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" disabled={loadedDraftKey !== draftKey || isSubmitting} onClick={async () => { if (await saveDraft()) success('Draft saved', 'Continue from this browser at any time.'); }} className="px-3 py-2 rounded-xl border border-border text-xs font-semibold text-accent disabled:opacity-50">Save draft</button>
            <button type="button" disabled={loadedDraftKey !== draftKey || isSubmitting} onClick={async () => { try { submittedRef.current = true; await writePrototypeValue(draftKey, undefined); await writePrototypeValue(`studio:${draftKey}`, undefined); router.push('/dashboard'); } catch { submittedRef.current = false; error('Draft not cleared', 'Browser storage is unavailable.'); } }} className="px-3 py-2 rounded-xl text-xs text-muted hover:text-danger disabled:opacity-50">Discard draft</button>
            <span className="text-[11px] text-muted flex items-center gap-1.5 bg-surface-2 px-3 py-1.5 rounded-xl border border-border">
              <Save className="w-3 h-3 text-accent" />
              <span>Draft auto-saved {draftSavedTime}</span>
            </span>
          </div>
        </div>

        {draftNotice && <p role="status" className="mb-5 p-3 rounded-xl bg-accent/10 border border-accent/20 text-xs text-accent">{draftNotice}</p>}
        <p className="mb-5 text-xs text-muted">Frontend prototype · Drafts and selected media are stored only in this browser.</p>
        {/* Stepper Progress Bar */}
        <div className="mb-10 p-4 rounded-2xl bg-surface border border-border">
          <div className="grid grid-cols-3 gap-2">
            {[
              { num: 1, label: 'Vehicle Details', desc: 'Specs & Price' },
              { num: 2, label: 'Media Studio', desc: 'Video & Photos' },
              { num: 3, label: 'Review & Submit', desc: 'Feed Card Preview' },
            ].map((s) => {
              const isCurrent = step === s.num;
              const isDone = step > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (s.num === 1 || (s.num === 2 && step === 3)) setStep(s.num);
                  }}
                  className={`text-left p-2.5 sm:p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-accent bg-accent/10 shadow-md ring-1 ring-accent'
                      : isDone
                      ? 'border-border bg-surface-2 text-text hover:border-accent/40'
                      : 'border-border/40 bg-surface-2/40 text-muted opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        isDone
                          ? 'bg-accent text-bg'
                          : isCurrent
                          ? 'bg-accent text-bg'
                          : 'bg-surface-3 text-muted'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                    </span>
                    <span className="font-heading text-xs font-bold text-text truncate">
                      {s.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted ml-8 hidden sm:block mt-0.5">{s.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* STEP 1: VEHICLE DETAILS */}
        {/* ------------------------------------------------------------- */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-8 animate-in fade-in">
            <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="font-heading text-lg font-bold text-text">
                  Step 1: Vehicle Specifications & Location
                </h3>
                <p className="text-xs text-muted">
                  Provide vehicle specs. Models depend dynamically on selected make.
                </p>
              </div>

              {/* Make & Dependent Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Vehicle Make *
                  </label>
                  <select
                    aria-label="Vehicle make" value={make}
                    onChange={(e) => { setMake(e.target.value); setModel(DUBAI_MAKES_MODELS[e.target.value]?.[0] || 'Custom Model'); }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:outline-none focus:border-accent"
                  >
                    {Object.keys(DUBAI_MAKES_MODELS).map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Model (Dependent on {make}) *
                  </label>
                  <select
                    aria-label="Vehicle model" value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:outline-none focus:border-accent font-semibold text-accent"
                  >
                    {availableModels.map((mod) => (
                      <option key={mod} value={mod}>
                        {mod}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Year, Price, Mileage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Production Year *
                  </label>
                  <input
                    type="number"
                    min={1990}
                    max={2026}
                    aria-label="Production year" value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Asking Price (AED) *
                  </label>
                  <input
                    type="number"
                    min={10000}
                    step={5000}
                    aria-label="Asking price in AED" value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:outline-none focus:border-accent font-bold text-accent"
                  />
                  <p className="text-[10px] text-muted mt-1 font-mono">
                    Formatted: {formatAed(price)}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Odometer (Kilometers) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    aria-label="Mileage in kilometers" value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:outline-none focus:border-accent"
                  />
                  <p className="text-[10px] text-muted mt-1 font-mono">
                    Formatted: {formatKm(mileage)}
                  </p>
                </div>
              </div>

              {/* Body Type, Fuel, Transmission, Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Body Type
                  </label>
                  <select
                    aria-label="Body type" value={bodyType}
                    onChange={(e) => setBodyType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:outline-none focus:border-accent"
                  >
                    {BODY_TYPES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Fuel Type
                  </label>
                  <select
                    aria-label="Fuel type" value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:outline-none focus:border-accent"
                  >
                    {FUEL_TYPES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Transmission
                  </label>
                  <select
                    aria-label="Transmission" value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:outline-none focus:border-accent"
                  >
                    {TRANSMISSIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Condition
                  </label>
                  <select
                    aria-label="Condition" value={condition}
                    onChange={(e) => setCondition(e.target.value as typeof condition)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:outline-none focus:border-accent"
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dubai Area & Contact Preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Dubai Neighborhood / Area *
                  </label>
                  <select
                    aria-label="Dubai area" value={dubaiArea}
                    onChange={(e) => setDubaiArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:outline-none focus:border-accent"
                  >
                    {DUBAI_AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Buyer Contact Preference *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 'whatsapp', label: 'WhatsApp Only' },
                      { val: 'call', label: 'Call Only' },
                      { val: 'both', label: 'Both' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setContactPreference(opt.val as ContactPreference)}
                        className={`py-2 px-2 rounded-xl border text-[11px] font-semibold transition-all ${
                          contactPreference === opt.val
                            ? 'border-accent bg-accent/15 text-accent'
                            : 'border-border bg-surface-2 text-muted hover:text-text'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-text mb-1.5">
                  Detailed Vehicle Description
                </label>
                <textarea
                  rows={4}
                  aria-label="Vehicle description" value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Include options, PPF status, GCC vs European specs, warranty expiry..."
                  className="w-full p-3.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:outline-none focus:border-accent leading-relaxed"
                />
              </div>
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center justify-end gap-4">
              <button
                type="submit"
                className="px-7 py-3 rounded-xl bg-accent hover:bg-accent-hover text-bg font-bold text-xs shadow-lg shadow-accent/20 transition-all flex items-center gap-2"
              >
                <span>Continue to Media Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 2: MEDIA STUDIO */}
        {/* ------------------------------------------------------------- */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in">
            {/* Choose Media Path Selector */}
            <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 space-y-5">
              <div className="border-b border-border pb-4">
                <h3 className="font-heading text-lg font-bold text-text">
                  Step 2: Choose Your Media Creation Path
                </h3>
                <p className="text-xs text-muted">
                  Pick how you want your car showcased. All paths require 10–20 high-res photos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Path A */}
                <button
                  type="button"
                  onClick={() => setMediaPath('ready_video')}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    mediaPath === 'ready_video'
                      ? 'border-accent bg-accent/10 shadow-lg ring-1 ring-accent'
                      : 'border-border bg-surface-2 hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-surface border border-border text-accent">
                      <Play className="w-5 h-5 fill-accent" />
                    </div>
                    {mediaPath === 'ready_video' && <Check className="w-4 h-4 text-accent" />}
                  </div>
                  <h4 className="font-heading text-sm font-bold text-text">
                    Path A: Ready-Made Video
                  </h4>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Upload your finished 9:16 vertical video reel. Validated in browser for instant playback with no re-editing.
                  </p>
                </button>

                {/* Path B */}
                <button
                  type="button"
                  onClick={() => setMediaPath('smart_template')}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    mediaPath === 'smart_template'
                      ? 'border-accent-2 bg-accent-2/10 shadow-lg ring-1 ring-accent-2'
                      : 'border-border bg-surface-2 hover:border-accent-2/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-surface border border-border text-accent-2">
                      <Wand2 className="w-5 h-5" />
                    </div>
                    {mediaPath === 'smart_template' && <Check className="w-4 h-4 text-accent-2" />}
                  </div>
                  <h4 className="font-heading text-sm font-bold text-text">
                    Path B: Raw Clips + Smart Templates
                  </h4>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Choose 1–5 clips, a style and a template, then generate a simulated 10–20s preview.
                  </p>
                </button>

                {/* Path C */}
                <button
                  type="button"
                  onClick={() => setMediaPath('photos_only')}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    mediaPath === 'photos_only'
                      ? 'border-accent bg-accent/10 shadow-lg ring-1 ring-accent'
                      : 'border-border bg-surface-2 hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-surface border border-border text-muted">
                      <Camera className="w-5 h-5" />
                    </div>
                    {mediaPath === 'photos_only' && <Check className="w-4 h-4 text-accent" />}
                  </div>
                  <h4 className="font-heading text-sm font-bold text-text">
                    Path C: Photos Only
                  </h4>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Classic photo showcase. Guaranteed that photos will NEVER be turned into automated video.
                  </p>
                </button>
              </div>
            </div>

            {/* PATH A CONTAINER */}
            {mediaPath === 'ready_video' && (
              <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 space-y-6">
                <div className="border-b border-border pb-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-heading text-base font-bold text-text">
                      Path A: Ready 9:16 Video Upload & Browser Gate
                    </h4>
                    <p className="text-xs text-muted">
                      MP4/MOV, max 60s, vertical 9:16, min 720p HD, max 500 MB.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleValidateVideoSample}
                    className="px-3 py-1.5 rounded-xl bg-accent/15 border border-accent/30 text-accent font-semibold text-xs flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Run Verification Check</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  <div className="md:col-span-7 space-y-4">
                    {/* Simulated Upload Drag and Drop box */}
                    <label className="block p-8 rounded-2xl border-2 border-dashed border-border hover:border-accent/60 bg-surface-2 text-center space-y-3 cursor-pointer">
                      <input type="file" accept="video/mp4,video/quicktime,.mp4,.mov" aria-label="Select ready-made video" className="block w-full mb-4 text-xs text-muted" onChange={(event) => { void handleSelectVideo(event.target.files?.[0]); event.target.value = ''; }} />
                      <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text">
                          Choose a 9:16 video to preview locally
                        </p>
                        <p className="text-[10px] text-muted mt-0.5">
                          Demo video is preloaded. Select your own MP4/MOV to replace it.
                        </p>
                      </div>
                    </label>
                    {pathAValidation.errors.map((message) => <p key={message} role="alert" className="text-xs text-danger">{message}</p>)}

                    {/* Format and Prepared for Playback Animation */}
                    <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-text flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          <span>Check and format, prepared for playback only (no re-editing)</span>
                        </span>
                        <span className="text-[10px] text-accent font-bold">100% Ready</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-3 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-accent" />
                      </div>
                    </div>

                    {/* Pick Cover Frame */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-text">
                        Pick Cover Frame for Video Thumbnail
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[0, 1, 2].map((idx) => (
                          <div
                            key={idx}
                            onClick={() => setCoverPhotoIndex(idx)}
                            className={`aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                              coverPhotoIndex === idx ? 'border-accent scale-105' : 'border-border opacity-70'
                            }`}
                          >
                            <img src={photos[idx] || photos[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Preview */}
                  <div className="md:col-span-5 max-w-[240px] mx-auto">
                    <p className="text-xs font-semibold text-text mb-2 text-center">Video Player Check</p>
                    <VerticalVideoPlayer
                      videoUrl={pathAVideoUrl}
                      posterUrl={pathAVideoPoster}
                      title={`${make} ${model}`}
                      make={make}
                      autoPlay={false}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PATH B CONTAINER */}
            {mediaPath === 'smart_template' && (
              <SmartTemplateEditor
                key={draftKey}
                draftKey={draftKey}
                onInvalidate={() => setPathBRenderedUrl(null)}
                vehicleTitle={`${year} ${make} ${model}`}
                vehiclePrice={price}
                dubaiArea={dubaiArea}
                onRenderComplete={(videoUrl, posterUrl, templateId, musicId) => {
                  setPathBRenderedUrl(videoUrl);
                  setPathBPosterUrl(posterUrl);
                  setPathBTemplateId(templateId);
                  setPathBMusicId(musicId);
                  success('Simulated 1080x1920 Render Finished', 'Your Smart Template reel has been packaged for moderation review.');
                }}
              />
            )}

            {/* PATH C CONTAINER */}
            {mediaPath === 'photos_only' && (
              <div className="p-6 rounded-2xl bg-surface border border-accent/40 space-y-3">
                <div className="flex items-center gap-2 text-accent">
                  <Camera className="w-5 h-5" />
                  <h4 className="font-heading text-base font-bold">Path C: Static Photo Showcase</h4>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Your listing will remain a pure photo showcase with high-definition gallery zoom and fullscreen lightbox. <strong>It will never be turned into video.</strong>
                </p>
              </div>
            )}

            {/* PHOTO QUALITY GATE (10-20 photos required for ALL paths) */}
            <PhotoQualityGate
              photos={photos}
              coverPhotoIndex={coverPhotoIndex}
              onChangePhotos={setPhotos}
              onSelectCover={setCoverPhotoIndex}
              carMake={make}
            />

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs font-semibold hover:bg-surface-3 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Specifications</span>
              </button>

              <button
                type="button"
                onClick={handleStep2Submit}
                className="px-7 py-3 rounded-xl bg-accent hover:bg-accent-hover text-bg font-bold text-xs shadow-lg shadow-accent/20 transition-all flex items-center gap-2"
              >
                <span>Proceed to Review & Feed Preview</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 3: REVIEW & LIVE PREVIEW */}
        {/* ------------------------------------------------------------- */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in">
            <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 space-y-4">
              <div className="border-b border-border pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-text">
                    Step 3: Review & Live Feed Preview
                  </h3>
                  <p className="text-xs text-muted">
                    Verify how your listing card appears to Dubai buyers before submitting for moderation.
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-warning/15 text-warning border border-warning/30">
                  Ready for Moderation
                </span>
              </div>

              {/* Side-by-side: Feed Card Preview & Specs Summary */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-4">
                {/* Live Card Preview */}
                <div className="md:col-span-5 max-w-[280px] mx-auto">
                  <p className="text-xs font-semibold text-text mb-2 text-center flex items-center justify-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-accent" />
                    <span>How it looks in Feed</span>
                  </p>
                  <ListingCard listing={previewListing} />
                </div>

                {/* Listing Details Audit */}
                <div className="md:col-span-7 space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2.5">
                    <h4 className="font-heading text-sm font-bold text-text">Listing Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-muted">
                      <div>Vehicle: <span className="font-semibold text-text">{year} {make} {model}</span></div>
                      <div>Price: <span className="font-semibold text-accent">{formatAed(price)}</span></div>
                      <div>Mileage: <span className="font-semibold text-text">{formatKm(mileage)}</span></div>
                      <div>Area: <span className="font-semibold text-text">{dubaiArea}, Dubai</span></div>
                      <div>Media Path: <span className="font-semibold text-accent-2 capitalize">{mediaPath.replace('_', ' ')}</span></div>
                      <div>Photos: <span className="font-semibold text-text">{photos.length} verified photos</span></div>
                      <div>Contact: <span className="font-semibold text-text capitalize">{contactPreference}</span></div>
                      <div>Seller: <span className="font-semibold text-text">{user?.name || 'Verified Seller'}</span></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-accent font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>Ready for Dubai Supercar Moderation</span>
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed">
                      Upon submission, your listing is sent to the {SITE_CONFIG.name} moderation queue with status <strong>Pending Review</strong>. You can view, edit, or delete it anytime from your Seller Dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs font-semibold hover:bg-surface-3 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Media Studio</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitListing}
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent to-[#C49B55] hover:from-accent-hover hover:to-accent text-bg font-extrabold text-sm shadow-xl shadow-accent/25 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{isSubmitting ? 'Submitting to Queue...' : 'Submit for Review'}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
