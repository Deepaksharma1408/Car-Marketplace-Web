'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { readPrototypeValue } from '@/lib/prototypeStorage';
import { useAuthStore } from '@/features/auth/store';
import { useToast } from '@/components/ui/Toast';
import { 
  getListings, 
  updateListing, 
  deleteListing, 
  archiveListing, 
  markAsSold, 
  relistListing, 
  getSocialVideos,
  createSocialVideo,
  deleteSocialVideo,
  requestDealerVerification
} from '@/lib/mockApi';
import { Listing, SocialVideo, ContactPreference, ListingStatus } from '@/types';
import { formatAed, formatKm, formatDate, exportToCsv } from '@/lib/utils';
import { SITE_CONFIG } from '@/config/site';
import { 
  LayoutDashboard, 
  Plus, 
  Car, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  TrendingUp, 
  MessageSquare, 
  Phone, 
  Share2, 
  Trash2, 
  Archive, 
  RotateCcw, 
  Edit3, 
  Check, 
  Download, 
  ShieldCheck, 
  Upload, 
  Sun, 
  Moon, 
  Film, 
  Video, 
  X, 
  Search, 
  Filter, 
  User as UserIcon,
  Sparkles,
  AlertTriangle,
  Award,
  Play
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, role, updateCurrentUser, deleteAccount } = useAuthStore();
  const { success, error, info } = useToast();

  const [activeTab, setActiveTab] = useState<'listings' | 'leads' | 'videos' | 'dealer' | 'settings'>('listings');
  const [isLightMode, setIsLightMode] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [socialVideos, setSocialVideos] = useState<SocialVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Table Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'createdAt' | 'price' | 'views'>('createdAt');

  // New Video Form (Individuals Only)
  const [newVideoCaption, setNewVideoCaption] = useState('');
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Settings state
  const [contactPref, setContactPref] = useState<ContactPreference>('both');
  const [userName, setUserName] = useState(user?.name || 'Hamdan Al-Maktoum');
  const [userPhone, setUserPhone] = useState(user?.phone || '+971 52 987 6543');

  // Modals for Compliance & Editing
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [tradeLicenseModal, setTradeLicenseModal] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editMileage, setEditMileage] = useState(0);
  const [editDescription, setEditDescription] = useState('');

  const [hasWizardDraft, setHasWizardDraft] = useState(false);
  useEffect(() => {
    let cancelled = false;
    readPrototypeValue(`listing-draft:${user?.id || 'guest'}`).then((draft) => {
      if (!cancelled) setHasWizardDraft(Boolean(draft));
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [user?.id]);

  const isDealer = role === 'dealer';
  const isIndividual = role === 'individual';

  const loadDashboardData = async () => {
    setLoading(true); setLoadError('');
    try {
      const allListings = await getListings();
      // Show user's listings or default demo seller listings
      const filtered = allListings.filter((listing) => listing.sellerId === user?.id);

      setListings(filtered);

      if (isIndividual) {
        const vids = await getSocialVideos(user?.id);
        setSocialVideos(vids);
      }
    } catch (err) {
      console.error(err); setLoadError('Unable to load your local dashboard. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const refresh = () => { void loadDashboardData(); };
    void Promise.resolve().then(refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('vehiclespot-data-change', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('vehiclespot-data-change', refresh); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, user?.id]);

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    document.documentElement.classList.toggle('light', !isLightMode);
  };

  // KPIs
  const liveCount = listings.filter((l) => l.status === 'live').length;
  const pendingCount = listings.filter((l) => l.status === 'pending_review').length;
  const rejectedCount = listings.filter((l) => l.status === 'rejected').length;
  const draftCount = listings.filter((l) => l.status === 'draft').length;
  const soldCount = listings.filter((l) => l.status === 'sold').length;
  const totalWhatsAppLeads = listings.reduce((acc, l) => acc + (l.privateStats?.whatsappLeads || 0), 0);
  const totalCallLeads = listings.reduce((acc, l) => acc + (l.privateStats?.callLeads || 0), 0);

  const handleOpenEdit = (listing: Listing) => {
    setEditingListing(listing);
    setEditPrice(listing.price);
    setEditMileage(listing.mileage);
    setEditDescription(listing.description);
  };

  const handleSaveEdit = async () => {
    if (!editingListing) return;
    const wasLive = editingListing.status === 'live';
    await updateListing(editingListing.id, {
      price: editPrice,
      mileage: editMileage,
      description: editDescription,
    });
    if (wasLive) {
      info(
        'Listing Updated & Re-routed to Review',
        'Rule: Editing a live listing returns it to Pending Review for moderator verification.'
      );
    } else {
      success('Listing Updated', 'Your changes have been saved.');
    }
    setEditingListing(null);
    loadDashboardData();
  };

  // Filtered Listings Table
  const tableListings = listings.filter((l) => {
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.dubaiArea.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Action Handlers
  const handleMarkAsSold = async (id: string) => {
    await markAsSold(id, user?.name || 'Seller');
    success('Vehicle Marked as Sold', 'Public listing now displays official sold status banner.');
    loadDashboardData();
  };

  const handleRelist = async (id: string) => {
    await relistListing(id, user?.name || 'Seller');
    info('Vehicle Relisted', 'Listing resubmitted to moderation queue for verification.');
    loadDashboardData();
  };

  const handleArchive = async (id: string) => {
    await archiveListing(id, user?.name || 'Seller');
    info('Listing Archived', 'Listing moved to archive storage.');
    loadDashboardData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently delete this vehicle listing?')) {
      await deleteListing(id, user?.name || 'Seller');
      success('Listing Deleted', 'Vehicle removed from your inventory.');
      loadDashboardData();
    }
  };

  const handleExportCsv = () => {
    const exportRows = listings.map((l) => ({
      Title: l.title,
      Make: l.make,
      Model: l.model,
      Year: l.year,
      Price_AED: l.price,
      Mileage_KM: l.mileage,
      Area: l.dubaiArea,
      Status: l.status,
      WhatsApp_Leads: l.privateStats?.whatsappLeads || 0,
      Call_Leads: l.privateStats?.callLeads || 0,
      Created_At: l.createdAt,
    }));
    exportToCsv('vehiclespot_inventory_export', exportRows);
    success('CSV Export Downloaded', 'Exported listings to local spreadsheet file.');
  };

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoCaption) return;

    await createSocialVideo({
      userId: user?.id || 'ind_1',
      userName: user?.name || 'Hamdan Al-Maktoum',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
      caption: newVideoCaption,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-through-the-city-at-night-42861-large.mp4',
      videoPoster: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1080&auto=format&fit=crop',
      duration: 16,
    });

    setNewVideoCaption('');
    setVideoModalOpen(false);
    success('Social Reel Published', 'Your non-sale car video is now live on your profile.');
    loadDashboardData();
  };

  const handleDeleteVideo = async (id: string) => {
    await deleteSocialVideo(id);
    info('Video Reel Deleted', 'Social video removed from your account.');
    loadDashboardData();
  };

  const handleDownloadData = () => {
    const backup = {
      user,
      listings,
      timestamp: new Date().toISOString(),
      format: 'UAE PDPL Compliant JSON',
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vehiclespot_my_data_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    success('Personal Data Package Downloaded', 'Contains your listings, leads, and account history.');
  };

  // Lead Chart Data
  const leadChartData = listings.slice(0, 6).map((l) => ({
    name: l.model.length > 12 ? `${l.model.slice(0, 10)}...` : l.model,
    WhatsApp: l.privateStats?.whatsappLeads || 0,
    Call: l.privateStats?.callLeads || 0,
  }));

  return (
    <div className={`min-h-screen bg-bg flex flex-col ${isLightMode ? 'light' : ''}`}>
      <Navbar />

      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 flex-1">
        {/* Top Header & Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent/15 border border-accent/30 text-accent uppercase tracking-wider">
                {isDealer ? 'Verified Dealer Portal' : 'Individual Seller Portal'}
              </span>
              {isDealer && user?.isVerifiedDealer && (
                <span className="text-xs text-accent flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DED Verified</span>
                </span>
              )}
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text">
              Welcome back, {user?.name || 'Seller'}
            </h1>
            <p className="text-xs text-muted">
              Manage your Dubai supercar inventory, monitor real-time WhatsApp leads, and submit new 9:16 reels.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-surface-2 border border-border text-muted hover:text-text transition-colors"
              title="Toggle Light/Dark Theme for Dashboard"
              aria-label="Toggle theme"
            >
              {isLightMode ? <Moon className="w-4 h-4 text-accent" /> : <Sun className="w-4 h-4 text-accent" />}
            </button>

            {/* Post Car CTA */}
            <Link
              href="/dashboard/new-listing"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-[#C49B55] hover:from-accent-hover hover:to-accent text-bg font-bold text-xs shadow-lg shadow-accent/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create / Resume Listing</span>
            </Link>
          </div>
        </div>

        {loading && <p role="status" className="mb-4 text-xs text-muted">Loading your dashboard…</p>}
        {loadError && <div role="alert" className="mb-4 p-4 rounded-xl border border-danger/30 text-sm text-danger">{loadError}<button onClick={() => void loadDashboardData()} className="ml-3 underline">Retry</button></div>}
        {hasWizardDraft && (
          <div className="mb-6 p-4 rounded-2xl border border-accent/30 bg-accent/10 flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-sm font-semibold text-text">You have an unfinished listing</p><p className="text-xs text-muted mt-1">Your details and selected media are saved in this browser.</p></div>
            <Link href="/dashboard/new-listing" className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold">Resume draft</Link>
          </div>
        )}
        {/* Dealer Verification Status Banner (If Dealer) */}
        {isDealer && (
          <div className="mb-8 p-5 rounded-2xl bg-surface border border-accent/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-accent/20 text-accent shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-heading text-sm font-bold text-text">
                    DED Commercial License: {user?.tradeLicenseNumber || 'DED-CN-1049283'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/20 text-accent">
                    Active Verified
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">
                  Expiry Date: {user?.tradeLicenseExpiry || '2027-11-30'} • Official Dubai Showroom division verified
                </p>
              </div>
            </div>

            <button
              onClick={() => setTradeLicenseModal(true)}
              className="px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-xs font-semibold text-text transition-colors shrink-0"
            >
              Update License Docs
            </button>
          </div>
        )}

        {/* Overview KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-8">
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted font-medium">Live Listings</span>
              <CheckCircle2 className="w-4 h-4 text-accent" />
            </div>
            <p className="font-heading text-2xl font-bold text-text">{liveCount}</p>
            <p className="text-[10px] text-accent">Active in Dubai</p>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted font-medium">Pending Review</span>
              <Clock className="w-4 h-4 text-warning" />
            </div>
            <p className="font-heading text-2xl font-bold text-text">{pendingCount}</p>
            <p className="text-[10px] text-warning">In moderation queue</p>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted font-medium">Drafts</span>
              <FileText className="w-4 h-4 text-muted" />
            </div>
            <p className="font-heading text-2xl font-bold text-text">{draftCount}</p>
            <p className="text-[10px] text-muted">Auto-saved drafts</p>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted font-medium">Sold Supercars</span>
              <Award className="w-4 h-4 text-accent-2" />
            </div>
            <p className="font-heading text-2xl font-bold text-text">{soldCount}</p>
            <p className="text-[10px] text-accent-2">Verified closed</p>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted font-medium">WhatsApp Leads</span>
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
            </div>
            <p className="font-heading text-2xl font-bold text-text">{totalWhatsAppLeads}</p>
            <p className="text-[10px] text-[#25D366]">Direct chat events</p>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted font-medium">Phone Calls</span>
              <Phone className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <p className="font-heading text-2xl font-bold text-text">{totalCallLeads}</p>
            <p className="text-[10px] text-[#3B82F6]">Direct dials</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-border pb-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'listings'
                ? 'bg-accent text-bg shadow'
                : 'bg-surface-2 text-muted hover:text-text border border-border'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>My Listings ({listings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'leads'
                ? 'bg-accent text-bg shadow'
                : 'bg-surface-2 text-muted hover:text-text border border-border'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Lead Breakdown (WhatsApp vs Call)</span>
          </button>

          {/* "My Videos" tab: INDIVIDUALS ONLY (Hidden for dealers as required) */}
          {isIndividual && (
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'videos'
                  ? 'bg-accent-2 text-bg font-bold shadow'
                  : 'bg-surface-2 text-muted hover:text-text border border-border'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>My Videos (Non-Sale Reels)</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'settings'
                ? 'bg-accent text-bg shadow'
                : 'bg-surface-2 text-muted hover:text-text border border-border'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Settings & Compliance</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: MY LISTINGS TABLE */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            {/* Table Controls (Search, Status Filter, CSV Export) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by model, make, or Dubai area..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:outline-none focus:border-accent"
                >
                  <option value="all">All Statuses</option>
                  <option value="live">Live Only</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="sold">Sold</option>
                  <option value="rejected">Rejected</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCsv}
                  className="px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-xs font-semibold text-text flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-accent" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Listings Data Table */}
            <div className="rounded-2xl border border-border overflow-hidden bg-surface shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-surface-2/60 border-b border-border text-muted uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Vehicle</th>
                      <th className="py-3 px-4">Status & Timeline</th>
                      <th className="py-3 px-4">Price (AED)</th>
                      <th className="py-3 px-4">Area</th>
                      <th className="py-3 px-4">Format</th>
                      <th className="py-3 px-4">Leads (WA / Call)</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {tableListings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-muted">
                          No listings found matching your search criteria.
                        </td>
                      </tr>
                    ) : (
                      tableListings.map((listing) => {
                        const isSold = listing.status === 'sold';
                        const isLive = listing.status === 'live';
                        const isPending = listing.status === 'pending_review';
                        const isRejected = listing.status === 'rejected';

                        return (
                          <tr key={listing.id} className="hover:bg-surface-2/40 transition-colors">
                            {/* Vehicle */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={listing.videoPoster || listing.photos[0]}
                                  alt=""
                                  className="w-12 h-14 rounded-lg object-cover border border-border shrink-0 bg-black"
                                />
                                <div className="min-w-0">
                                  <Link
                                    href={`/car/${listing.slug}`}
                                    className="font-bold text-text hover:text-accent transition-colors truncate block"
                                  >
                                    {listing.title}
                                  </Link>
                                  <p className="text-[10px] text-muted">
                                    {formatKm(listing.mileage)} • {listing.year}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-1">
                                {isLive && (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent/15 text-accent border border-accent/30 inline-block">
                                    Live in Marketplace
                                  </span>
                                )}
                                {isPending && (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-warning/15 text-warning border border-warning/30 inline-block">
                                    Pending Review
                                  </span>
                                )}
                                {isSold && (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-danger/15 text-danger border border-danger/30 inline-block">
                                    Sold
                                  </span>
                                )}
                                {isRejected && (
                                  <div>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-danger/20 text-danger border border-danger/40 inline-block">
                                      Rejected
                                    </span>
                                    {listing.rejectionReason && (
                                      <p className="text-[10px] text-danger mt-1 max-w-xs leading-snug">
                                        Reason: {listing.rejectionReason}
                                      </p>
                                    )}
                                  </div>
                                )}
                                <p className="text-[9px] text-muted font-mono">
                                  Updated: {formatDate(listing.updatedAt)}
                                </p>
                              </div>
                            </td>

                            {/* Price */}
                            <td className="py-3.5 px-4 font-heading font-bold text-accent">
                              {formatAed(listing.price)}
                            </td>

                            {/* Area */}
                            <td className="py-3.5 px-4 text-text font-medium">
                              {listing.dubaiArea}
                            </td>

                            {/* Format */}
                            <td className="py-3.5 px-4">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-surface-2 text-muted border border-border">
                                {listing.mediaPath === 'ready_video' ? 'Ready Video' : listing.mediaPath === 'smart_template' ? 'Smart Template' : 'Photos Only'}
                              </span>
                            </td>

                            {/* Leads */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <span className="text-[#25D366] font-semibold flex items-center gap-1" title="WhatsApp leads">
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>{listing.privateStats?.whatsappLeads || 0}</span>
                                </span>
                                <span className="text-[#3B82F6] font-semibold flex items-center gap-1" title="Call leads">
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>{listing.privateStats?.callLeads || 0}</span>
                                </span>
                              </div>
                            </td>

                            {/* Actions Dropdown / Buttons */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEdit(listing)}
                                  className="p-1.5 rounded-lg hover:bg-surface-2 text-muted hover:text-accent transition-colors"
                                  title="Edit Vehicle Details"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                {(isRejected || listing.status === 'archived') && <button onClick={async () => { try { await updateListing(listing.id, { status: 'pending_review' }); success('Submitted again', 'Your listing is back in the admin review queue.'); await loadDashboardData(); } catch { error('Submission failed', 'Unable to update browser storage. Please retry.'); } }} className="px-2 py-1 rounded-lg bg-accent/10 text-accent text-xs">Submit again</button>}
                                {!isSold ? (
                                  <button
                                    onClick={() => handleMarkAsSold(listing.id)}
                                    className="px-2.5 py-1 rounded-lg bg-surface-2 hover:bg-accent/20 hover:text-accent border border-border text-[11px] font-semibold transition-colors"
                                    title="Mark as Sold"
                                  >
                                    Mark Sold
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleRelist(listing.id)}
                                    className="px-2.5 py-1 rounded-lg bg-accent/15 hover:bg-accent text-accent hover:text-bg border border-accent/30 text-[11px] font-semibold transition-colors"
                                    title="Relist vehicle"
                                  >
                                    Relist
                                  </button>
                                )}

                                <button
                                  onClick={() => handleArchive(listing.id)}
                                  className="p-1 rounded-lg hover:bg-surface-2 text-muted hover:text-text transition-colors"
                                  title="Archive listing"
                                >
                                  <Archive className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleDelete(listing.id)}
                                  className="p-1 rounded-lg hover:bg-danger/20 text-muted hover:text-danger transition-colors"
                                  title="Delete listing"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: LEAD BREAKDOWN CHART */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-text">
                    Direct Buyer Lead Analytics (WhatsApp vs Phone Call)
                  </h3>
                  <p className="text-xs text-muted">
                    Private seller telemetry: tracked separately whenever a buyer clicks your WhatsApp or Call button.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-[#25D366]">
                    <span className="w-3 h-3 rounded-full bg-[#25D366]" />
                    <span>WhatsApp Chats ({totalWhatsAppLeads})</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[#3B82F6]">
                    <span className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                    <span>Phone Dials ({totalCallLeads})</span>
                  </span>
                </div>
              </div>

              {/* Recharts Bar Chart */}
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leadChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262B38" vertical={false} />
                    <XAxis dataKey="name" stroke="#9AA3B2" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9AA3B2" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#12151C',
                        borderColor: '#262B38',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="WhatsApp" fill="#25D366" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Call" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: MY VIDEOS (INDIVIDUALS ONLY) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'videos' && isIndividual && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-text">
                  My Non-Sale Car Reels
                </h3>
                <p className="text-xs text-muted">
                  Share cold starts, track highlights, and car lifestyle content that is not for sale. (Individuals only)
                </p>
              </div>

              <button
                onClick={() => setVideoModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-accent-2 hover:bg-accent-2/90 text-bg font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Upload Social Video</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialVideos.map((vid) => (
                <div
                  key={vid.id}
                  className="rounded-2xl bg-surface border border-border overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[9/16] bg-black">
                    <img src={vid.videoPoster} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white text-[10px] flex items-center gap-1">
                      <Play className="w-3 h-3 fill-white" />
                      <span>{vid.duration}s</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-xs text-text line-clamp-2 leading-relaxed">
                      {vid.caption}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-muted pt-2 border-t border-border/50">
                      <span>{vid.views.toLocaleString()} views • {vid.likes} likes</span>
                      <button
                        onClick={() => handleDeleteVideo(vid.id)}
                        className="text-danger hover:underline text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: SETTINGS & COMPLIANCE */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-8">
            <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="font-heading text-lg font-bold text-text">
                  Contact Preferences & Profile
                </h3>
                <p className="text-xs text-muted">
                  Control how interested Dubai car buyers reach you.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-text mb-1">Display Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text mb-1">Direct Phone Number (UAE)</label>
                  <input
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text mb-1">
                    Default Contact Button Configuration
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
                        onClick={() => setContactPref(opt.val as ContactPreference)}
                        className={`py-2 px-2 rounded-xl border text-[11px] font-semibold transition-all ${
                          contactPref === opt.val
                            ? 'border-accent bg-accent/15 text-accent'
                            : 'border-border bg-surface-2 text-muted'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      updateCurrentUser({ name: userName, phone: userPhone });
                      success('Profile Saved', 'Updated contact preferences.');
                    }}
                    className="px-5 py-2 rounded-xl bg-accent text-bg font-bold text-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* UAE Personal Data Protection Law (PDPL) Compliance Section */}
            <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 space-y-4">
              <div className="border-b border-border pb-3">
                <h4 className="font-heading text-sm font-bold text-text">
                  Security, Privacy & Data Compliance (UAE Federal Decree-Law No. 45)
                </h4>
                <p className="text-xs text-muted">
                  You have full rights to inspect, download, or delete your vehicle marketplace profile.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div>
                  <p className="text-xs font-semibold text-text">Export My Archive</p>
                  <p className="text-[11px] text-muted">
                    Download complete telemetry, lead history, and listings in JSON.
                  </p>
                </div>
                <button
                  onClick={handleDownloadData}
                  className="px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-xs font-semibold text-text flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-accent" />
                  <span>Download My Data</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/50">
                <div>
                  <p className="text-xs font-semibold text-danger">Delete Account</p>
                  <p className="text-[11px] text-muted">
                    Immediately unlists all vehicles and archives telemetry under 30-day retention grace period.
                  </p>
                </div>
                <button
                  onClick={() => setDeleteAccountModal(true)}
                  className="px-4 py-2 rounded-xl bg-danger/15 hover:bg-danger/25 text-danger font-semibold text-xs border border-danger/30 transition-colors shrink-0"
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Upload Non-Sale Video (Individuals) */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-surface border border-border max-w-md w-full rounded-2xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-text p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading text-lg font-bold text-text">Upload Social Car Video</h3>
            <p className="text-xs text-muted">Post cold starts, exhaust notes, and Dubai drives (not for sale).</p>

            <form onSubmit={handleCreateVideo} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-text mb-1">Reel Caption</label>
                <textarea
                  required
                  rows={3}
                  value={newVideoCaption}
                  onChange={(e) => setNewVideoCaption(e.target.value)}
                  placeholder="e.g. Sheikh Zayed Road late night cold start roar 🏎️ #DubaiV12"
                  className="w-full p-3 rounded-xl bg-surface-2 border border-border text-text text-xs focus:outline-none focus:border-accent"
                />
              </div>

              <div className="p-4 rounded-xl border border-dashed border-border text-center text-muted">
                <Video className="w-6 h-6 text-accent-2 mx-auto mb-1" />
                <p className="text-text font-semibold">Sample 9:16 vertical reel selected</p>
                <p className="text-[10px]">16s • 1080x1920 HD</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-2 text-text font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-accent-2 hover:bg-accent-2/90 text-bg font-bold text-xs shadow"
                >
                  Publish Video Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Account Confirmation */}
      {deleteAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-surface border border-danger/40 max-w-md w-full rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center gap-3 text-danger">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-heading text-lg font-bold">Delete {SITE_CONFIG.name} Account?</h3>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Under UAE Federal Decree-Law No. 45, requesting account deletion will immediately remove your active listings from the Dubai marketplace. Any encrypted telemetry will be scrubbed following our mandatory 30-day fraud prevention retention period.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteAccountModal(false)}
                className="px-4 py-2 rounded-xl bg-surface-2 text-text font-semibold text-xs"
              >
                Keep Account
              </button>
              <button
                onClick={() => {
                  deleteAccount();
                  setDeleteAccountModal(false);
                  info('Account Deleted', 'Simulated account deletion completed. Redirecting to home...');
                  setTimeout(() => router.push('/'), 800);
                }}
                className="px-4 py-2 rounded-xl bg-danger hover:bg-danger/90 text-white font-bold text-xs shadow"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Update Trade License (Dealers) */}
      {tradeLicenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-surface border border-border max-w-md w-full rounded-2xl p-6 shadow-2xl relative space-y-4 text-xs">
            <button onClick={() => setTradeLicenseModal(false)} className="absolute top-4 right-4 text-muted p-1">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading text-lg font-bold text-text">Update DED Trade License</h3>
            <p className="text-muted">Upload renewed commercial registration issued by the Dubai Department of Economy.</p>
            <div className="p-6 rounded-xl border border-dashed border-border text-center space-y-2">
              <Upload className="w-6 h-6 text-accent mx-auto" />
              <p className="font-semibold text-text">alfuttaim_renewed_license_2027.pdf</p>
              <p className="text-[10px] text-muted">Verified 1.4 MB PDF</p>
            </div>
            <button
              onClick={() => {
                setTradeLicenseModal(false);
                success('License Documents Uploaded', 'DED certificate queued for moderator review.');
              }}
              className="w-full py-2.5 rounded-xl bg-accent text-bg font-bold text-xs"
            >
              Save & Submit to Moderation
            </button>
          </div>
        </div>
      )}

      {/* Modal: Edit Vehicle Details */}
      {editingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-surface border border-border max-w-lg w-full rounded-2xl p-6 shadow-2xl relative space-y-4 text-xs">
            <button onClick={() => setEditingListing(null)} className="absolute top-4 right-4 text-muted p-1">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h3 className="font-heading text-lg font-bold text-text">Edit Vehicle: {editingListing.title}</h3>
              <p className="text-muted mt-0.5">Update asking price, mileage, or description options.</p>
            </div>

            {editingListing.status === 'live' && (
              <div className="p-3 rounded-xl bg-warning/15 border border-warning/30 text-warning text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Platform Rule:</strong> Editing a live listing returns it to <strong>Pending Review</strong> so that modified specs can be re-verified by moderation.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-text mb-1">Asking Price (AED)</label>
                <input
                  type="number"
                  step={5000}
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-border text-accent font-bold text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Odometer Mileage (km)</label>
                <input
                  type="number"
                  step={100}
                  value={editMileage}
                  onChange={(e) => setEditMileage(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-border text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-surface-2 border border-border text-text focus:outline-none focus:border-accent leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setEditingListing(null)}
                className="px-4 py-2 rounded-xl bg-surface-2 text-text font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-accent text-bg font-bold shadow"
              >
                Save & Update Listing
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
