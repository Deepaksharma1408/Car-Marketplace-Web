import { hidePrototypeComment } from '@/lib/prototypeCommunity';
import { resolvePrototypeVideo } from '@/lib/prototypeStorage';
import { 
  Listing, 
  ListingStatus, 
  DealerVerificationRequest, 
  ModerationReport, 
  VideoProcessingJob, 
  SocialVideo, 
  DailyAnalytics,
  User
} from '@/types';
import { INITIAL_LISTINGS } from '@/mocks/listings';
import { DEMO_USERS } from '@/mocks/users';
import { INITIAL_REPORTS } from '@/mocks/reports';
import { INITIAL_SOCIAL_VIDEOS } from '@/mocks/videos';
import { INITIAL_ANALYTICS } from '@/mocks/analytics';
import { DEFAULT_FEATURE_FLAGS, FeatureFlags } from '@/config/flags';

const STORAGE_KEYS = {
  LISTINGS: 'vehiclespot_listings_v5',
  USERS: 'vehiclespot_users_v2',
  VERIFICATIONS: 'vehiclespot_verifications_v2',
  REPORTS: 'vehiclespot_reports_v2',
  VIDEOS: 'vehiclespot_videos_v2',
  JOBS: 'vehiclespot_jobs_v2',
  FLAGS: 'vehiclespot_flags_v2',
  ANALYTICS: 'vehiclespot_analytics_v2',
};

// Initial dealer requests seeded
const INITIAL_VERIFICATION_REQUESTS: DealerVerificationRequest[] = [
  {
    id: 'req_1',
    dealerId: 'user_dealer_7_pending',
    dealerName: 'Apex Horizon Motors LLC',
    contactPerson: 'Faris Al-Nuaimi',
    email: 'contact@apex-horizon-auto.ae',
    phone: '+971 56 443 2190',
    tradeLicenseNumber: 'DED-CN-9948102',
    tradeLicenseExpiry: '2027-05-01',
    documentUrl: '/docs/apex_trade_license_pending.pdf',
    status: 'pending',
    requestedAt: '2026-10-24T14:00:00Z',
  },
  {
    id: 'req_2',
    dealerId: 'user_dealer_8_expired',
    dealerName: 'Heritage Speed Collection',
    contactPerson: 'Tariq Al-Hashemi',
    email: 'manager@heritage-speed.ae',
    phone: '+971 4 220 1199',
    tradeLicenseNumber: 'DED-CN-4410928',
    tradeLicenseExpiry: '2026-08-30',
    documentUrl: '/docs/heritage_expired_license.pdf',
    status: 'suspended',
    rejectionReason: 'Trade license expired on 30-Aug-2026. Official DED renewal certificate required to reactivate dealer badge.',
    requestedAt: '2024-05-10T10:00:00Z',
    reviewedAt: '2026-09-01T09:00:00Z',
    reviewedBy: 'Sarah Connor',
  },
];

const INITIAL_VIDEO_JOBS: VideoProcessingJob[] = [
  {
    id: 'job_101',
    listingId: 'car_pending_2',
    listingTitle: '2024 Porsche 911 Turbo S Coupe',
    sellerName: 'Hamdan Al-Maktoum',
    mediaPath: 'smart_template',
    status: 'completed',
    progress: 100,
    style: 'sport',
    templateId: 'tmpl_sport_turbo',
    musicId: 'track_6',
    logs: [
      '[00:01] Received 4 uploaded raw 4K clips',
      '[00:02] AI Assistant analyzed clips: detected Front stance, Interior cockpit, Exhaust sweep',
      '[00:04] Audio track "Yas Marina Sprint" beat-synced to 138 BPM cuts',
      '[00:08] Hardware-accelerated 1080x1920 60fps render finished',
      '[00:10] Video packaged and ready for moderation approval',
    ],
    startedAt: '2026-10-27T09:12:00Z',
    completedAt: '2026-10-27T09:15:00Z',
  },
  {
    id: 'job_102',
    listingId: 'car_pending_4',
    listingTitle: '2024 Lamborghini Revuelto V12 Hybrid',
    sellerName: 'Silicon East Exotics',
    mediaPath: 'smart_template',
    status: 'completed',
    progress: 100,
    style: 'sport',
    templateId: 'tmpl_sport_apex',
    musicId: 'track_3',
    logs: [
      '[00:01] 5 HD clips loaded into Apex Track Attack template',
      '[00:03] Color grading LUT "Dubai High-Contrast Gold" applied',
      '[00:06] Overlays rendered: AED 2,790,000 | City Walk',
      '[00:09] 1080x1920 master encoded with AAC audio',
    ],
    startedAt: '2026-10-27T11:18:00Z',
    completedAt: '2026-10-27T11:20:00Z',
  },
  {
    id: 'job_103',
    listingId: 'car_pending_6',
    listingTitle: '2024 Bentley Bentayga EWB Azure',
    sellerName: 'Marina Star Automobiles',
    mediaPath: 'ready_video',
    status: 'completed',
    progress: 100,
    logs: [
      '[00:01] Direct video uploaded: 18s, 1080x1920',
      '[00:02] Integrity check passed (H.264 / AAC, no corrupted frames)',
      '[00:03] CDN streaming variants generated',
    ],
    startedAt: '2026-10-27T12:44:00Z',
    completedAt: '2026-10-27T12:45:00Z',
  },
];

