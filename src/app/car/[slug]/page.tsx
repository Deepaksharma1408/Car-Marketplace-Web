'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { VerticalVideoPlayer } from '@/components/video/VerticalVideoPlayer';
import { ContactActionButtons } from '@/components/listings/ContactActionButtons';
import { ListingInteractions } from '@/components/listings/ListingInteractions';
import { ListingCard } from '@/components/listings/ListingCard';
import { useToast } from '@/components/ui/Toast';
import { getListingBySlug, getListings } from '@/lib/mockApi';
import { Listing } from '@/types';
import { formatAed, formatKm } from '@/lib/utils';
import { SITE_CONFIG } from '@/config/site';
import { 
  ShieldCheck, 
  MapPin, 
  Gauge, 
  Calendar, 
  Share2, 
  Copy, 
  Check, 
  Camera, 
  Play, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Info,
  Smartphone,
  Flame,
  Award
} from 'lucide-react';

export default function PublicListingPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { success, info } = useToast();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'photos'>('video');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [moreFromSeller, setMoreFromSeller] = useState<Listing[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const item = await getListingBySlug(slug);
        setListing(item);
        if (item) {
          setActiveMediaTab(item.mediaPath === 'photos_only' ? 'photos' : 'video');
          // Load more from this seller or similar
          const others = await getListings({ limit: 8 });
          setMoreFromSeller(others.filter((c) => c.id !== item.id && c.status === 'live'));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    const refresh = () => { if (slug) void loadData(); };
    refresh();
    window.addEventListener('vehiclespot-data-change', refresh);
    window.addEventListener('storage', refresh);
    return () => { window.removeEventListener('vehiclespot-data-change', refresh); window.removeEventListener('storage', refresh); };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 w-full flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-xs text-muted font-medium">Loading luxury Dubai reel...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4 my-auto">
          <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mx-auto text-muted">
            <Info className="w-8 h-8" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-text">Listing Not Found</h2>
          <p className="text-xs text-muted">
            The requested vehicle listing may have been unlisted, archived, or moved by the seller.
          </p>
          <Link
            href="/"
            className="inline-flex px-5 py-2.5 rounded-xl bg-accent text-bg font-bold text-xs shadow-md"
          >
            Return to Showcase
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isVideoAvailable = listing.mediaPath !== 'photos_only' && !!listing.videoUrl;
  const isSold = listing.status === 'sold';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    success('Link Copied to Clipboard', 'Share this Dubai luxury reel with clients or friends.');
    setTimeout(() => setCopied(false), 2500);
  };

  // Structured JSON-LD Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: listing.title,
    manufacturer: listing.make,
    model: listing.model,
    modelDate: listing.year,
    vehicleIdentificationNumber: listing.id,
    itemCondition: 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: 'AED',
      availability: isSold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      seller: {
        '@type': listing.sellerType === 'dealer' ? 'AutoDealer' : 'Person',
        name: listing.sellerName,
        telephone: listing.sellerPhone,
      },
    },
    image: listing.photos,
    description: listing.description,
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />

      {/* Structured JSON-LD Script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Mobile "Open in App" Banner */}
      <aside aria-label="Mobile App CTA" className="lg:hidden bg-gradient-to-r from-surface-2 via-[#181D28] to-surface-2 border-b border-border px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/20 text-accent">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-text">Watch in 60fps on {SITE_CONFIG.name} App</p>
            <p className="text-[10px] text-muted">Immersive sound & instant Dubai RTA check</p>
          </div>
        </div>
        <button
          onClick={() => {
            alert(`Opening ${SITE_CONFIG.name} mobile app deep-link...`);
          }}
          className="px-3 py-1.5 rounded-lg bg-accent text-bg font-bold text-[11px] shrink-0"
        >
          Open App
        </button>
      </aside>

      {/* Main Listing Content Container */}
      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 flex-1">
        {/* Breadcrumb / Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-text font-medium">{listing.make}</span>
            <span>/</span>
            <span className="truncate max-w-xs">{listing.model}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-xs font-semibold text-text flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share Reel'}</span>
            </button>
          </div>
        </div>

        {/* Status Alerts if Sold or Under Review */}
        {isSold && (
          <div className="mb-8 p-4 rounded-2xl bg-danger/10 border border-danger/30 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-danger/20 text-danger">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text">This vehicle has been marked as SOLD</h4>
              <p className="text-xs text-muted">
                This {listing.year} {listing.make} {listing.model} was acquired through the {SITE_CONFIG.name} Dubai network. Inquiries are disabled.
              </p>
            </div>
          </div>
        )}

        {listing.status === 'pending_review' && (
          <div className="mb-8 p-4 rounded-2xl bg-warning/10 border border-warning/30 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-warning/20 text-warning">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text">Pending Moderator Approval</h4>
              <p className="text-xs text-muted">
                This listing is in the moderation queue and will go live once verified by our Dubai compliance team.
              </p>
            </div>
          </div>
        )}

        {/* 2-Column Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (5 Cols): 9:16 Media Showcase */}
          <div className="lg:col-span-5 space-y-4">
            {/* Media Selector Tabs (Video vs Photos) */}
            <div className="flex items-center p-1 rounded-xl bg-surface-2 border border-border">
              {isVideoAvailable && (
                <button
                  onClick={() => setActiveMediaTab('video')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    activeMediaTab === 'video'
                      ? 'bg-accent text-bg shadow'
                      : 'text-muted hover:text-text'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Vertical Video Reel</span>
                </button>
              )}
              <button
                onClick={() => setActiveMediaTab('photos')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  activeMediaTab === 'photos' || !isVideoAvailable
                    ? 'bg-accent text-bg shadow'
                    : 'text-muted hover:text-text'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Photos ({listing.photos.length})</span>
              </button>
            </div>

            {/* Active Media Container */}
            <div className="relative rounded-3xl overflow-hidden bg-surface border border-border shadow-2xl">
              {activeMediaTab === 'video' && isVideoAvailable ? (
                <VerticalVideoPlayer
                  videoUrl={listing.videoUrl}
                  posterUrl={listing.videoPoster}
                  title={listing.title}
                  make={listing.make}
                  autoPlay={true}
                  className="w-full"
                />
              ) : (
                <div className="relative aspect-[9/16] w-full bg-black group">
                  <img
                    src={listing.photos[selectedPhotoIndex] || listing.photos[0]}
                    alt={`${listing.title} view ${selectedPhotoIndex + 1}`}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => setLightboxOpen(true)}
                  />

                  {/* Top Overlay Badge */}
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono">
                      {selectedPhotoIndex + 1} / {listing.photos.length}
                    </span>
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-colors"
                    aria-label="Open fullscreen photo lightbox"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Prev / Next photo buttons */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : listing.photos.length - 1));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhotoIndex((prev) => (prev < listing.photos.length - 1 ? prev + 1 : 0));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Photos Strip / Thumbnails */}
            <div className="space-y-2">
              <p className="text-[11px] text-muted font-medium flex items-center justify-between">
                <span>Verified Photo Gallery ({listing.photos.length} photos)</span>
                {listing.mediaPath === 'photos_only' && (
                  <span className="text-accent text-[10px]">Photos never become video</span>
                )}
              </p>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {listing.photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveMediaTab('photos');
                      setSelectedPhotoIndex(i);
                    }}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeMediaTab === 'photos' && selectedPhotoIndex === i
                        ? 'border-accent scale-105 shadow-md'
                        : 'border-border/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Vehicle Details, Pricing, Dealer & Leads */}
          <div className="lg:col-span-7 space-y-8">
            {/* Title, Badges & Price Header */}
            <div className="space-y-3 border-b border-border pb-6">
              <div className="flex flex-wrap items-center gap-2">
                {listing.isDealerVerified && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent/15 text-accent border border-accent/40 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <span>Verified Dubai Dealer</span>
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-2 text-text border border-border flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>{listing.dubaiArea}, Dubai</span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-2 text-muted border border-border">
                  Condition: {listing.condition}
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text tracking-tight">
                {listing.title}
              </h1>

              <div className="flex flex-wrap items-baseline gap-4 pt-2">
                <span className="font-heading text-3xl sm:text-4xl font-extrabold text-accent">
                  {formatAed(listing.price)}
                </span>
                <span className="text-xs text-muted">
                  Excluding registration & RTA export charges
                </span>
              </div>
            </div>

            {/* Quick Specs 4-Box Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-surface-2 border border-border text-center space-y-1">
                <p className="text-[10px] text-muted uppercase tracking-wider">Year</p>
                <p className="font-heading text-base font-bold text-text">{listing.year}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-2 border border-border text-center space-y-1">
                <p className="text-[10px] text-muted uppercase tracking-wider">Mileage</p>
                <p className="font-heading text-base font-bold text-text">{formatKm(listing.mileage)}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-2 border border-border text-center space-y-1">
                <p className="text-[10px] text-muted uppercase tracking-wider">Fuel Type</p>
                <p className="font-heading text-base font-bold text-text truncate">{listing.fuelType}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-2 border border-border text-center space-y-1">
                <p className="text-[10px] text-muted uppercase tracking-wider">Body</p>
                <p className="font-heading text-base font-bold text-text truncate">{listing.bodyType}</p>
              </div>
            </div>

            {/* Seller Contact Card & Lead Action Buttons */}
            <div className="p-6 rounded-2xl bg-surface border border-border shadow-xl space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={listing.sellerAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop'}
                    alt={listing.sellerName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-accent/40"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-heading text-base font-bold text-text">{listing.sellerName}</h4>
                      {listing.isDealerVerified && (
                        <ShieldCheck className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <p className="text-xs text-muted">
                      {listing.sellerType === 'dealer' ? 'Official Licensed Dealer' : 'Private UAE Collector'}
                    </p>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-xs text-accent font-semibold flex items-center gap-1 justify-end">
                    <Sparkles className="w-3.5 h-3.5" />
                    Verified Seller
                  </span>
                  <p className="text-[11px] text-muted">Immediate response</p>
                </div>
              </div>

              {/* Real Lead Buttons */}
              {!isSold ? (
                <ContactActionButtons
                  listingId={listing.id}
                  sellerPhone={listing.sellerPhone}
                  sellerName={listing.sellerName}
                  vehicleTitle={listing.title}
                  contactPreference={listing.contactPreference}
                  isDealerVerified={listing.isDealerVerified}
                />
              ) : (
                <div className="p-4 rounded-xl bg-surface-2 text-center text-xs text-muted">
                  Direct inquiries closed for this vehicle.
                </div>
              )}
            </div>

            {/* Detailed Vehicle Description */}
            <div className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-text">Vehicle Overview & Options</h3>
              <p className="text-sm text-muted leading-relaxed whitespace-pre-line bg-surface-2/40 p-5 rounded-2xl border border-border">
                {listing.description}
              </p>
            </div>

            {/* Full Technical Specifications Table */}
            <div className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-text">Technical Specifications</h3>
              <div className="rounded-2xl border border-border overflow-hidden bg-surface">
                <table className="w-full text-xs text-left">
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted bg-surface-2/50 w-1/3">Make</td>
                      <td className="py-3 px-4 font-semibold text-text">{listing.make}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted bg-surface-2/50">Model</td>
                      <td className="py-3 px-4 font-semibold text-text">{listing.model}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted bg-surface-2/50">Production Year</td>
                      <td className="py-3 px-4 font-semibold text-text">{listing.year}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted bg-surface-2/50">Odometer Reading</td>
                      <td className="py-3 px-4 font-semibold text-text">{formatKm(listing.mileage)}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted bg-surface-2/50">Transmission</td>
                      <td className="py-3 px-4 font-semibold text-text">{listing.transmission}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted bg-surface-2/50">Fuel Type</td>
                      <td className="py-3 px-4 font-semibold text-text">{listing.fuelType}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted bg-surface-2/50">Condition</td>
                      <td className="py-3 px-4 font-semibold text-text">{listing.condition}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted bg-surface-2/50">Dubai Location</td>
                      <td className="py-3 px-4 font-semibold text-text">{listing.dubaiArea}, Dubai, UAE</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted bg-surface-2/50">Media Format</td>
                      <td className="py-3 px-4 font-semibold text-accent">
                        {listing.mediaPath === 'ready_video' ? 'Ready-Made 9:16 Video' : listing.mediaPath === 'smart_template' ? 'Smart Template AI Reel' : 'Verified Photo Showcase'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-muted bg-surface-2/50">Marketplace Scope</td>
                      <td className="py-3 px-4 text-muted">Stage 1: Dubai Luxury Only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* "More from this seller" or Similar Dubai Supercars Strip */}
        {moreFromSeller.length > 0 && (
          <div className="mt-20 pt-12 border-t border-border space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-text">
                  More Luxury Vehicles in Dubai
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Inspected supercars and luxury SUVs available for immediate test inspection
                </p>
              </div>

              <Link
                href="/#featured"
                className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
              >
                <span>View All Featured</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {moreFromSeller.slice(0, 4).map((car) => (
                <ListingCard key={car.id} listing={car} />
              ))}
            </div>
          </div>
        )}
        <div className="mt-8"><ListingInteractions listing={listing} /></div>
      </main>

      {/* Fullscreen Photo Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-between p-4 sm:p-6 animate-in fade-in">
          <div className="flex items-center justify-between text-white z-10">
            <span className="text-xs font-mono text-muted">
              {selectedPhotoIndex + 1} / {listing.photos.length}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-auto overflow-hidden">
            <img
              src={listing.photos[selectedPhotoIndex]}
              alt=""
              className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            <button
              onClick={() => setSelectedPhotoIndex((p) => (p > 0 ? p - 1 : listing.photos.length - 1))}
              className="absolute left-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => setSelectedPhotoIndex((p) => (p < listing.photos.length - 1 ? p + 1 : 0))}
              className="absolute right-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10">
            {listing.photos.map((p, i) => (
              <button
                key={i}
                onClick={() => setSelectedPhotoIndex(i)}
                className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  selectedPhotoIndex === i ? 'border-accent scale-110' : 'border-transparent opacity-50'
                }`}
              >
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
