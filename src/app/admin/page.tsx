'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';
import { useAuthStore } from '@/features/auth/store';
import { useToast } from '@/components/ui/Toast';
import { VerticalVideoPlayer } from '@/components/video/VerticalVideoPlayer';
import { SITE_CONFIG } from '@/config/site';
import { 
  getListings, 
  approveListing, 
  rejectListing, 
  getDealerVerificationRequests, 
  approveDealerVerification, 
  rejectDealerVerification, 
  suspendDealer, 
  getUsers, 
  updateUserRole, 
  getReports, 
  handleReportAction, 
  getVideoJobs, 
  retryVideoJob, 
  getAnalytics, 
  getFeatureFlags, 
  updateFeatureFlags 
} from '@/lib/mockApi';
import { 
  Listing, 
  DealerVerificationRequest, 
  User, 
  ModerationReport, 
  VideoProcessingJob, 
  DailyAnalytics 
} from '@/types';
import { ROADMAP_FLAGS, FeatureFlags } from '@/config/flags';
import { DEMO_MUSIC_TRACKS } from '@/config/music';
import { SMART_TEMPLATES } from '@/config/templates';
import { DUBAI_MAKES_MODELS, DUBAI_AREAS } from '@/mocks/lookups';
import { formatAed, formatKm, formatDate, exportToCsv } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Building2, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Cpu, 
  Sliders, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Check, 
  X, 
  Play, 
  Eye, 
  Download, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Lock, 
  ExternalLink,
  Plus
} from 'lucide-react';