// Helper delay simulator
const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

let changeQueued = false;

function setToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    if (!changeQueued) {
      changeQueued = true;
      queueMicrotask(() => { changeQueued = false; window.dispatchEvent(new Event('vehiclespot-data-change')); });
    }
  } catch (e) {
    console.error(`Storage set failed for ${key}`, e);
    throw new Error("Browser storage is full or unavailable. Remove some local data and retry.");
  }
}

// Ensure state is primed
export function initializeStorage() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
    setToStorage(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setToStorage(STORAGE_KEYS.USERS, DEMO_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.VERIFICATIONS)) {
    setToStorage(STORAGE_KEYS.VERIFICATIONS, INITIAL_VERIFICATION_REQUESTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    setToStorage(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.VIDEOS)) {
    setToStorage(STORAGE_KEYS.VIDEOS, INITIAL_SOCIAL_VIDEOS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
    setToStorage(STORAGE_KEYS.JOBS, INITIAL_VIDEO_JOBS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FLAGS)) {
    setToStorage(STORAGE_KEYS.FLAGS, DEFAULT_FEATURE_FLAGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
    setToStorage(STORAGE_KEYS.ANALYTICS, INITIAL_ANALYTICS);
  }
}

// -------------------------------------------------------------
// LISTINGS API
// -------------------------------------------------------------

export interface ListingsQuery {
  query?: string;
  make?: string;
  status?: ListingStatus | 'all';
  sellerId?: string;
  sellerType?: 'dealer' | 'individual';
  dubaiArea?: string;
  minPrice?: number;
  maxPrice?: number;
  mediaPath?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'views' | 'leads';
  limit?: number;
}

export async function getListings(params: ListingsQuery = {}): Promise<Listing[]> {
  await delay(150);
  initializeStorage();
  let list = getFromStorage<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);

  if (params.status && params.status !== 'all') {
    list = list.filter((item) => item.status === params.status);
  }

  if (params.sellerId) {
    list = list.filter((item) => item.sellerId === params.sellerId);
  }

  if (params.sellerType) {
    list = list.filter((item) => item.sellerType === params.sellerType);
  }

  if (params.make) {
    list = list.filter((item) => item.make.toLowerCase() === params.make?.toLowerCase());
  }

  if (params.dubaiArea) {
    list = list.filter((item) => item.dubaiArea.toLowerCase() === params.dubaiArea?.toLowerCase());
  }

  if (params.minPrice !== undefined) {
    list = list.filter((item) => item.price >= (params.minPrice || 0));
  }

  if (params.maxPrice !== undefined) {
    list = list.filter((item) => item.price <= (params.maxPrice || Infinity));
  }

  if (params.mediaPath) {
    list = list.filter((item) => item.mediaPath === params.mediaPath);
  }

  if (params.query) {
    const q = params.query.toLowerCase();
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.make.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.dubaiArea.toLowerCase().includes(q) ||
        item.sellerName.toLowerCase().includes(q)
    );
  }

  // Sorting
  switch (params.sortBy) {
    case 'price_asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'views':
      list.sort((a, b) => b.publicStats.views - a.publicStats.views);
      break;
    case 'leads':
      list.sort(
        (a, b) =>
          b.privateStats.whatsappLeads +
          b.privateStats.callLeads -
          (a.privateStats.whatsappLeads + a.privateStats.callLeads)
      );
      break;
    case 'newest':
    default:
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  if (params.limit) {
    list = list.slice(0, params.limit);
  }

  return Promise.all(list.map(async (item) => ({ ...item, videoUrl: await resolvePrototypeVideo(item.videoUrl) })));
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  await delay(120);
  initializeStorage();
  const list = getFromStorage<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  const found = list.find((item) => item.slug === slug || item.id === slug);
  if (!found || !['live', 'sold'].includes(found.status)) return null;
  return { ...found, videoUrl: await resolvePrototypeVideo(found.videoUrl) };
}

export async function getListingById(id: string): Promise<Listing | null> {
  await delay(100);
  initializeStorage();
  const list = getFromStorage<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  return list.find((item) => item.id === id) || null;
}

export async function createListing(data: Partial<Listing> & { sellerId: string }): Promise<Listing> {
  await delay(250);
  initializeStorage();
  const list = getFromStorage<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);

  const newId = `car_${Date.now()}`;
  const slug = `${data.year || 2024}-${(data.make || 'car').toLowerCase().replace(/\s+/g, '-')}-${(data.model || 'model').toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`;

  const newListing: Listing = {
    id: newId,
    slug,
    title: data.title || `${data.year || 2024} ${data.make || 'Custom'} ${data.model || 'Model'}`,
    make: data.make || 'Porsche',
    model: data.model || '911',
    year: data.year || 2024,
    price: data.price || 500000,
    mileage: data.mileage ?? 1000,
    bodyType: data.bodyType || 'Coupe',
    fuelType: data.fuelType || 'Petrol',
    transmission: data.transmission || 'Automatic (Dual-Clutch PDK/DCT)',
    condition: data.condition || 'Brand New',
    dubaiArea: data.dubaiArea || 'Downtown Dubai',
    city: 'Dubai',
    category: 'car',
    description: data.description || 'Verified luxury listing in Dubai.',
    contactPreference: data.contactPreference || 'both',
    mediaPath: data.mediaPath || 'ready_video',
    status: data.status || 'pending_review', // Default is submitted for review!
    videoUrl: data.videoUrl,
    videoPoster: data.videoPoster,
    videoDuration: data.videoDuration || 15,
    smartTemplateId: data.smartTemplateId,
    musicTrackId: data.musicTrackId,
    photos: data.photos && data.photos.length > 0 ? data.photos : INITIAL_LISTINGS[0].photos,
    coverPhotoIndex: data.coverPhotoIndex || 0,
    sellerId: data.sellerId,
    sellerType: data.sellerType || 'individual',
    sellerName: data.sellerName || 'Verified Seller',
    sellerAvatar: data.sellerAvatar,
    sellerPhone: data.sellerPhone || '+971 50 123 4567',
    isDealerVerified: data.isDealerVerified ?? false,
    publicStats: { views: 0, likes: 0, commentsCount: 0 },
    privateStats: {
      whatsappLeads: 0,
      callLeads: 0,
      saves: 0,
      avgWatchTimeSeconds: data.mediaPath !== 'photos_only' ? 14 : 0,
      completionRatePercent: data.mediaPath !== 'photos_only' ? 85 : 0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    auditHistory: [
      {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: data.status === 'draft' ? 'Saved as draft' : 'Submitted for review',
        performedBy: data.sellerName || 'Seller',
        performedByRole: data.sellerType || 'individual',
        notes: data.mediaPath === 'smart_template' ? 'Compiled via Smart Template AI' : undefined,
      },
    ],
  };

  list.unshift(newListing);
  setToStorage(STORAGE_KEYS.LISTINGS, list);

  // If submitted with video, simulate an operations job
  if (data.mediaPath !== 'photos_only' && data.status !== 'draft') {
    const jobs = getFromStorage<VideoProcessingJob[]>(STORAGE_KEYS.JOBS, INITIAL_VIDEO_JOBS);
    jobs.unshift({
      id: `job_${Date.now()}`,
      listingId: newId,
      listingTitle: newListing.title,
      sellerName: newListing.sellerName,
      mediaPath: newListing.mediaPath,
      status: 'completed',
      progress: 100,
      style: (data as Partial<Listing> & { style?: VideoProcessingJob['style'] }).style || 'premium',
      templateId: data.smartTemplateId,
      musicId: data.musicTrackId,
      logs: [
        `[00:01] Processing initiated for "${newListing.title}"`,
        `[00:03] Format verification: 9:16 vertical resolution confirmed`,
        `[00:05] Smart preview rendered and saved for moderation`,
      ],
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    });
    setToStorage(STORAGE_KEYS.JOBS, jobs);
  }

  return newListing;
}

export async function updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
  await delay(180);
  initializeStorage();
  const list = getFromStorage<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) throw new Error('Listing not found');

  const current = list[index];

  // RULE from prompt: "Editing a live listing returns it to pending review"
  let newStatus = updates.status !== undefined ? updates.status : current.status;
  if (current.status === 'live' && updates.status === undefined) {
    newStatus = 'pending_review';
  }

  const updatedListing: Listing = {
    ...current,
    ...updates,
    status: newStatus,
    updatedAt: new Date().toISOString(),
    auditHistory: [
      ...current.auditHistory,
      {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: current.status === 'live' && newStatus === 'pending_review' 
          ? 'Edited live listing (re-routed to pending review)' 
          : 'Updated listing details',
        performedBy: updates.sellerName || current.sellerName,
        performedByRole: current.sellerType,
      },
    ],
  };

  list[index] = updatedListing;
  setToStorage(STORAGE_KEYS.LISTINGS, list);
  return updatedListing;
}

