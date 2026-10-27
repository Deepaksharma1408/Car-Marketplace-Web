'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LifestyleSection, FinderAndComparison, ShowroomExplorer } from '@/components/home/DiscoverySections';
import { ListingCard } from '@/components/listings/ListingCard';
import { FeaturedCarShowcase } from '@/components/listings/FeaturedCarShowcase';
import { DealerVerificationModal } from '@/components/dealers/DealerVerificationModal';
import { getListings } from '@/lib/mockApi';
import { Listing } from '@/types';
import { SITE_CONFIG } from '@/config/site';
import { 
  Play, 
  Sparkles, 
  ShieldCheck, 
  UploadCloud, 
  Wand2, 
  Camera, 
  MessageSquare, 
  Phone, 
  ChevronRight, 
  ChevronLeft,
  Plus, 
  Building2, 
  Check, 
  ChevronDown, 
  Star,
  Layers,
  ArrowRight,
  Search,
  Filter,
  X,
  Gauge,
  MapPin,
  Flame,
  Award,
  Sun,
  Moon,
  LayoutGrid,
  ListFilter,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedMediaType, setSelectedMediaType] = useState<'all' | 'video' | 'photos'>('all');
  const [selectedBodyType, setSelectedBodyType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_desc' | 'price_asc' | 'mileage_asc' | 'views'>('newest');

  // Homepage slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const refresh = () => { void getListings({ status: 'live' }).then(setAllListings).catch(() => {}); };
    refresh();
    window.addEventListener('vehiclespot-data-change', refresh);
    window.addEventListener('storage', refresh);
    return () => { window.removeEventListener('vehiclespot-data-change', refresh); window.removeEventListener('storage', refresh); };
  }, []);

  // Top Luxury Marques for Marketplace Quick Filter
  const luxuryBrands = [
    { name: 'Ferrari', origin: 'Maranello, Italy', logo: '/brands/ferrari.png', count: 5, desc: 'SF90, 296 GTB, 812' },
    { name: 'Porsche', origin: 'Stuttgart, Germany', logo: '/brands/porsche.png', count: 5, desc: '911 GT3 RS, Taycan, GT4 RS' },
    { name: 'Lamborghini', origin: 'Sant’Agata, Italy', logo: '/brands/lamborghini.png', count: 4, desc: 'Revuelto, Urus, Huracán' },
    { name: 'Rolls-Royce', origin: 'Goodwood, England', logo: '/brands/rolls-royce.png', count: 4, desc: 'Cullinan, Spectre, Ghost' },
    { name: 'Mercedes-AMG', origin: 'Affalterbach, Germany', logo: '/brands/mercedes-benz.png', count: 4, desc: 'G63 Mansory, GT Black' },
    { name: 'Bentley', origin: 'Crewe, England', logo: '/brands/bentley.png', count: 2, desc: 'Continental GT, Flying Spur' },
    { name: 'McLaren', origin: 'Woking, England', logo: '/brands/mclaren.png', count: 2, desc: '750S Spider, Artura' },
    { name: 'Range Rover', origin: 'Solihull, England', logo: '/brands/land-rover.png', count: 2, desc: 'SV Autobiography, Defender' },
    { name: 'Aston Martin', logo: '/brands/aston-martin.png' },
    { name: 'Bugatti', logo: '/brands/bugatti.png' },
    { name: 'Audi', logo: '/brands/audi.png' },
    { name: 'BMW', logo: '/brands/bmw.png' },
    { name: 'Maserati', logo: '/brands/maserati.png' },
    { name: 'Tesla', logo: '/brands/tesla.png' },
    { name: 'Lexus', logo: '/brands/lexus.png' },
    { name: 'Jaguar', logo: '/brands/jaguar.png' },
  ];

  // Body style categories
  const bodyStyles = [
    { id: 'all', label: 'All Body Types' },
    { id: 'supercar', label: 'Supercars & Hypercars' },
    { id: 'suv', label: 'Luxury SUVs' },
    { id: 'coupe', label: 'Coupes & GTs' },
    { id: 'convertible', label: 'Spiders & Convertibles' },
  ];

  // Featured Dealerships
  const featuredDealerships = [
    {
      name: 'Al-Futtaim Prestige Motors',
      area: 'Downtown Dubai & Festival City',
      carsCount: 8,
      license: 'DED #108421',
      rating: 4.9,
      specialty: 'Bespoke Ferrari, Rolls-Royce & Bugatti',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'VIP Motors UAE',
      area: 'Sheikh Zayed Road, Dubai',
      carsCount: 7,
      license: 'DED #982341',
      rating: 5.0,
      specialty: 'Exclusive Track & Hypercar Showroom',
      image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Silicon East Exotics',
      area: 'DIFC Gate Precinct',
      carsCount: 5,
      license: 'DED #773120',
      rating: 4.9,
      specialty: 'Collector-Grade Classics & Limited Editions',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Pearl Motors Luxury',
      area: 'Al Quoz Industrial Area 1',
      carsCount: 4,
      license: 'DED #831092',
      rating: 4.8,
      specialty: 'Custom Mansory & Brabus Off-Roaders',
      image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=600&auto=format&fit=crop',
    },
  ];

  // Filter listings based on user search parameters
  const filteredListings = useMemo(() => {
    return allListings
      .filter((listing) => {
        // Query search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = listing.title.toLowerCase().includes(q);
          const matchMake = listing.make.toLowerCase().includes(q);
          const matchModel = listing.model.toLowerCase().includes(q);
          const matchArea = listing.dubaiArea.toLowerCase().includes(q);
          if (!matchTitle && !matchMake && !matchModel && !matchArea) return false;
        }

        // Make filter
        if (selectedMake !== 'all' && listing.make.toLowerCase() !== selectedMake.toLowerCase()) {
          return false;
        }

        // Budget filter
        if (selectedBudget === 'under_750k' && listing.price > 750000) return false;
        if (selectedBudget === 'under_1.25m' && listing.price > 1250000) return false;
        if (selectedBudget === 'under_2m' && listing.price > 2000000) return false;
        if (selectedBudget === 'above_2m' && listing.price < 2000000) return false;

        // Area filter
        if (selectedArea !== 'all' && listing.dubaiArea !== selectedArea) return false;

        // Media Type filter
        if (selectedMediaType === 'video' && (!listing.videoUrl || listing.mediaPath === 'photos_only')) return false;
        if (selectedMediaType === 'photos' && listing.mediaPath !== 'photos_only') return false;

        // Body type filter
        if (selectedBodyType === 'supercar' && !(listing.bodyType.includes('Supercar') || listing.bodyType.includes('Hypercar'))) return false;
        if (selectedBodyType === 'suv' && !listing.bodyType.includes('SUV')) return false;
        if (selectedBodyType === 'coupe' && !(listing.bodyType.includes('Coupe') || listing.bodyType.includes('Tourer'))) return false;
        if (selectedBodyType === 'convertible' && !(listing.bodyType.includes('Convertible') || listing.bodyType.includes('Spider'))) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'mileage_asc') return a.mileage - b.mileage;
        if (sortBy === 'views') return b.publicStats.views - a.publicStats.views;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [allListings, searchQuery, selectedMake, selectedBudget, selectedArea, selectedMediaType, selectedBodyType, sortBy]);

  // Slideshow calculations
  const CARS_PER_SLIDE = 4;
  const totalSlides = Math.max(1, Math.ceil(filteredListings.length / CARS_PER_SLIDE));
  
  const slideshowRef = useRef<HTMLDivElement>(null);
  const slideshowPausedRef = useRef(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Drag tracking refs
  const dragStartXRef = useRef<number | null>(null);
  const dragCurrentXRef = useRef<number | null>(null);
  const wasDraggingRef = useRef<boolean>(false);

  useEffect(() => {
    if (slideshowRef.current) slideshowRef.current.scrollLeft = 0;
  }, [filteredListings]);

  // Advance at a constant speed, wrapping onto the identical second track.
  useEffect(() => {
    const viewport = slideshowRef.current;
    if (!viewport) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame: number;
    let previousTime = 0;
    let position = 0;
    const tick = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 0;
      previousTime = time;
      const loopWidth = viewport.scrollWidth / 2;
      if (!isDragging && !slideshowPausedRef.current && !reducedMotion.matches && loopWidth > 0) {
        // Retain subpixel movement even where scrollLeft rounds to whole pixels.
        if (Math.abs(viewport.scrollLeft - position) > 2) position = viewport.scrollLeft;
        position = (position + elapsed * 0.035) % loopWidth;
        viewport.scrollLeft = position;
        setCurrentSlide(Math.min(totalSlides - 1, Math.floor(position / loopWidth * totalSlides)));
      } else {
        position = viewport.scrollLeft;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [filteredListings, isDragging, totalSlides]);

  const goToSlide = (index: number) => {
    const viewport = slideshowRef.current;
    if (viewport) viewport.scrollLeft = (viewport.scrollWidth / 2) * index / totalSlides;
    setCurrentSlide(index);
  };

  const handleNextSlide = () => goToSlide((currentSlide + 1) % totalSlides);
  const handlePrevSlide = () => goToSlide((currentSlide - 1 + totalSlides) % totalSlides);

  // Mouse Drag handlers for desktop movable interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartXRef.current = e.clientX;
    dragCurrentXRef.current = e.clientX;
    wasDraggingRef.current = false;
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartXRef.current === null) return;
    dragCurrentXRef.current = e.clientX;
    const diff = e.clientX - dragStartXRef.current;
    if (Math.abs(diff) > 8) {
      wasDraggingRef.current = true;
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    if (dragStartXRef.current !== null && dragCurrentXRef.current !== null) {
      const distance = dragStartXRef.current - dragCurrentXRef.current;
      if (distance > 45) {
        handleNextSlide();
      } else if (distance < -45) {
        handlePrevSlide();
      }
    }
    dragStartXRef.current = null;
    dragCurrentXRef.current = null;
    setTimeout(() => {
      setIsDragging(false);
    }, 50);
  };

  const handleMouseLeave = () => {
    if (dragStartXRef.current !== null && dragCurrentXRef.current !== null) {
      const distance = dragStartXRef.current - dragCurrentXRef.current;
      if (distance > 60) {
        handleNextSlide();
      } else if (distance < -60) {
        handlePrevSlide();
      }
    }
    dragStartXRef.current = null;
    dragCurrentXRef.current = null;
    setIsDragging(false);
  };

  // Touch Swipe handlers for mobile & tablet movable interaction
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartXRef.current = e.touches[0].clientX;
    dragCurrentXRef.current = e.touches[0].clientX;
    wasDraggingRef.current = false;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartXRef.current === null) return;
    dragCurrentXRef.current = e.touches[0].clientX;
    const diff = e.touches[0].clientX - dragStartXRef.current;
    if (Math.abs(diff) > 8) {
      wasDraggingRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (dragStartXRef.current !== null && dragCurrentXRef.current !== null) {
      const distance = dragStartXRef.current - dragCurrentXRef.current;
      if (distance > 45) {
        handleNextSlide();
      } else if (distance < -45) {
        handlePrevSlide();
      }
    }
    dragStartXRef.current = null;
    dragCurrentXRef.current = null;
    setIsDragging(false);
  };

  // Prevent link navigation if user was dragging/swiping
  const handleClickCapture = (e: React.MouseEvent) => {
    if (wasDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      wasDraggingRef.current = false;
    }
  };

  const activeFiltersCount = 
    (searchQuery ? 1 : 0) +
    (selectedMake !== 'all' ? 1 : 0) +
    (selectedBudget !== 'all' ? 1 : 0) +
    (selectedArea !== 'all' ? 1 : 0) +
    (selectedMediaType !== 'all' ? 1 : 0) +
    (selectedBodyType !== 'all' ? 1 : 0);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedMake('all');
    setSelectedBudget('all');
    setSelectedArea('all');
    setSelectedMediaType('all');
    setSelectedBodyType('all');
    setSortBy('newest');
    setCurrentSlide(0);
  };

  const scrollToMarketplace = () => {
    const el = document.getElementById('marketplace-inventory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBrandClick = (brandName: string) => {
    if (selectedMake.toLowerCase() === brandName.toLowerCase()) {
      setSelectedMake('all');
    } else {
      setSelectedMake(brandName);
    }
    scrollToMarketplace();
  };

  const uploadPaths = [
    {
      id: 'path_a',
      title: 'Path A: Ready-Made Video',
      badge: 'Professional Reel',
      badgeColor: 'border-accent/40 bg-accent/10 text-accent',
      description: 'Upload a finished vertical 9:16 video reel. We check resolution and format for instant playback with zero re-encoding.',
      icon: <Play className="w-5 h-5 text-accent" />,
      features: [
        'Supports MP4/MOV up to 60 sec & 500 MB',
        'Automatic 720p/1080p metadata validation',
        'Pick your custom thumbnail frame',
        'Requires 10–20 high-res photos',
      ],
      note: 'Ideal for dealers with in-house videographers',
    },
    {
      id: 'path_b',
      title: 'Path B: Raw Clips + Smart Templates',
      badge: 'Lightweight AI Assistant',
      badgeColor: 'border-accent-2/40 bg-accent-2/10 text-accent-2',
      description: 'Upload 1 to 5 phone clips. Our simulated AI assistant auto-sorts angles, removes blur, and syncs cuts to curated Dubai beats.',
      icon: <Wand2 className="w-5 h-5 text-accent-2" />,
      features: [
        '9 Smart Templates (Premium, Sport, Cosy)',
        '9 Royalty-free Dubai music tracks',
        'Auto-slot assignment (Hero, Interior, Exhaust)',
        'Instant live preview before rendering',
      ],
      note: 'AI never alters or distorts the real car',
    },
    {
      id: 'path_c',
      title: 'Path C: Photos Only',
      badge: 'Traditional Photo Listing',
      badgeColor: 'border-muted/40 bg-surface-2 text-muted',
      description: 'Prefer classic photography? Upload 10 to 20 verified high-res photos with our canvas quality gate.',
      icon: <Camera className="w-5 h-5 text-muted" />,
      features: [
        '10–20 high-resolution photos required',
        'Canvas-based blur and contrast checks',
        'Drag-and-drop cover photo reordering',
        'Direct WhatsApp and Call buyer buttons',
      ],
      note: 'Photos never become video. Guaranteed.',
    },
  ];

  const faqs = [
    {
      q: `How does the ${SITE_CONFIG.name} search and filter work?`,
      a: `Our marketplace search bar connects directly to Dubai live inventory. You can filter by Marque (e.g., Ferrari, Porsche, Rolls-Royce), maximum budget in AED, Dubai location (Downtown, DIFC, Palm Jumeirah), and format (9:16 Video Reels vs High-Res Photos).`,
    },
    {
      q: 'Can I list a car with photos only, without a video reel?',
      a: 'Yes, absolutely! Path C is dedicated exclusively to photo listings. Crucially, your photos will NEVER be turned into automated slideshow videos. They remain clean, full-resolution interactive photo galleries.',
    },
    {
      q: 'How does the Smart Template AI Assistant work in Path B?',
      a: 'The AI media assistant analyzes your uploaded raw clips and maps them into optimal sequence slots: Hero exterior, Front stance, Cabin interior, Dashboard, and Exhaust. It detects camera blur or duplicate angles, pairs your clips with one of 9 Dubai soundtrack vibes, and renders a 10–20s reel. It never hallucinates or changes the vehicle appearance.',
    },
    {
      q: 'How do buyer inquiries reach me?',
      a: `Directly and instantly. ${SITE_CONFIG.name} is not a brokerage; when a verified buyer is interested in your car, they tap either WhatsApp or Call. This connects directly to your phone. We track lead metrics privately on your dashboard.`,
    },
    {
      q: 'What is required for Dealer Verification in Dubai?',
      a: 'Official dealerships must provide a valid Dubai Department of Economy & Tourism (DED) commercial trade license. Once verified by our compliance team, your listings receive the gold Verified Dealer badge.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg text-text transition-colors duration-200">
      <Navbar />

      {/* 1. CAR MARKETPLACE HERO WITH MULTI-CRITERIA SEARCH BAR */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-bg border-b border-border transition-colors">
        {/* Ambient background glows tailored to active theme */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-accent-2/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 dubai-grid opacity-30 pointer-events-none" />

        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Marketplace Title & Integrated Search */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-2 border border-accent/30 text-accent text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Dubai’s Premier Video-First Supercar Marketplace</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text tracking-tight leading-[1.1]">
                Find Your Next <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#E4C586] to-accent">
                  Dubai Supercar
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Welcome to <strong className="text-text">{SITE_CONFIG.name}</strong>. Browse inspected hypercars, grand tourers & luxury SUVs. Experience true engine sound via 9:16 vertical reels and message verified DED dealerships directly on WhatsApp.
              </p>

              {/* MARKETPLACE SEARCH & FILTER BOX */}
              <div className="glass-card rounded-2xl p-4 sm:p-5 border border-border shadow-2xl relative space-y-3.5 text-left">
                {/* Free Text Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by model, trim (e.g. 911 GT3 RS, SF90, Cullinan, G63)..."
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted text-sm font-medium focus:outline-none focus:border-accent transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Dropdowns Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {/* Make Selector */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">
                      Marque / Make
                    </label>
                    <select
                      value={selectedMake}
                      onChange={(e) => setSelectedMake(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-border text-text text-xs font-semibold focus:outline-none focus:border-accent"
                    >
                      <option value="all">All Luxury Makes</option>
                      <option value="Ferrari">Ferrari (5)</option>
                      <option value="Porsche">Porsche (5)</option>
                      <option value="Lamborghini">Lamborghini (4)</option>
                      <option value="Rolls-Royce">Rolls-Royce (4)</option>
                      <option value="Mercedes-Benz">Mercedes-AMG (4)</option>
                      <option value="Bentley">Bentley (2)</option>
                      <option value="McLaren">McLaren (2)</option>
                      <option value="Range Rover">Range Rover (2)</option>
                    </select>
                  </div>

                  {/* Budget Selector */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">
                      Max Price (AED)
                    </label>
                    <select
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-border text-text text-xs font-semibold focus:outline-none focus:border-accent"
                    >
                      <option value="all">Any Price</option>
                      <option value="under_750k">Under AED 750,000</option>
                      <option value="under_1.25m">Under AED 1,250,000</option>
                      <option value="under_2m">Under AED 2,000,000</option>
                      <option value="above_2m">AED 2,000,000+ (Hypercars)</option>
                    </select>
                  </div>

                  {/* Dubai Area Selector */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">
                      Dubai Location
                    </label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-border text-text text-xs font-semibold focus:outline-none focus:border-accent"
                    >
                      <option value="all">All Dubai Showrooms</option>
                      <option value="Downtown Dubai">Downtown Dubai</option>
                      <option value="DIFC">DIFC Gate</option>
                      <option value="Palm Jumeirah">Palm Jumeirah</option>
                      <option value="Dubai Marina">Dubai Marina</option>
                      <option value="Al Quoz">Al Quoz Showrooms</option>
                      <option value="Business Bay">Business Bay</option>
                    </select>
                  </div>
                </div>

                {/* Media Format & Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-border/50">
                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedMediaType('all')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedMediaType === 'all'
                          ? 'bg-accent/20 text-accent border border-accent/40'
                          : 'text-muted hover:text-text'
                      }`}
                    >
                      All Media
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedMediaType('video')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                        selectedMediaType === 'video'
                          ? 'bg-accent/20 text-accent border border-accent/40'
                          : 'text-muted hover:text-text'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Video Reels</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedMediaType('photos')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                        selectedMediaType === 'photos'
                          ? 'bg-accent/20 text-accent border border-accent/40'
                          : 'text-muted hover:text-text'
                      }`}
                    >
                      <Camera className="w-3 h-3" />
                      <span>Photos Only</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={resetAllFilters}
                        className="text-xs text-muted hover:text-danger flex items-center gap-1 transition-colors px-2"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>
                    )}
                    <button
                      onClick={scrollToMarketplace}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-bg font-bold text-xs shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Show {filteredListings.length} Supercars</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-muted">
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span>Verified DED Dealerships</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-accent-2" />
                  <span>Zero Buyer Commission</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>Direct WhatsApp Inquiries</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 min-w-0 w-full">
              <FeaturedCarShowcase listings={allListings} />
            </div>

          </div>
        </div>
      </section>

      {/* 2. TOP LUXURY MARQUES QUICK-FILTER GRID */}
      <section className="py-12 bg-surface-2 border-b border-border transition-colors">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-accent">
                Browse By Marque
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-text mt-0.5">
                Top Dubai Luxury Brands
              </h2>
            </div>
            <p className="text-xs text-muted">
              Click any marque to filter showroom inventory instantly
            </p>
          </div>

          <div className="brand-carousel overflow-hidden py-2" aria-label="Browse car brands">
            <div className="brand-carousel-track flex w-max">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex gap-3 pr-3" aria-hidden={copy === 1 ? true : undefined}>
                  {luxuryBrands.map((brand) => {
                    const isSelected = selectedMake.toLowerCase() === brand.name.toLowerCase();
                    const count = allListings.filter((listing) => listing.make.toLowerCase() === brand.name.toLowerCase()).length;
                    return (
                      <button
                        key={brand.name}
                        tabIndex={copy === 1 ? -1 : 0}
                        onClick={() => handleBrandClick(brand.name)}
                        aria-pressed={isSelected}
                        className={`w-40 sm:w-44 shrink-0 p-4 rounded-2xl flex flex-col items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${isSelected ? 'bg-accent/10 border-accent text-accent' : 'bg-surface text-text border-border hover:border-accent/50 hover:bg-surface-3'}`}
                      >
                        <div className="bg-white rounded-xl w-24 h-16 flex items-center justify-center mb-3">
                          <img src={brand.logo} alt="" width={80} height={48} className="h-12 w-20 object-contain" loading="lazy" />
                        </div>
                        <span className="text-xs font-bold">{brand.name}</span>
                        <span className="text-[10px] mt-1 text-muted">{count ? `${count} in Dubai` : 'Explore marque'}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LifestyleSection listings={allListings} />

      {/* 4. LIVE MARKETPLACE INVENTORY WITH SLIDESHOW & VIEW ALL CARS FEATURE */}
      <section id="marketplace-inventory" className="scroll-mt-36 py-8 sm:py-16 bg-bg transition-colors">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          
          {/* Marketplace Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-5 sm:mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  Live Dubai Marketplace
                </span>
                <span className="px-2 py-0.5 rounded-full bg-accent-2/15 text-accent-2 text-[10px] font-bold">
                  {filteredListings.length} Unique Vehicles
                </span>
                {(
                  <span className="hidden sm:flex px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-bold items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Interactive Slideshow</span>
                  </span>
                )}
              </div>
              <h2 className="font-heading text-xl sm:text-3xl font-extrabold text-text mt-1">
                Showroom Supercars For Sale
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-0.5">
                Every vehicle is verified with unique photography, cold start video walkarounds, and direct WhatsApp seller chat.
              </p>
            </div>

            {/* Actions: View All Cars Feature Button, Slideshow Navigation & Sort */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/cars" className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-bg font-extrabold text-xs shadow-lg shadow-accent/25 flex items-center gap-2 transition-all hover:scale-105" title="Browse all cars on the inventory page">
                <LayoutGrid className="w-4 h-4 stroke-[2.5]" />
                <span>View All Cars ({allListings.length})</span>
              </Link>

              {/* Slideshow Arrow Navigation (When in Slideshow mode) */}
              {totalSlides > 1 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-surface-2 p-1 rounded-xl border border-border">
                    <button
                      onClick={handlePrevSlide}
                      className="p-1.5 rounded-lg text-text hover:bg-surface hover:text-accent transition-colors"
                      title="Previous slide (or drag cards)"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono font-bold px-2 text-text">
                      {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
                    </span>
                    <button
                      onClick={handleNextSlide}
                      className="p-1.5 rounded-lg text-text hover:bg-surface hover:text-accent transition-colors"
                      title="Next slide (or drag cards)"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Sorting */}
              <div className="flex items-center gap-1.5">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-text focus:outline-none focus:border-accent"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="mileage_asc">Lowest Mileage</option>
                  <option value="views">Most Viewed Reels</option>
                </select>
              </div>
            </div>
          </div>

          {/* Body Style Filter Pills & View Mode Bar */}
          <div className="pb-3 mb-4 sm:pb-4 sm:mb-6 border-b border-border/60">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {bodyStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedBodyType(style.id)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedBodyType === style.id
                      ? 'bg-accent text-bg font-bold shadow-md shadow-accent/20'
                      : 'bg-surface text-muted hover:text-text border border-border'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>

          </div>

          {/* Active Filter Chips Bar (If filters applied) */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-surface-2 border border-border">
              <span className="text-xs text-muted font-medium flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-accent" />
                <span>Active Filters:</span>
              </span>

              {searchQuery && (
                <span className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-text flex items-center gap-1.5">
                  <span>Keyword: &quot;{searchQuery}&quot;</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-danger">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedMake !== 'all' && (
                <span className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-text flex items-center gap-1.5">
                  <span>Make: {selectedMake}</span>
                  <button onClick={() => setSelectedMake('all')} className="hover:text-danger">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedBudget !== 'all' && (
                <span className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-text flex items-center gap-1.5">
                  <span>Budget: {selectedBudget.replace('_', ' ').toUpperCase()}</span>
                  <button onClick={() => setSelectedBudget('all')} className="hover:text-danger">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedArea !== 'all' && (
                <span className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-text flex items-center gap-1.5">
                  <span>Location: {selectedArea}</span>
                  <button onClick={() => setSelectedArea('all')} className="hover:text-danger">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedMediaType !== 'all' && (
                <span className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-text flex items-center gap-1.5">
                  <span>Media: {selectedMediaType === 'video' ? 'Video Reels' : 'Photos Only'}</span>
                  <button onClick={() => setSelectedMediaType('all')} className="hover:text-danger">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedBodyType !== 'all' && (
                <span className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-text flex items-center gap-1.5">
                  <span>Body: {bodyStyles.find((b) => b.id === selectedBodyType)?.label}</span>
                  <button onClick={() => setSelectedBodyType('all')} className="hover:text-danger">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-accent hover:underline ml-auto"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* SLIDESHOW VIEW vs ALL CARS GRID */}
          {filteredListings.length > 0 ? (
              /* --- MODE 1: INTERACTIVE MOVABLE SLIDESHOW --- */
              <div className="space-y-4">
                {/* Slideshow Area with Floating Nav Chevrons and Movable Track */}
                <div className="relative group/slideshow">
                  {/* Movable Track with Drag & Touch Gesture listeners */}
                  <div
                    ref={slideshowRef}
                    onMouseEnter={() => { slideshowPausedRef.current = true; }}
                    onFocusCapture={() => { slideshowPausedRef.current = true; }}
                    onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) slideshowPausedRef.current = event.currentTarget.matches(':hover'); }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={(event) => { slideshowPausedRef.current = event.currentTarget.contains(document.activeElement); handleMouseLeave(); }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onClickCapture={handleClickCapture}
                    className={`relative overflow-hidden rounded-2xl select-none touch-pan-y ${
                      isDragging ? 'cursor-grabbing' : 'cursor-grab'
                    }`}
                  >
                    <div className="flex w-max gap-0">
                      {[0, 1].map((copy) => (
                        <div key={copy} className="flex gap-3 pr-3 sm:gap-6 sm:pr-6">
                          {filteredListings.map((listing) => (
                            <div key={`${copy}-${listing.id}`} className="w-[min(76vw,280px)] sm:w-[calc((100vw-4.5rem)/2)] lg:w-[calc((min(100vw,1440px)-9rem)/4)] shrink-0">
                              <ListingCard listing={listing} compactMobile />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Slideshow Pagination Controls & View All Feature CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 sm:gap-4 sm:pt-6 border-t border-border/60">
                  <div className="flex items-center gap-2 text-xs text-muted font-medium">
                    <span>
                      Showing cars <strong className="text-text">{currentSlide * CARS_PER_SLIDE + 1}–{Math.min((currentSlide + 1) * CARS_PER_SLIDE, filteredListings.length)}</strong> of <strong className="text-text">{filteredListings.length}</strong>
                    </span>
                  </div>

                  {/* Dot Indicators */}
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalSlides }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          goToSlide(idx);
                        }}
                        className={`h-2.5 rounded-full transition-all ${
                          idx === currentSlide
                            ? 'w-8 bg-accent shadow-xs'
                            : 'w-2.5 bg-border hover:bg-muted'
                        }`}
                        title={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <Link href="/cars" className="text-xs font-bold text-accent hover:underline flex items-center gap-1.5">
                    <span>View All {allListings.length} Cars</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
          ) : (
            <div className="text-center py-20 p-8 rounded-2xl bg-surface border border-dashed border-border max-w-lg mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-border text-muted flex items-center justify-center mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-text">No Supercars Match Your Filter</h3>
                <p className="text-xs text-muted mt-1">
                  Try broadening your price range or resetting brand/area filters to browse all active Dubai listings.
                </p>
              </div>
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 rounded-xl bg-accent text-bg font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Post a Car Banner */}
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-surface-2 border border-border flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="font-heading text-xl font-bold text-text">
                Selling a Supercar or Luxury Vehicle in Dubai?
              </h3>
              <p className="text-xs sm:text-sm text-muted max-w-xl">
                Get direct WhatsApp inquiries with zero broker commission. Upload finished video reels, use our smart AI templates, or upload high-res photos on {SITE_CONFIG.name}.
              </p>
            </div>
            <Link
              href="/dashboard/new-listing"
              className="px-6 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-bg font-bold text-xs shadow-lg shadow-accent/20 transition-all flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>List Your Car on {SITE_CONFIG.name}</span>
            </Link>
          </div>

        </div>
      </section>

      <FinderAndComparison listings={allListings} />
      <ShowroomExplorer listings={allListings} />

      {/* 5. FEATURED VERIFIED DUBAI DEALERS */}
      <section id="dealers" className="py-20 bg-surface border-t border-border transition-colors">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                Verified Commercial Network
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text mt-1">
                Featured Dubai Dealerships
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-0.5">
                Official DED-licensed automotive showrooms with verified inventory and direct contact.
              </p>
            </div>

            <button
              onClick={() => setVerificationModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-xs font-semibold text-text flex items-center gap-2 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-accent" />
              <span>Register as a Dealership</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDealerships.map((dealer) => (
              <div
                key={dealer.name}
                className="group rounded-2xl bg-surface-2 border border-border hover:border-accent/50 overflow-hidden transition-all duration-300 flex flex-col shadow-xs hover:shadow-xl"
              >
                <div className="relative h-44 overflow-hidden bg-black/60">
                  <img
                    src={dealer.image}
                    alt={dealer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-surface/90 text-accent border border-accent/40 backdrop-blur-md flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3 h-3 text-accent" />
                      <span>{dealer.license}</span>
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-md">
                      {dealer.carsCount} Cars
                    </span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="text-white text-xs font-bold truncate">
                      {dealer.name}
                    </p>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-muted">
                      <MapPin className="w-3 h-3 text-accent shrink-0" />
                      <span className="truncate">{dealer.area}</span>
                    </div>
                    <p className="text-[11px] text-text font-medium leading-tight">
                      {dealer.specialty}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-accent font-bold">
                      <Star className="w-3.5 h-3.5 fill-accent" />
                      <span>{dealer.rating}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedMake('all');
                        scrollToMarketplace();
                      }}
                      className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                    >
                      <span>View Stock</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. THE THREE UPLOAD PATHS (Visual Explainer) */}
      <section id="upload-paths" className="py-20 bg-bg transition-colors">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Seller & Dealer Flexibility
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text">
              Three Seamless Upload Paths
            </h2>
            <p className="text-sm text-muted">
              Whether you already have a 4K cut, 3 raw phone clips, or static photos, {SITE_CONFIG.name} gives you the fastest path to verified buyers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {uploadPaths.map((path) => (
              <div
                key={path.id}
                className="rounded-2xl bg-surface border border-border p-6 sm:p-8 flex flex-col justify-between hover:border-accent/40 transition-all hover:shadow-xl relative group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-surface-2 border border-border">
                      {path.icon}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${path.badgeColor}`}>
                      {path.badge}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-text mb-2">
                    {path.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mb-6">
                    {path.description}
                  </p>

                  <ul className="space-y-2.5 text-xs text-text mb-6">
                    {path.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                        <span className="text-muted leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-[11px] font-semibold text-accent-2 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>{path.note}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/dashboard/new-listing"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-bg font-bold text-sm shadow-lg shadow-accent/20 transition-all"
            >
              <span>Test the 3-Step Wizard Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-surface border-y border-border transition-colors">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Simplicity Meets Speed
            </span>
            <h2 className="font-heading text-3xl font-bold text-text">
              How Video-First Selling Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-surface-2 border border-border relative">
              <span className="font-heading text-5xl font-extrabold text-accent/20 absolute top-4 right-4">
                01
              </span>
              <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center font-bold mb-4">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-text mb-2">1. Upload Footage</h3>
              <p className="text-xs text-muted leading-relaxed">
                Drag and drop your ready 9:16 video reel, 1–5 raw iPhone walkaround clips, or high-definition photos. Browser checks format & resolution instantly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-2 border border-border relative">
              <span className="font-heading text-5xl font-extrabold text-accent-2/20 absolute top-4 right-4">
                02
              </span>
              <div className="w-10 h-10 rounded-xl bg-accent-2/15 border border-accent-2/30 text-accent-2 flex items-center justify-center font-bold mb-4">
                <Wand2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-text mb-2">2. Choose a Style</h3>
              <p className="text-xs text-muted leading-relaxed">
                Pick from 9 tailored Smart Templates (Royale, Apex, Drift, Lounge) and beat-synced tracks. The simulated AI assistant orders your angles automatically.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-2 border border-border relative">
              <span className="font-heading text-5xl font-extrabold text-accent/20 absolute top-4 right-4">
                03
              </span>
              <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center font-bold mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-text mb-2">3. Go Live in Seconds</h3>
              <p className="text-xs text-muted leading-relaxed">
                Submitted for human review. Once verified, your listing goes live with direct WhatsApp & phone contact buttons routing straight to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-bg transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Clear & Transparent
            </span>
            <h2 className="font-heading text-3xl font-bold text-text">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-surface overflow-hidden transition-colors shadow-xs"
                >
                  <button
                    id={`faq-question-${idx}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-heading font-semibold text-sm sm:text-base text-text">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-accent shrink-0 transition-transform duration-350 ease-in-out motion-reduce:transition-none ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    aria-hidden={!isOpen}
                    className={`grid transition-[grid-template-rows,opacity] duration-350 ease-in-out motion-reduce:transition-none ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="px-5 pb-5 pt-3 text-xs text-muted leading-relaxed border-t border-border/40">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Dealer Verification Modal */}
      <DealerVerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
