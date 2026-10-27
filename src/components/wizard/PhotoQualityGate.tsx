'use client';

import React, { useState } from 'react';
import { preparePrototypePhoto } from '@/lib/prototypeStorage';
import { useToast } from '@/components/ui/Toast';
import { DEMO_MEDIA_CONFIG } from '@/config/demoMedia';
import { 
  Camera, 
  Upload, 
  X, 
  Star, 
  AlertTriangle, 
  CheckCircle2, 
  Image as ImageIcon,
  Move
} from 'lucide-react';

interface PhotoQualityGateProps {
  photos: string[];
  coverPhotoIndex: number;
  onChangePhotos: (photos: string[]) => void;
  onSelectCover: (index: number) => void;
  carMake?: string;
}

export function PhotoQualityGate({
  photos,
  coverPhotoIndex,
  onChangePhotos,
  onSelectCover,
  carMake = 'porsche',
}: PhotoQualityGateProps) {
  const { error, info } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [photoMessage, setPhotoMessage] = useState('');

  const minPhotos = 10;
  const maxPhotos = 20;

  const handleAddDemoPhotos = () => {
    // Pick photo pack based on car make
    const makeKey = carMake.toLowerCase().includes('ferrari')
      ? 'ferrari'
      : carMake.toLowerCase().includes('lambo')
      ? 'lamborghini'
      : carMake.toLowerCase().includes('rolls')
      ? 'rollsroyce'
      : carMake.toLowerCase().includes('g63') || carMake.toLowerCase().includes('mercedes')
      ? 'gwagon'
      : 'porsche';

    const pack = DEMO_MEDIA_CONFIG.photoPacks[makeKey as keyof typeof DEMO_MEDIA_CONFIG.photoPacks] || DEMO_MEDIA_CONFIG.photoPacks.porsche;
    onChangePhotos(pack);
    info('12 High-Res Photos Loaded', 'Sample photos loaded for this frontend demonstration.');
  };

  const handleSelectPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    const base = photos.every((photo) => photo.startsWith('http')) ? [] : photos;
    if (base.length + files.length > maxPhotos) {
      error('Too many photos', 'Choose at most 20 photos in total.');
      return;
    }
    setAnalyzing(true);
    setPhotoMessage('Preparing local photo previews…');
    try {
      const prepared = await Promise.all(Array.from(files).map(preparePrototypePhoto));
      onChangePhotos([...base, ...prepared]);
      if (!base.length) onSelectCover(0);
      setPhotoMessage(`${prepared.length} photos added. Resolution checked; previews saved at reduced size for this prototype.`);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unable to read photos.';
      setPhotoMessage(message);
      error('Photos not added', message);
    } finally { setAnalyzing(false); }
  };

  const handleRemovePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onChangePhotos(updated);
    if (index === coverPhotoIndex) onSelectCover(Math.max(0, Math.min(index, updated.length - 1)));
    else if (index < coverPhotoIndex) onSelectCover(coverPhotoIndex - 1);
  };

  const handleMovePhoto = (from: number, to: number) => {
    if (to < 0 || to >= photos.length) return;
    const updated = [...photos];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChangePhotos(updated);
    if (coverPhotoIndex === from) onSelectCover(to);
    else if (from < coverPhotoIndex && to >= coverPhotoIndex) onSelectCover(coverPhotoIndex - 1);
    else if (from > coverPhotoIndex && to <= coverPhotoIndex) onSelectCover(coverPhotoIndex + 1);
  };

  const isSatisfied = photos.length >= minPhotos && photos.length <= maxPhotos;

  return (
    <div className="space-y-4 rounded-2xl bg-surface-2 border border-border p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-heading text-base font-bold text-text">
              Photo Quality Gate ({photos.length} / {minPhotos}–{maxPhotos} Photos)
            </h4>
            {isSatisfied ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/20 text-accent border border-accent/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Passed</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-warning/20 text-warning border border-warning/40 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>{photos.length > maxPhotos ? `Remove ${photos.length - maxPhotos}` : `Need ${minPhotos - photos.length} more`}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-0.5">
            10 to 20 verified high-resolution photos required. Choose JPG, PNG or WebP images, at least 800 × 600 pixels.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddDemoPhotos}
          className="px-3 py-1.5 rounded-xl bg-accent/15 hover:bg-accent/25 border border-accent/30 text-accent font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Load 12 HD {carMake} Photos</span>
        </button>
      </div>

      <label className="block rounded-xl border border-dashed border-accent/40 p-4 text-xs text-muted">
        <span className="block mb-2 font-semibold text-text">{analyzing ? 'Preparing photos…' : 'Choose photos from your device'}</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={analyzing} aria-label="Choose listing photos" className="block w-full" onChange={(event) => { void handleSelectPhotos(event.target.files); event.target.value = ''; }} />
        <span className="block mt-2 text-[10px]">Your first selection replaces the demo photos. Further selections add to your gallery, up to 20.</span>
      </label>
      {photoMessage && <p role="status" className="text-xs text-muted">{photoMessage}</p>}
      {/* Grid of uploaded photos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {photos.map((photoUrl, index) => {
          const isCover = index === coverPhotoIndex;
          return (
            <div
              key={index}
              className={`group relative aspect-square rounded-xl overflow-hidden border-2 bg-black transition-all ${
                isCover ? 'border-accent shadow-md shadow-accent/20 ring-1 ring-accent' : 'border-border hover:border-accent/50'
              }`}
            >
              <img src={photoUrl} alt="" className="w-full h-full object-cover" />

              {/* Cover badge */}
              {isCover && (
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-accent text-bg text-[9px] font-extrabold flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-bg" />
                  <span>Cover</span>
                </div>
              )}

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="p-1 rounded bg-danger/80 hover:bg-danger text-white text-xs transition-colors"
                    title="Remove photo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {!isCover && (
                    <button
                      type="button"
                      onClick={() => onSelectCover(index)}
                      className="p-1 rounded bg-accent/80 hover:bg-accent text-bg font-bold text-[10px] transition-colors"
                      title="Set as cover"
                    >
                      Make Cover
                    </button>
                  )}
                </div>

                {/* Move Left / Right */}
                <div className="flex items-center justify-between text-white text-[10px]">
                  <button
                    type="button"
                    onClick={() => handleMovePhoto(index, index - 1)}
                    disabled={index === 0}
                    className="p-1 rounded bg-black/60 hover:bg-black/90 disabled:opacity-30"
                  >
                    ←
                  </button>
                  <span className="font-mono text-[9px]">#{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleMovePhoto(index, index + 1)}
                    disabled={index === photos.length - 1}
                    className="p-1 rounded bg-black/60 hover:bg-black/90 disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Upload Add Placeholder if below max */}
        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={handleAddDemoPhotos}
            className="aspect-square rounded-xl border border-dashed border-border hover:border-accent/60 bg-surface/50 hover:bg-surface flex flex-col items-center justify-center gap-1.5 text-muted hover:text-accent transition-colors"
          >
            <Upload className="w-5 h-5 text-accent" />
            <span className="text-[11px] font-semibold">Load Demo Photos</span>
            <span className="text-[9px] text-muted">Min 800x600</span>
          </button>
        )}
      </div>

      <div className="text-[11px] text-muted flex items-center justify-between pt-1">
        <span>Click &quot;Make Cover&quot; to set the listing hero photo.</span>
        <span className="text-accent font-medium">Local preview · no cloud upload</span>
      </div>
    </div>
  );
}