export async function approveListing(id: string, adminNotes?: string, adminName = 'Sarah Connor'): Promise<Listing> {
  await delay(200);
  initializeStorage();
  const list = getFromStorage<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) throw new Error('Listing not found');

  const current = list[index];
  const updated: Listing = {
    ...current,
    status: 'live',
    rejectionReason: undefined,
    updatedAt: new Date().toISOString(),
    auditHistory: [
      ...current.auditHistory,
      {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'Approved listing for public marketplace',
        performedBy: adminName,
        performedByRole: 'admin',
        notes: adminNotes || 'Specs, video quality, and pricing verified.',
      },
    ],
  };

  list[index] = updated;
  setToStorage(STORAGE_KEYS.LISTINGS, list);
  return updated;
}

export async function rejectListing(id: string, reason: string, adminName = 'Sarah Connor'): Promise<Listing> {
  await delay(200);
  initializeStorage();
  const list = getFromStorage<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) throw new Error('Listing not found');

  const current = list[index];
  const updated: Listing = {
    ...current,
    status: 'rejected',
    rejectionReason: reason,
    updatedAt: new Date().toISOString(),
    auditHistory: [
      ...current.auditHistory,
      {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'Rejected listing',
        performedBy: adminName,
        performedByRole: 'admin',
        notes: reason,
      },
    ],
  };

  list[index] = updated;
  setToStorage(STORAGE_KEYS.LISTINGS, list);
  return updated;
}

