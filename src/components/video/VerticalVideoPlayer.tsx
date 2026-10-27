'use client';

import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { getLuxuryFallbackPoster } from '@/config/demoMedia';

interface VerticalVideoPlayerProps {
  videoUrl?: string;
  posterUrl?: string;
  title: string;
  make: string;
  aspectRatio?: '9:16' | '16:9';
  autoPlay?: boolean;
  className?: string;
  onLeadTrigger?: () => void;
}

export function VerticalVideoPlayer({
  videoUrl,
  posterUrl,
  title,
  make,
  aspectRatio = '9:16',
  autoPlay = true,
  className = '',
}: VerticalVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failedSource, setFailedSource] = useState<string>();
  const hasError = !videoUrl || failedSource === videoUrl;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fallbackPoster = getLuxuryFallbackPoster(title, make);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(current);
    setProgress((current / dur) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    if (autoPlay) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * (videoRef.current.duration || 1);
    videoRef.current.currentTime = newTime;
    setProgress(pos * 100);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2800);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={togglePlay}
      className={`relative group overflow-hidden rounded-2xl bg-black cursor-pointer select-none shadow-2xl border border-border/60 ${className} ${
        aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'
      }`}
    >
      {videoUrl?.startsWith('/demo/') && <span className="absolute top-3 left-3 z-20 px-2 py-1 rounded-full text-[10px] bg-black/70 text-white pointer-events-none">Sample footage · prototype</span>}
      {/* Fallback Animated Poster if video error or no video */}
      {hasError || !videoUrl ? (
        <div className="absolute inset-0 flex flex-col justify-between p-6 bg-[#0A0C10] dubai-grid">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>Cinematic Poster</span>
            </span>
          </div>

          <div className="relative z-10 text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/40 text-accent flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <Play className="w-7 h-7 fill-accent ml-1" />
            </div>
            <h3 className="font-heading text-lg font-bold text-text">{make}</h3>
            <p className="text-xs text-muted max-w-xs mx-auto line-clamp-2">{title}</p>
            <p role="status" className="text-xs text-muted">{videoUrl ? 'Video unavailable. Your listing photos are still available.' : 'No video selected.'}</p>
            {videoUrl && <button type="button" onClick={(event) => { event.stopPropagation(); setFailedSource(undefined); }} className="mt-3 px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold">Retry video</button>}
          </div>

          <div className="text-center text-[10px] text-accent/80 tracking-widest uppercase">
            Vehicle Spot Dynamic Reel
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl || fallbackPoster}
          playsInline
          loop
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={() => setFailedSource(videoUrl)}
          className="w-full h-full object-cover"
        />
      )}

      {/* Center Play Indicator when Paused */}
      {!isPlaying && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] transition-all">
          <div className="w-16 h-16 rounded-full bg-accent/90 text-bg flex items-center justify-center shadow-2xl scale-110 transition-transform">
            <Play className="w-7 h-7 fill-bg ml-1" />
          </div>
        </div>
      )}

      {/* Top Gradient Overlay */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Video Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 p-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress scrub bar */}
        <div
          onClick={handleSeek}
          className="w-full h-2 bg-white/20 hover:h-2.5 rounded-full cursor-pointer overflow-hidden transition-all relative mb-3"
        >
          <div
            className="h-full bg-accent relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow" />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <span className="text-[11px] font-mono text-white/80">
              {formatSeconds(currentTime)} / {formatSeconds(duration || 15)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