export default function AdminPage() {
  const { user, role, switchRole } = useAuthStore();
  const { success, error, info } = useToast();

  const [activeSection, setActiveSection] = useState<
    'overview' | 'queue' | 'dealers' | 'users' | 'moderation' | 'analytics' | 'operations' | 'config'
  >('overview');

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [notificationBellOpen, setNotificationBellOpen] = useState(false);

  // Data States
  const [listings, setListings] = useState<Listing[]>([]);
  const [dealerRequests, setDealerRequests] = useState<DealerVerificationRequest[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [videoJobs, setVideoJobs] = useState<VideoProcessingJob[]>([]);
  const [analytics, setAnalytics] = useState<DailyAnalytics[]>([]);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Detail Drawer for Listing Review Queue
  const [selectedReviewListing, setSelectedReviewListing] = useState<Listing | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  // Create Dealer Modal
  const [createDealerModalOpen, setCreateDealerModalOpen] = useState(false);
  const [newDealerForm, setNewDealerForm] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    tradeLicenseNumber: '',
    tradeLicenseExpiry: '2027-12-31',
  });

  const loadAllAdminData = async () => {
    setLoading(true); setLoadError('');
    try {
      const [allListings, requests, users, allReports, jobs, stats, flags] = await Promise.all([
        getListings(),
        getDealerVerificationRequests(),
        getUsers(),
        getReports(),
        getVideoJobs(),
        getAnalytics(30),
        getFeatureFlags(),
      ]);

      setListings(allListings);
      setDealerRequests(requests);
      setUsersList(users);
      setReports(allReports);
      setVideoJobs(jobs);
      setAnalytics(stats);
      setFeatureFlags(flags);
    } catch (err) {
      console.error(err); setLoadError('Unable to load local admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const refresh = () => { void loadAllAdminData(); };
    void Promise.resolve().then(refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('vehiclespot-data-change', refresh);
    window.addEventListener('vehiclespot-community-change', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('vehiclespot-data-change', refresh); window.removeEventListener('vehiclespot-community-change', refresh); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    document.documentElement.classList.toggle('light', !isLightMode);
  };

  // KPIs
  const liveCount = listings.filter((l) => l.status === 'live').length;
  const pendingCount = listings.filter((l) => l.status === 'pending_review').length;
  const pendingDealersCount = dealerRequests.filter((d) => d.status === 'pending').length;
  const openReportsCount = reports.filter((r) => r.status === 'open').length;
  const failedJobsCount = videoJobs.filter((j) => j.status === 'failed').length;
  const leadsToday = analytics.length > 0 ? analytics[analytics.length - 1].whatsappLeads + analytics[analytics.length - 1].callLeads : 48;

  // Review Queue Handlers
  const handleApproveListing = async (listingId: string) => {
    await approveListing(listingId, 'Approved by compliance administrator: Sarah Connor', 'Sarah Connor');
    success('Listing Approved', 'Vehicle is now live across the public marketplace and seller dashboard.');
    setSelectedReviewListing(null);
    loadAllAdminData();
  };

  const handleRejectListing = async () => {
    if (!selectedReviewListing || !rejectionReasonInput) {
      error('Reason Required', 'You must specify a compliance rejection reason.');
      return;
    }
    await rejectListing(selectedReviewListing.id, rejectionReasonInput, 'Sarah Connor');
    error('Listing Rejected', 'Rejection reason logged to audit trail and dispatched to seller.');
    setRejectModalOpen(false);
    setRejectionReasonInput('');
    setSelectedReviewListing(null);
    loadAllAdminData();
  };

  // Dealer Verification Handlers
  const handleApproveDealer = async (reqId: string) => {
    await approveDealerVerification(reqId, 'Sarah Connor');
    success('Dealer Verification Approved', 'DED Trade license confirmed. Gold dealer badge activated.');
    loadAllAdminData();
  };

  const handleRejectDealer = async (reqId: string) => {
    const reason = prompt('Enter DED verification rejection reason:') || 'Trade license registration could not be validated against official Dubai Economy registry.';
    await rejectDealerVerification(reqId, reason, 'Sarah Connor');
    error('Dealer Application Rejected', reason);
    loadAllAdminData();
  };

  const handleSuspendDealer = async (dealerId: string) => {
    if (confirm('Suspend this dealership and revoke verified status?')) {
      await suspendDealer(dealerId, 'Sarah Connor');
      info('Dealer Suspended', 'Dealer badge removed and listings flagged.');
      loadAllAdminData();
    }
  };

  const handleCreateDealer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealerForm.companyName || !newDealerForm.email || !newDealerForm.tradeLicenseNumber) {
      error('Missing fields', 'Fill out legal company name, email, and trade license number.');
      return;
    }

    const newDealerUser: User = {
      id: `user_dealer_${Date.now()}`,
      name: newDealerForm.name || newDealerForm.companyName,
      email: newDealerForm.email,
      role: 'dealer',
      companyName: newDealerForm.companyName,
      phone: newDealerForm.phone || '+971 4 000 0000',
      tradeLicenseNumber: newDealerForm.tradeLicenseNumber,
      tradeLicenseExpiry: newDealerForm.tradeLicenseExpiry,
      isVerifiedDealer: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
      savedListings: [],
      createdAt: new Date().toISOString(),
    };

    setUsersList((prev) => [newDealerUser, ...prev]);
    setCreateDealerModalOpen(false);
    success('Dealership Created', `${newDealerForm.companyName} added with verified DED credentials.`);
  };

  // User Management
  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    await updateUserRole(userId, newRole);
    info('User Role Updated', `Role changed to ${newRole.toUpperCase()}.`);
    loadAllAdminData();
  };

  // Moderation
  const handleReportActionClick = async (reportId: string, action: ModerationReport['actionTaken']) => {
    await handleReportAction(reportId, action);
    success('Moderation Action Executed', `Report updated with action: ${action}. Logged in audit.`);
    loadAllAdminData();
  };

  // Operations Retry
  const handleRetryJob = async (jobId: string) => {
    await retryVideoJob(jobId);
    success('Job Reprocessed', 'Encoding retry succeeded. Video streaming assets published.');
    loadAllAdminData();
  };

  return (
    <div className={`min-h-screen bg-bg flex flex-col ${isLightMode ? 'light' : ''}`}>
      {/* Admin Top App Bar */}
      <header className="sticky top-[31px] z-40 bg-surface-2 border-b border-border px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg text-text">{SITE_CONFIG.name}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase tracking-wider">
                Admin Control Center
              </span>
            </Link>
          </div>

          {/* Global Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Global search listings, VINs, dealers, license numbers, users..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-surface border border-border text-xs text-text placeholder:text-muted focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Right Admin Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-surface border border-border text-muted hover:text-text"
              title="Toggle Light/Dark Theme"
              aria-label="Toggle theme"
            >
              {isLightMode ? <Moon className="w-4 h-4 text-accent" /> : <Sun className="w-4 h-4 text-accent" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationBellOpen(!notificationBellOpen)}
                className="p-1.5 rounded-lg bg-surface border border-border text-muted hover:text-text relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {pendingCount + pendingDealersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-bg font-extrabold text-[9px] flex items-center justify-center">
                    {pendingCount + pendingDealersCount}
                  </span>
                )}
              </button>

              {notificationBellOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-surface border border-border p-3 shadow-2xl z-50 animate-in fade-in">
                  <p className="text-xs font-bold text-text mb-2">Pending Action Items</p>
                  <div className="space-y-1.5 text-xs">
                    <div 
                      onClick={() => { setActiveSection('queue'); setNotificationBellOpen(false); }}
                      className="p-2 rounded-lg bg-surface-2 hover:bg-surface-3 cursor-pointer flex items-center justify-between"
                    >
                      <span>Listings Awaiting Review</span>
                      <span className="font-bold text-warning">{pendingCount}</span>
                    </div>
                    <div 
                      onClick={() => { setActiveSection('dealers'); setNotificationBellOpen(false); }}
                      className="p-2 rounded-lg bg-surface-2 hover:bg-surface-3 cursor-pointer flex items-center justify-between"
                    >
                      <span>Dealer Verifications</span>
                      <span className="font-bold text-accent">{pendingDealersCount}</span>
                    </div>
                    <div 
                      onClick={() => { setActiveSection('moderation'); setNotificationBellOpen(false); }}
                      className="p-2 rounded-lg bg-surface-2 hover:bg-surface-3 cursor-pointer flex items-center justify-between"
                    >
                      <span>Active Content Reports</span>
                      <span className="font-bold text-danger">{openReportsCount}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'}
                alt=""
                className="w-7 h-7 rounded-full object-cover border border-purple-500/50"
              />
              <span className="text-xs font-semibold text-text hidden sm:inline">Sarah Connor</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace: Sidebar + Content */}
      <div className="flex-1 flex w-full">
        {/* Collapsible Sidebar */}
        <aside
          aria-label="Admin Navigation"
          className={`border-r border-border bg-surface-2 transition-all duration-300 flex flex-col justify-between shrink-0 ${
            sidebarCollapsed ? 'w-16' : 'w-16 sm:w-60'
          }`}
        >
          <div className="p-3 space-y-1">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-end p-1.5 text-muted hover:text-text mb-2 text-xs"
              title="Toggle sidebar"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {[
              { id: 'overview', label: 'Overview & KPIs', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'queue', label: 'Listing Review Queue', icon: <CheckCircle2 className="w-4 h-4 text-warning" />, badge: pendingCount },
              { id: 'dealers', label: 'Dealer Verification', icon: <Building2 className="w-4 h-4 text-accent" />, badge: pendingDealersCount },
              { id: 'users', label: 'Users & Roles', icon: <Users className="w-4 h-4" /> },
              { id: 'moderation', label: 'Moderation & Reports', icon: <AlertTriangle className="w-4 h-4 text-danger" />, badge: openReportsCount },
              { id: 'analytics', label: 'Analytics & Leads', icon: <TrendingUp className="w-4 h-4 text-accent-2" /> },
              { id: 'operations', label: 'Video Ops & Jobs', icon: <Cpu className="w-4 h-4" />, badge: failedJobsCount },
              { id: 'config', label: 'System Configuration', icon: <Sliders className="w-4 h-4" /> },
            ].map((item) => {
              const isSelected = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as typeof activeSection)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-accent/15 border border-accent/30 text-accent font-bold'
                      : 'text-muted hover:text-text hover:bg-surface-2'
                  }`}
                  title={item.label}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {!sidebarCollapsed && (
                    <div className="flex-1 text-left hidden sm:flex items-center justify-between">
                      <span className="truncate">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-accent text-bg">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {!sidebarCollapsed && (
            <div className="hidden sm:block p-4 border-t border-border/60 text-[10px] text-muted space-y-1">
              <p className="font-semibold text-text">{SITE_CONFIG.name} Core Admin v1.4</p>
              <p>Stage 1: Dubai Luxury Only</p>
              <p className="text-accent">Audit trail active</p>
            </div>
          )}
        </aside>

        {/* Dynamic Center Work Area */}
        <main className="min-w-0 flex-1 p-3 sm:p-8 overflow-y-auto">
          {loading && <p role="status" className="mb-4 text-xs text-muted">Loading admin data…</p>}
          {loadError && <div role="alert" className="mb-4 p-4 text-sm text-danger border border-danger/30 rounded-xl">{loadError}<button onClick={() => void loadAllAdminData()} className="ml-3 underline">Retry</button></div>}
          {/* ------------------------------------------------------------- */}
          {/* SECTION 1: OVERVIEW & KPIS */}
          {/* ------------------------------------------------------------- */}
          {activeSection === 'overview' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-text">
                    Marketplace Health & Operations Overview
                  </h2>
                  <p className="text-xs text-muted">
                    Live Dubai automotive marketplace metrics, real-time lead telemetry, and job queue status.
                  </p>
                </div>
                <button
                  onClick={loadAllAdminData}
                  className="px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-text flex items-center gap-1.5 hover:bg-surface-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refresh Realtime</span>
                </button>
              </div>

              {/* 6 Key KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="p-4 rounded-2xl bg-surface border border-border space-y-1">
                  <span className="text-[11px] text-muted font-medium">Live Listings</span>
                  <p className="font-heading text-2xl font-bold text-text">{liveCount}</p>
                  <p className="text-[10px] text-accent">Inspected & public</p>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-warning/40 space-y-1">
                  <span className="text-[11px] text-muted font-medium">Pending Review</span>
                  <p className="font-heading text-2xl font-bold text-warning">{pendingCount}</p>
                  <p className="text-[10px] text-warning">Requires audit</p>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-border space-y-1">
                  <span className="text-[11px] text-muted font-medium">Registered Users</span>
                  <p className="font-heading text-2xl font-bold text-text">{usersList.length}</p>
                  <p className="text-[10px] text-muted">Individuals & dealers</p>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-accent/40 space-y-1">
                  <span className="text-[11px] text-muted font-medium">Verified Dealers</span>
                  <p className="font-heading text-2xl font-bold text-accent">
                    {usersList.filter((u) => u.isVerifiedDealer).length}
                  </p>
                  <p className="text-[10px] text-accent">DED licensed</p>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-[#25D366]/40 space-y-1">
                  <span className="text-[11px] text-muted font-medium">Leads Today</span>
                  <p className="font-heading text-2xl font-bold text-[#25D366]">{leadsToday}</p>
                  <p className="text-[10px] text-[#25D366]">WA + Call clicks</p>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-danger/40 space-y-1">
                  <span className="text-[11px] text-muted font-medium">Ops Failures</span>
                  <p className="font-heading text-2xl font-bold text-danger">{failedJobsCount}</p>
                  <p className="text-[10px] text-danger">Video encoding</p>
                </div>
              </div>

              {/* 30-Day Recharts Time Series: Views & Lead Conversion */}
              <div className="rounded-2xl bg-surface border border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-base font-bold text-text">
                      30-Day Platform Views vs Direct Buyer Leads
                    </h3>
                    <p className="text-xs text-muted">Daily traffic telemetry across web showcase and mobile feed</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="text-accent flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                      <span>Reel Views</span>
                    </span>
                    <span className="text-[#25D366] flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
                      <span>WhatsApp Leads</span>
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF6A" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#D4AF6A" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#25D366" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#25D366" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262B38" vertical={false} />
                      <XAxis dataKey="date" stroke="#9AA3B2" fontSize={10} tickLine={false} tickFormatter={(d) => d.slice(5)} />
                      <YAxis stroke="#9AA3B2" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#12151C',
                          borderColor: '#262B38',
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                      />
                      <Area type="monotone" dataKey="views" stroke="#D4AF6A" fillOpacity={1} fill="url(#colorViews)" />
                      <Area type="monotone" dataKey="whatsappLeads" stroke="#25D366" fillOpacity={1} fill="url(#colorLeads)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activity Audit Feed */}
              <div className="rounded-2xl bg-surface border border-border p-6 space-y-4">
                <h3 className="font-heading text-base font-bold text-text">
                  Recent Marketplace Audit Trail
                </h3>
                <div className="space-y-2.5 text-xs">
                  {listings.slice(0, 5).map((l, i) => (
                    <div key={i} className="p-3 rounded-xl bg-surface-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="p-1.5 rounded-lg bg-surface border border-border text-accent">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <p className="font-semibold text-text">
                            {l.status === 'live' ? 'Listing Approved & Live' : l.status === 'pending_review' ? 'New Reel Submitted' : 'Listing Status Change'}
                          </p>
                          <p className="text-[10px] text-muted">
                            {l.title} • {l.sellerName} ({l.sellerType})
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-muted">
                        {formatDate(l.updatedAt)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* SECTION 2: LISTING REVIEW QUEUE */}
          {/* ------------------------------------------------------------- */}
          {activeSection === 'queue' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-text">
                    Listing Review Queue ({pendingCount} Pending)
                  </h2>
                  <p className="text-xs text-muted">
                    Inspect 9:16 vertical videos, photo quality, and pricing. Approving makes the vehicle immediately live everywhere.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const exportData = listings.filter((l) => l.status === 'pending_review');
                    exportToCsv('pending_listings_queue', exportData);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-text flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-accent" />
                  <span>Export Queue CSV</span>
                </button>
              </div>

              {/* Table of Listings */}
              <div className="rounded-2xl border border-border overflow-x-auto bg-surface shadow-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-surface-2/60 border-b border-border text-muted uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Vehicle</th>
                      <th className="py-3 px-4">Seller</th>
                      <th className="py-3 px-4">Price (AED)</th>
                      <th className="py-3 px-4">Format</th>
                      <th className="py-3 px-4">Submitted</th>
                      <th className="py-3 px-4 text-right">Review Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {listings.filter((l) => l.status === 'pending_review').length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-accent">
                          ✓ All caught up! Zero listings in pending review.
                        </td>
                      </tr>
                    ) : (
                      listings
                        .filter((l) => l.status === 'pending_review')
                        .map((listing) => (
                          <tr key={listing.id} className="hover:bg-surface-2/40 transition-colors">
                            <td className="py-3 px-4 font-bold text-text">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={listing.videoPoster || listing.photos[0]}
                                  alt=""
                                  className="w-10 h-12 rounded object-cover border border-border bg-black"
                                />
                                <div>
                                  <p className="font-bold text-text">{listing.title}</p>
                                  <p className="text-[10px] text-muted">{listing.dubaiArea} • {formatKm(listing.mileage)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-text">{listing.sellerName}</td>
                            <td className="py-3 px-4 font-heading font-bold text-accent">{formatAed(listing.price)}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-surface-2 text-muted border border-border uppercase">
                                {listing.mediaPath.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-muted font-mono">{formatDate(listing.createdAt)}</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setSelectedReviewListing(listing)}
                                className="px-3.5 py-1.5 rounded-xl bg-accent hover:bg-accent-hover text-bg font-bold text-xs shadow"
                              >
                                Review Listing
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* SECTION 3: DEALER VERIFICATION */}
          {/* ------------------------------------------------------------- */}
          {activeSection === 'dealers' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-text">
                    Dubai Dealer Verification & DED Licenses
                  </h2>
                  <p className="text-xs text-muted">
                    Inspect commercial licenses, verify expiry dates, and grant verified status. Requests from landing page appear here!
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard/new-listing"
                    onClick={() => info('Listing on Dealer Behalf', 'Opening creation wizard to post vehicle under authorized dealer division.')}
                    className="px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-xs font-semibold text-text flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-accent" />
                    <span>Create on Dealer&apos;s Behalf</span>
                  </Link>
                  <button
                    onClick={() => setCreateDealerModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-bg font-bold text-xs shadow flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Create Dealership</span>
                  </button>
                </div>
              </div>

              {/* Table of Dealer Verification Requests */}
              <div className="rounded-2xl border border-border overflow-x-auto bg-surface shadow-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-surface-2/60 border-b border-border text-muted uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Dealership Legal Name</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">DED License No.</th>
                      <th className="py-3 px-4">Expiry Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {dealerRequests.map((req) => {
                      const isExpired = new Date(req.tradeLicenseExpiry).getTime() < new Date().getTime();
                      return (
                        <tr key={req.id} className="hover:bg-surface-2/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-text">
                            {req.dealerName}
                          </td>
                          <td className="py-3.5 px-4 text-muted">
                            <p className="text-text font-medium">{req.contactPerson}</p>
                            <p className="text-[10px]">{req.phone}</p>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-accent">
                            {req.tradeLicenseNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`font-mono text-xs ${isExpired ? 'text-danger font-bold' : 'text-text'}`}>
                              {req.tradeLicenseExpiry}
                            </span>
                            {isExpired && (
                              <span className="block text-[9px] text-danger font-bold uppercase">
                                License Expired
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                req.status === 'approved'
                                  ? 'bg-accent/15 text-accent border border-accent/30'
                                  : req.status === 'pending'
                                  ? 'bg-warning/15 text-warning border border-warning/30'
                                  : 'bg-danger/15 text-danger border border-danger/30'
                              }`}
                            >
                              {req.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {req.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleApproveDealer(req.id)}
                                  className="px-3 py-1 rounded-lg bg-accent text-bg font-bold text-[11px]"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectDealer(req.id)}
                                  className="px-3 py-1 rounded-lg bg-danger/20 text-danger font-semibold text-[11px] hover:bg-danger/30"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : req.status === 'approved' ? (
                              <button
                                onClick={() => handleSuspendDealer(req.dealerId)}
                                className="px-3 py-1 rounded-lg bg-surface-2 hover:bg-danger/20 text-muted hover:text-danger text-[11px]"
                              >
                                Suspend Dealer
                              </button>
                            ) : (
                              <span className="text-[11px] text-muted">Reviewed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* SECTION 4: USERS MANAGEMENT */}
          {/* ------------------------------------------------------------- */}
          {activeSection === 'users' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-text">
                    Users & Roles Directory ({usersList.length} Accounts)
                  </h2>
                  <p className="text-xs text-muted">Manage roles (individual, dealer, admin, guest) and privileges.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border overflow-x-auto bg-surface shadow-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-surface-2/60 border-b border-border text-muted uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">User Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Current Role</th>
                      <th className="py-3 px-4">Verified Status</th>
                      <th className="py-3 px-4 text-right">Change Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-surface-2/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-text flex items-center gap-2">
                          <img src={u.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <span>{u.name}</span>
                        </td>
                        <td className="py-3 px-4 text-muted">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : u.role === 'dealer' ? 'bg-accent/20 text-accent' : 'bg-surface-2 text-text'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {u.isVerifiedDealer ? (
                            <span className="text-accent flex items-center gap-1 font-semibold text-[11px]">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Verified Dealer</span>
                            </span>
                          ) : (
                            <span className="text-muted text-[11px]">Standard</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as User['role'])}
                            className="px-2 py-1 rounded bg-surface-2 border border-border text-xs text-text"
                          >
                            <option value="individual">Individual</option>
                            <option value="dealer">Dealer</option>
                            <option value="admin">Admin</option>
                            <option value="guest">Guest</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* SECTION 5: MODERATION & REPORTS */}
          {/* ------------------------------------------------------------- */}
          {activeSection === 'moderation' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="font-heading text-2xl font-bold text-text">
                  Content Moderation & User Reports ({openReportsCount} Open)
                </h2>
                <p className="text-xs text-muted">Review flagged listings, inappropriate comments, and suspicious sellers.</p>
              </div>

              <div className="space-y-3">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-5 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-danger/15 text-danger border border-danger/30 uppercase">
                          {rep.targetType}: {rep.reason}
                        </span>
                        <span className="text-xs font-semibold text-text">{rep.targetTitle}</span>
                      </div>
                      <p className="text-xs text-muted max-w-2xl">{rep.details}</p>
                      <p className="text-[10px] text-muted font-mono">
                        Reported by: {rep.reporterEmail} • {formatDate(rep.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {rep.status === 'open' ? (
                        <>
                          <button
                            onClick={() => handleReportActionClick(rep.id, 'dismissed')}
                            className="px-3 py-1.5 rounded-xl bg-surface-2 hover:bg-surface-3 text-xs font-semibold text-text"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => handleReportActionClick(rep.id, 'warning_issued')}
                            className="px-3 py-1.5 rounded-xl bg-warning/20 text-warning font-semibold text-xs hover:bg-warning/30"
                          >
                            Issue Warning
                          </button>
                          <button
                            onClick={() => handleReportActionClick(rep.id, 'removed')}
                            className="px-3 py-1.5 rounded-xl bg-danger hover:bg-danger/90 text-white font-bold text-xs"
                          >
                            Remove Content
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-muted font-mono">
                          Resolved: {rep.actionTaken}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* SECTION 6: ANALYTICS & LEADS */}
          {/* ------------------------------------------------------------- */}
          {activeSection === 'analytics' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h2 className="font-heading text-2xl font-bold text-text">
                  In-Depth Marketplace Analytics & Lead Telemetry
                </h2>
                <p className="text-xs text-muted">
                  Public counters (likes, views) vs private seller telemetry (WhatsApp clicks, call dials, watch time, completion rate).
                </p>
              </div>

              {/* Conversion Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-surface border border-border">
                  <p className="text-xs text-muted">Avg Reel Watch Time</p>
                  <p className="font-heading text-2xl font-bold text-accent">14.6 sec</p>
                  <p className="text-[10px] text-accent-2">86% completion rate</p>
                </div>
                <div className="p-4 rounded-2xl bg-surface border border-border">
                  <p className="text-xs text-muted">Listing Completion Rate</p>
                  <p className="font-heading text-2xl font-bold text-text">78.4%</p>
                  <p className="text-[10px] text-muted">Wizard starts vs published</p>
                </div>
                <div className="p-4 rounded-2xl bg-surface border border-border">
                  <p className="text-xs text-muted">WhatsApp Leads (30d)</p>
                  <p className="font-heading text-2xl font-bold text-[#25D366]">842</p>
                  <p className="text-[10px] text-[#25D366]">Direct buyer inquiries</p>
                </div>
                <div className="p-4 rounded-2xl bg-surface border border-border">
                  <p className="text-xs text-muted">Phone Calls (30d)</p>
                  <p className="font-heading text-2xl font-bold text-[#3B82F6]">326</p>
                  <p className="text-[10px] text-[#3B82F6]">Direct dials</p>
                </div>
              </div>

              {/* Top Listings Table */}
              <div className="rounded-2xl border border-border overflow-x-auto bg-surface p-6 space-y-4">
                <h3 className="font-heading text-base font-bold text-text">
                  Top Performing Supercars in Dubai (By Watch Time & Leads)
                </h3>
                <table className="w-full text-xs text-left">
                  <thead className="bg-surface-2/60 border-b border-border text-muted uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Vehicle</th>
                      <th className="py-2.5 px-3">Views</th>
                      <th className="py-2.5 px-3">Avg Watch</th>
                      <th className="py-2.5 px-3">Completion %</th>
                      <th className="py-2.5 px-3">Leads</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {listings.slice(0, 5).map((l) => (
                      <tr key={l.id}>
                        <td className="py-3 px-3 font-semibold text-text">{l.title}</td>
                        <td className="py-3 px-3 font-mono text-muted">{l.publicStats.views.toLocaleString()}</td>
                        <td className="py-3 px-3 font-mono text-accent">{l.privateStats?.avgWatchTimeSeconds || 14}s</td>
                        <td className="py-3 px-3 font-mono text-accent-2">{l.privateStats?.completionRatePercent || 85}%</td>
                        <td className="py-3 px-3 font-bold text-[#25D366]">
                          {(l.privateStats?.whatsappLeads || 0) + (l.privateStats?.callLeads || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* SECTION 7: VIDEO OPS & JOBS MONITOR */}
          {/* ------------------------------------------------------------- */}
          {activeSection === 'operations' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-text">
                    Video Processing Operations Monitor
                  </h2>
                  <p className="text-xs text-muted">
                    Cluster video encoding, Smart Template rendering pipelines, logs, and manual retry triggers.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {videoJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 rounded-2xl bg-surface border border-border space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          job.status === 'completed' ? 'bg-accent/20 text-accent' : job.status === 'failed' ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'
                        }`}>
                          {job.status}
                        </span>
                        <h4 className="font-bold text-xs text-text">{job.listingTitle}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-muted">{job.startedAt}</span>
                    </div>

                    <div className="bg-surface-2 p-3 rounded-xl font-mono text-[11px] text-muted space-y-1">
                      {job.logs.map((log, idx) => (
                        <p key={idx} className={log.includes('failed') ? 'text-danger' : ''}>
                          {log}
                        </p>
                      ))}
                    </div>

                    {job.status === 'failed' && (
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleRetryJob(job.id)}
                          className="px-3 py-1.5 rounded-xl bg-accent text-bg font-bold text-xs flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retry Encoding Job</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* SECTION 8: CONFIG & ROADMAP FLAGS */}
          {/* ------------------------------------------------------------- */}
          {activeSection === 'config' && (
            <div className="space-y-8 animate-in fade-in max-w-4xl">
              <div>
                <h2 className="font-heading text-2xl font-bold text-text">
                  Marketplace Configuration & Future Roadmap Flags
                </h2>
                <p className="text-xs text-muted">
                  Stage 1 active parameters and read-only feature gates for Stage 2 & Stage 3 expansions.
                </p>
              </div>

              {/* Active Runtime Feature Flags */}
              <div className="rounded-2xl bg-surface border border-border p-6 space-y-4">
                <h3 className="font-heading text-base font-bold text-text">
                  Stage 1 Active Runtime Settings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-1">
                    <p className="font-semibold text-text">Max Smart Renders per Listing</p>
                    <p className="text-accent font-bold text-base">3 Renders</p>
                    <p className="text-[10px] text-muted">Prevents cluster GPU exhaustion</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-1">
                    <p className="font-semibold text-text">Max Video Upload Size</p>
                    <p className="text-accent font-bold text-base">500 MB</p>
                    <p className="text-[10px] text-muted">Up to 60s 1080x1920 60fps</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-1">
                    <p className="font-semibold text-text">Photo Quality Gate Threshold</p>
                    <p className="text-accent font-bold text-base">10–20 Photos</p>
                    <p className="text-[10px] text-muted">Mandatory resolution & sharpness checks</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-2 border border-border space-y-1">
                    <p className="font-semibold text-text">City & Category Lock</p>
                    <p className="text-accent font-bold text-base">city: &quot;Dubai&quot;, category: &quot;car&quot;</p>
                    <p className="text-[10px] text-muted">Stage 1 operational scope</p>
                  </div>
                </div>
              </div>

              {/* 9 Cleared Music Tracks with License Notes */}
              <div className="rounded-2xl bg-surface border border-border p-6 space-y-4">
                <h3 className="font-heading text-base font-bold text-text">
                  Commercial Royalty-Free Music Library (9 Tracks)
                </h3>
                <div className="space-y-2 text-xs">
                  {DEMO_MUSIC_TRACKS.map((t) => (
                    <div key={t.id} className="p-3 rounded-xl bg-surface-2 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-text">{t.title} — {t.artist}</p>
                        <p className="text-[10px] text-muted">{t.vibe} • {t.bpm} BPM</p>
                      </div>
                      <span className="text-[10px] text-accent font-mono text-right max-w-xs">
                        {t.licenseNotes}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Read-Only Roadmap Flags for Stage 2 & Stage 3 */}
              <div className="rounded-2xl bg-surface border border-border p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted" />
                  <h3 className="font-heading text-base font-bold text-text">
                    Future Roadmap Flags (Stages 2 & 3 - Read-Only in Stage 1)
                  </h3>
                </div>
                <p className="text-xs text-muted">
                  Modular architecture flags prepared for future regional expansion and monetization without rewrites.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {ROADMAP_FLAGS.map((flag) => (
                    <div
                      key={flag.id}
                      className="p-3.5 rounded-xl bg-surface-2/60 border border-border flex items-start justify-between gap-3 opacity-75"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-surface border border-border text-muted">
                            Stage {flag.stage}
                          </span>
                          <span className="font-semibold text-text">{flag.name}</span>
                        </div>
                        <p className="text-[10px] text-muted leading-snug">{flag.description}</p>
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-surface text-muted shrink-0">
                        Locked
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Review Drawer Modal */}
      {selectedReviewListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl h-full bg-surface border-l border-border p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-text">
                  Moderate Listing Submission
                </h3>
                <p className="text-xs text-muted">ID: {selectedReviewListing.id}</p>
              </div>
              <button
                onClick={() => setSelectedReviewListing(null)}
                className="p-1 rounded text-muted hover:text-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video preview in drawer */}
            {selectedReviewListing.mediaPath !== 'photos_only' && selectedReviewListing.videoUrl && (
              <div className="max-w-[240px] mx-auto">
                <VerticalVideoPlayer
                  videoUrl={selectedReviewListing.videoUrl}
                  posterUrl={selectedReviewListing.videoPoster}
                  title={selectedReviewListing.title}
                  make={selectedReviewListing.make}
                  autoPlay={false}
                />
              </div>
            )}

            {/* Vehicle Details */}
            <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2 text-xs">
              <h4 className="font-bold text-text">{selectedReviewListing.title}</h4>
              <p className="text-accent font-heading font-extrabold text-base">
                {formatAed(selectedReviewListing.price)}
              </p>
              <div className="grid grid-cols-2 gap-2 text-muted pt-2 border-t border-border/40">
                <div>Seller: <span className="text-text font-semibold">{selectedReviewListing.sellerName}</span></div>
                <div>Mileage: <span className="text-text font-semibold">{formatKm(selectedReviewListing.mileage)}</span></div>
                <div>Area: <span className="text-text font-semibold">{selectedReviewListing.dubaiArea}</span></div>
                <div>Media Path: <span className="text-text font-semibold">{selectedReviewListing.mediaPath}</span></div>
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-text">Attached Photos ({selectedReviewListing.photos.length})</p>
              <div className="grid grid-cols-4 gap-2">
                {selectedReviewListing.photos.slice(0, 8).map((p, i) => (
                  <img key={i} src={p} alt="" className="aspect-square rounded-lg object-cover" />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setRejectModalOpen(true)}
                className="flex-1 py-2.5 rounded-xl bg-danger/20 hover:bg-danger/30 text-danger font-bold text-xs"
              >
                Reject with Reason
              </button>
              <button
                onClick={() => handleApproveListing(selectedReviewListing.id)}
                className="flex-1 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-bg font-extrabold text-xs shadow"
              >
                Approve & Publish Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject with Reason Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-surface border border-danger/40 max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-heading text-lg font-bold text-danger">Specify Rejection Reason</h3>
            <p className="text-muted">This explanation is stored in the audit log and shown directly to the seller.</p>
            <textarea
              required
              rows={4}
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="e.g. Video aspect ratio is horizontal instead of 9:16 portrait, or excessive third-party watermarks."
              className="w-full p-3 rounded-xl bg-surface-2 border border-border text-text focus:outline-none focus:border-danger"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface-2 text-text font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectListing}
                className="px-5 py-2 rounded-xl bg-danger hover:bg-danger/90 text-white font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Dealer Modal */}
      {createDealerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-surface border border-border max-w-md w-full rounded-2xl p-6 shadow-2xl relative space-y-4 text-xs">
            <button onClick={() => setCreateDealerModalOpen(false)} className="absolute top-4 right-4 text-muted p-1">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading text-lg font-bold text-text">Create Dealer Account</h3>
            <p className="text-muted">Register a new official Dubai dealership with verified credentials.</p>

            <form onSubmit={handleCreateDealer} className="space-y-3">
              <div>
                <label className="block font-semibold text-text mb-1">Dealership Commercial Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Al-Wasl Exotics LLC"
                  value={newDealerForm.companyName}
                  onChange={(e) => setNewDealerForm({ ...newDealerForm, companyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Corporate Email *</label>
                <input
                  type="email"
                  required
                  placeholder="sales@alwasl-exotics.ae"
                  value={newDealerForm.email}
                  onChange={(e) => setNewDealerForm({ ...newDealerForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">DED Trade License Number *</label>
                <input
                  type="text"
                  required
                  placeholder="DED-CN-1940291"
                  value={newDealerForm.tradeLicenseNumber}
                  onChange={(e) => setNewDealerForm({ ...newDealerForm, tradeLicenseNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text uppercase font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateDealerModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-2 text-text font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-accent text-bg font-bold"
                >
                  Create Verified Dealer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