export async function markAsSold(id: string, user = 'Seller'): Promise<Listing> {
  await delay(180);
  initializeStorage();
  const list = getFromStorage<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) throw new Error('Listing not found');

  const current = list[index];
  const updated: Listing = {
    ...current,
    status: 'sold',
    updatedAt: new Date().toISOString(),
    auditHistory: [
      ...current.auditHistory,
      {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'Marked car as sold',
        performedBy: user,
        performedByRole: current.sellerType,
      },
    ],
  };

  list[index] = updated;
  setToStorage(STORAGE_KEYS.LISTINGS, list);
  return updated;
}

export async function relistListing(id: string, user = 'Seller'): Promise<Listing> {
  await delay(180);
  initializeStorage();
  const list = getFromStorage<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) throw new Error('Listing not found');

  const current = list[index];
  const updated: Listing = {
    ...current,
    status: 'pending_review',
    rejectionReason: undefined,
    updatedAt: new Date().toISOString(),
    auditHistory: [
      ...current.auditHistory,
      {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'Relisted (submitted for review)',
        performedBy: user,
        performedByRole: current.sellerType,
      },
    ],
  };

  list[index] = updated;
  setToStorage(STORAGE_KEYS.LISTINGS, list);
  return updated;
}

export async function archiveListing(id: string, user = 'Seller'): Promise<Listing> {
  await delay(180);
  initializeStorage();
  const list = getFromStorage<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) throw new Error('Listing not found');

  const current = list[index];
  const updated: Listing = {
    ...current,
    status: 'archived',
    updatedAt: new Date().toISOString(),
    auditHistory: [
      ...current.auditHistory,
      {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'Archived listing',
        performedBy: user,
        performedByRole: current.sellerType,
      },
    ],
  };

  list[index] = updated;
  setToStorage(STORAGE_KEYS.LISTINGS, list);
  return updated;
}

export async function deleteListing(id: string, user = 'Seller'): Promise<boolean> {
  await delay(180);
  initializeStorage();
  const list = getFromStorage<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  const updated = list.filter((item) => item.id !== id);
  setToStorage(STORAGE_KEYS.LISTINGS, updated);
  return true;
}

// -------------------------------------------------------------
// LEADS & ENGAGEMENT API
// -------------------------------------------------------------

export async function logLead(listingId: string, leadType: 'whatsapp' | 'call'): Promise<{ whatsappLeads: number; callLeads: number }> {
  await delay(50);
  initializeStorage();
  const list = getFromStorage<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  const item = list.find((c) => c.id === listingId);

  if (item) {
    if (leadType === 'whatsapp') {
      item.privateStats.whatsappLeads += 1;
    } else {
      item.privateStats.callLeads += 1;
    }
    setToStorage(STORAGE_KEYS.LISTINGS, list);
  }

  // Also update today's analytics lead counter
  const analytics = getFromStorage<DailyAnalytics[]>(STORAGE_KEYS.ANALYTICS, INITIAL_ANALYTICS);
  if (analytics.length > 0) {
    const today = analytics[analytics.length - 1];
    if (leadType === 'whatsapp') {
      today.whatsappLeads += 1;
    } else {
      today.callLeads += 1;
    }
    setToStorage(STORAGE_KEYS.ANALYTICS, analytics);
  }

  return {
    whatsappLeads: item?.privateStats.whatsappLeads ?? 0,
    callLeads: item?.privateStats.callLeads ?? 0,
  };
}

// -------------------------------------------------------------
// DEALER VERIFICATION API
// -------------------------------------------------------------

export async function getDealerVerificationRequests(): Promise<DealerVerificationRequest[]> {
  await delay(150);
  initializeStorage();
  return getFromStorage<DealerVerificationRequest[]>(STORAGE_KEYS.VERIFICATIONS, INITIAL_VERIFICATION_REQUESTS);
}

export async function requestDealerVerification(data: {
  dealerName: string;
  contactPerson: string;
  email: string;
  phone: string;
  tradeLicenseNumber: string;
  tradeLicenseExpiry: string;
  documentUrl?: string;
  dealerId?: string;
}): Promise<DealerVerificationRequest> {
  await delay(250);
  initializeStorage();
  const requests = getFromStorage<DealerVerificationRequest[]>(STORAGE_KEYS.VERIFICATIONS, INITIAL_VERIFICATION_REQUESTS);

  const newReq: DealerVerificationRequest = {
    id: `req_${Date.now()}`,
    dealerId: data.dealerId || `dealer_${Date.now()}`,
    dealerName: data.dealerName,
    contactPerson: data.contactPerson,
    email: data.email,
    phone: data.phone,
    tradeLicenseNumber: data.tradeLicenseNumber,
    tradeLicenseExpiry: data.tradeLicenseExpiry,
    documentUrl: data.documentUrl || '/docs/uploaded_ded_license.pdf',
    status: 'pending',
    requestedAt: new Date().toISOString(),
  };

  requests.unshift(newReq);
  setToStorage(STORAGE_KEYS.VERIFICATIONS, requests);
  return newReq;
}

export async function approveDealerVerification(requestId: string, adminName = 'Sarah Connor'): Promise<DealerVerificationRequest> {
  await delay(200);
  initializeStorage();
  const requests = getFromStorage<DealerVerificationRequest[]>(STORAGE_KEYS.VERIFICATIONS, INITIAL_VERIFICATION_REQUESTS);
  const req = requests.find((r) => r.id === requestId);
  if (!req) throw new Error('Request not found');

  req.status = 'approved';
  req.reviewedAt = new Date().toISOString();
  req.reviewedBy = adminName;
  setToStorage(STORAGE_KEYS.VERIFICATIONS, requests);

  // Update matching user if exists
  const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, DEMO_USERS);
  const user = users.find((u) => u.id === req.dealerId || u.email.toLowerCase() === req.email.toLowerCase());
  if (user) {
    user.role = 'dealer';
    user.isVerifiedDealer = true;
    user.companyName = req.dealerName;
    user.tradeLicenseNumber = req.tradeLicenseNumber;
    user.tradeLicenseExpiry = req.tradeLicenseExpiry;
    setToStorage(STORAGE_KEYS.USERS, users);
  }

  // Update dealer's listings
  const listings = getFromStorage<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  listings.forEach((l) => {
    if (l.sellerId === req.dealerId || l.sellerName === req.dealerName) {
      l.isDealerVerified = true;
    }
  });
  setToStorage(STORAGE_KEYS.LISTINGS, listings);

  return req;
}

export async function rejectDealerVerification(requestId: string, reason: string, adminName = 'Sarah Connor'): Promise<DealerVerificationRequest> {
  await delay(200);
  initializeStorage();
  const requests = getFromStorage<DealerVerificationRequest[]>(STORAGE_KEYS.VERIFICATIONS, INITIAL_VERIFICATION_REQUESTS);
  const req = requests.find((r) => r.id === requestId);
  if (!req) throw new Error('Request not found');

  req.status = 'rejected';
  req.rejectionReason = reason;
  req.reviewedAt = new Date().toISOString();
  req.reviewedBy = adminName;
  setToStorage(STORAGE_KEYS.VERIFICATIONS, requests);
  return req;
}

export async function suspendDealer(dealerId: string, adminName = 'Sarah Connor'): Promise<boolean> {
  await delay(180);
  initializeStorage();
  const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, DEMO_USERS);
  const user = users.find((u) => u.id === dealerId);
  if (user) {
    user.isVerifiedDealer = false;
    setToStorage(STORAGE_KEYS.USERS, users);
  }

  const listings = getFromStorage<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  listings.forEach((l) => {
    if (l.sellerId === dealerId) {
      l.isDealerVerified = false;
    }
  });
  setToStorage(STORAGE_KEYS.LISTINGS, listings);

  return true;
}

// -------------------------------------------------------------
// USERS & MODERATION API
// -------------------------------------------------------------

export async function getUsers(): Promise<User[]> {
  await delay(120);
  initializeStorage();
  return getFromStorage<User[]>(STORAGE_KEYS.USERS, DEMO_USERS);
}

export async function updateUserRole(userId: string, newRole: User['role']): Promise<User> {
  await delay(150);
  initializeStorage();
  const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, DEMO_USERS);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error('User not found');

  user.role = newRole;
  if (newRole === 'dealer') {
    user.isVerifiedDealer = true;
  }
  setToStorage(STORAGE_KEYS.USERS, users);
  return user;
}

export async function getReports(): Promise<ModerationReport[]> {
  await delay(120);
  initializeStorage();
  return getFromStorage<ModerationReport[]>(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
}

export async function handleReportAction(reportId: string, action: ModerationReport['actionTaken']): Promise<ModerationReport> {
  await delay(180);
  initializeStorage();
  const reports = getFromStorage<ModerationReport[]>(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
  const report = reports.find((r) => r.id === reportId);
  if (!report) throw new Error('Report not found');

  report.status = action === 'dismissed' ? 'dismissed' : 'action_taken';
  report.actionTaken = action;
  setToStorage(STORAGE_KEYS.REPORTS, reports);

  // If action is removed, hide the listing if it targets a listing
  if (action === 'removed' && report.targetType === 'listing') {
    const list = getFromStorage<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
    const targetListing = list.find((l) => l.id === report.targetId);
    if (targetListing) {
      targetListing.status = 'rejected';
      targetListing.rejectionReason = `Removed due to moderation report: ${report.reason}`;
      setToStorage(STORAGE_KEYS.LISTINGS, list);
    }
  }

  if (action === 'removed' && report.targetType === 'comment') hidePrototypeComment(report.targetId);
  return report;
}

// -------------------------------------------------------------
// SOCIAL VIDEOS (INDIVIDUALS ONLY)
// -------------------------------------------------------------

export async function getSocialVideos(userId?: string): Promise<SocialVideo[]> {
  await delay(120);
  initializeStorage();
  const videos = getFromStorage<SocialVideo[]>(STORAGE_KEYS.VIDEOS, INITIAL_SOCIAL_VIDEOS);
  if (userId) {
    return videos.filter((v) => v.userId === userId);
  }
  return videos;
}

export async function createSocialVideo(data: {
  userId: string;
  userName: string;
  userAvatar: string;
  caption: string;
  videoUrl: string;
  videoPoster: string;
  duration?: number;
}): Promise<SocialVideo> {
  await delay(200);
  initializeStorage();
  const videos = getFromStorage<SocialVideo[]>(STORAGE_KEYS.VIDEOS, INITIAL_SOCIAL_VIDEOS);

  const newVid: SocialVideo = {
    id: `vid_${Date.now()}`,
    userId: data.userId,
    userName: data.userName,
    userAvatar: data.userAvatar,
    caption: data.caption,
    videoUrl: data.videoUrl,
    videoPoster: data.videoPoster,
    duration: data.duration || 15,
    likes: 1,
    commentsCount: 0,
    views: 12,
    createdAt: new Date().toISOString(),
  };

  videos.unshift(newVid);
  setToStorage(STORAGE_KEYS.VIDEOS, videos);
  return newVid;
}

export async function deleteSocialVideo(id: string): Promise<boolean> {
  await delay(150);
  initializeStorage();
  const videos = getFromStorage<SocialVideo[]>(STORAGE_KEYS.VIDEOS, INITIAL_SOCIAL_VIDEOS);
  const updated = videos.filter((v) => v.id !== id);
  setToStorage(STORAGE_KEYS.VIDEOS, updated);
  return true;
}

// -------------------------------------------------------------
// VIDEO OPERATIONS JOBS API
// -------------------------------------------------------------

export async function getVideoJobs(): Promise<VideoProcessingJob[]> {
  await delay(120);
  initializeStorage();
  return getFromStorage<VideoProcessingJob[]>(STORAGE_KEYS.JOBS, INITIAL_VIDEO_JOBS);
}

export async function retryVideoJob(jobId: string): Promise<VideoProcessingJob> {
  await delay(300);
  initializeStorage();
  const jobs = getFromStorage<VideoProcessingJob[]>(STORAGE_KEYS.JOBS, INITIAL_VIDEO_JOBS);
  const job = jobs.find((j) => j.id === jobId);
  if (!job) throw new Error('Job not found');

  job.status = 'completed';
  job.progress = 100;
  job.error = undefined;
  job.logs.push(`[${new Date().toLocaleTimeString()}] Manual retry succeeded. Re-rendered with zero encoding artifacts.`);
  job.completedAt = new Date().toISOString();

  setToStorage(STORAGE_KEYS.JOBS, jobs);
  return job;
}

// -------------------------------------------------------------
// ANALYTICS & CONFIG API
// -------------------------------------------------------------

export async function getAnalytics(days = 90): Promise<DailyAnalytics[]> {
  await delay(100);
  initializeStorage();
  const full = getFromStorage<DailyAnalytics[]>(STORAGE_KEYS.ANALYTICS, INITIAL_ANALYTICS);
  return full.slice(-days);
}

export async function getFeatureFlags(): Promise<FeatureFlags> {
  await delay(80);
  initializeStorage();
  return getFromStorage<FeatureFlags>(STORAGE_KEYS.FLAGS, DEFAULT_FEATURE_FLAGS);
}

export async function updateFeatureFlags(updates: Partial<FeatureFlags>): Promise<FeatureFlags> {
  await delay(120);
  initializeStorage();
  const current = getFromStorage<FeatureFlags>(STORAGE_KEYS.FLAGS, DEFAULT_FEATURE_FLAGS);
  const updated = { ...current, ...updates };
  setToStorage(STORAGE_KEYS.FLAGS, updated);
  return updated;
}

export async function resetStoreToDefaults(): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(INITIAL_LISTINGS));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS));
  localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(INITIAL_VERIFICATION_REQUESTS));
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
  localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(INITIAL_SOCIAL_VIDEOS));
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_VIDEO_JOBS));
  localStorage.setItem(STORAGE_KEYS.FLAGS, JSON.stringify(DEFAULT_FEATURE_FLAGS));
  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(INITIAL_ANALYTICS));
}
